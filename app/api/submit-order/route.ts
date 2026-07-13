import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { validatePromoCode, incrementPromoUsage } from '@/lib/promo-codes';

// Cliente con service role — corre SOLO en el servidor, nunca llega al browser
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

// Rate limiter en memoria: máx 5 pedidos por IP por hora
const hits = new Map<string, { n: number; reset: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = hits.get(ip);
  if (!entry || now > entry.reset) {
    hits.set(ip, { n: 1, reset: now + 60 * 60 * 1000 });
    return false;
  }
  if (entry.n >= 5) return true;
  entry.n++;
  return false;
}

const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf']);
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_FILE = 10 * 1024 * 1024; // 10 MB

function isValidEcuadorCedula(c: string): boolean {
  if (!/^\d{10}$/.test(c)) return false;
  const prov = parseInt(c.slice(0, 2), 10);
  if (prov < 1 || (prov > 24 && prov !== 30)) return false;
  if (parseInt(c[2], 10) > 5) return false;
  const coefs = [2, 1, 2, 1, 2, 1, 2, 1, 2];
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    let n = parseInt(c[i], 10) * coefs[i];
    if (n >= 10) n -= 9;
    sum += n;
  }
  return (10 - (sum % 10)) % 10 === parseInt(c[9], 10);
}

export async function POST(req: NextRequest) {
  // 1. Rate limiting por IP
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown';
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: 'Demasiados intentos. Espera una hora antes de intentar de nuevo.' },
      { status: 429 },
    );
  }

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: 'Solicitud inválida.' }, { status: 400 });
  }

  // 2. Leer campos
  const slug       = (formData.get('slug')       as string | null)?.trim();
  const eventName  = (formData.get('eventName')  as string | null)?.trim();
  const ticketType = (formData.get('ticketType') as string | null)?.trim();
  const quantity   = parseInt((formData.get('quantity') as string | null) ?? '', 10);
  const total      = parseFloat((formData.get('total')  as string | null) ?? '');
  const nombre     = (formData.get('nombre')     as string | null)?.trim();
  const apellido   = (formData.get('apellido')   as string | null)?.trim();
  const cedula     = (formData.get('cedula')     as string | null)?.trim();
  const telefono   = (formData.get('telefono')   as string | null)?.trim();
  const email      = (formData.get('email')      as string | null)?.trim();
  const promoCode  = (formData.get('promoCode')  as string | null)?.trim() ?? '';
  const file       = formData.get('file') as File | null;

  // 3. Validación server-side (no se puede bypassear desde el browser)
  if (!slug || !eventName || !ticketType || !nombre || !apellido || !cedula || !telefono || !email) {
    return NextResponse.json({ error: 'Faltan campos obligatorios.' }, { status: 400 });
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: 'Correo electrónico inválido.' }, { status: 400 });
  }
  if (!isValidEcuadorCedula(cedula!)) {
    return NextResponse.json({ error: 'Cédula ecuatoriana inválida.' }, { status: 400 });
  }
  if (!/^0\d{8,9}$/.test(telefono!)) {
    return NextResponse.json({ error: 'Número de teléfono inválido.' }, { status: 400 });
  }
  if (nombre!.length < 2 || apellido!.length < 2) {
    return NextResponse.json({ error: 'Nombre y apellido inválidos.' }, { status: 400 });
  }
  if (isNaN(quantity) || quantity < 1 || quantity > 10) {
    return NextResponse.json({ error: 'Cantidad inválida.' }, { status: 400 });
  }
  // Re-calcular total server-side ignorando lo que mandó el cliente
  const ticketPrice   = parseFloat((formData.get('ticketPrice') as string | null) ?? '');
  const subtotal      = isNaN(ticketPrice) ? total : ticketPrice * quantity;

  if (isNaN(subtotal) || subtotal <= 0) {
    return NextResponse.json({ error: 'Total inválido.' }, { status: 400 });
  }

  let discount = 0;
  if (promoCode) {
    const promo = await validatePromoCode(promoCode, subtotal);
    if (promo.valid) discount = promo.discount;
  }
  const verifiedTotal = Math.max(0, subtotal - discount);
  if (!file || file.size === 0) {
    return NextResponse.json({ error: 'El comprobante es obligatorio.' }, { status: 400 });
  }
  if (!ALLOWED_TYPES.has(file.type)) {
    return NextResponse.json({ error: 'Solo se permiten imágenes (JPG, PNG) o PDF.' }, { status: 400 });
  }
  if (file.size > MAX_FILE) {
    return NextResponse.json({ error: 'El archivo supera los 10 MB.' }, { status: 400 });
  }

  // 4. Subir comprobante con service role (bypassa RLS)
  const ext  = file.name.split('.').pop()?.toLowerCase() ?? 'bin';
  const path = `${slug}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const bytes = await file.arrayBuffer();
  const { error: uploadError } = await supabaseAdmin.storage
    .from('comprobantes')
    .upload(path, bytes, { contentType: file.type, upsert: false });

  if (uploadError) {
    console.error('Upload error:', uploadError.message);
    return NextResponse.json({ error: 'Error al subir el comprobante.' }, { status: 500 });
  }

  const { data: urlData } = supabaseAdmin.storage.from('comprobantes').getPublicUrl(path);

  // 5. Insertar pedido con service role
  const { error: insertError } = await supabaseAdmin.from('pedidos').insert({
    event_slug:      slug,
    event_name:      eventName,
    ticket_type:     ticketType,
    quantity,
    total:           verifiedTotal,
    descuento:       discount > 0 ? discount : null,
    promo_code:      promoCode || null,
    nombre,
    apellido,
    cedula,
    telefono,
    email,
    comprobante_url: urlData.publicUrl,
    status:          'pendiente',
  });

  if (insertError) {
    console.error('Insert error:', insertError.message);
    await supabaseAdmin.storage.from('comprobantes').remove([path]);
    return NextResponse.json({ error: 'Error al registrar el pedido.' }, { status: 500 });
  }

  if (promoCode && discount > 0) {
    await incrementPromoUsage(promoCode);
  }

  return NextResponse.json({ ok: true });
}
