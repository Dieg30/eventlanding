import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { calcDiscount } from '@/lib/promo-codes';
import { getEventBySlug, getEffectivePrice } from '@/lib/events';

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
    // Limpiar entradas expiradas cada vez que se crea una nueva (evita memory leak)
    for (const [k, v] of hits) if (now > v.reset) hits.delete(k);
    hits.set(ip, { n: 1, reset: now + 60 * 60 * 1000 });
    return false;
  }
  if (entry.n >= 5) return true;
  entry.n++;
  return false;
}

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
  const ticketType = (formData.get('ticketType') as string | null)?.trim();
  const quantity   = parseInt((formData.get('quantity') as string | null) ?? '', 10);
  const nombre     = (formData.get('nombre')     as string | null)?.trim();
  const apellido   = (formData.get('apellido')   as string | null)?.trim();
  const cedula     = (formData.get('cedula')     as string | null)?.trim();
  const telefono   = (formData.get('telefono')   as string | null)?.trim();
  const email      = (formData.get('email')      as string | null)?.trim();
  const promoCode  = (formData.get('promoCode')  as string | null)?.trim() ?? '';
  const file       = formData.get('file') as File | null;

  // 3. Validación server-side (no se puede bypassear desde el browser)
  if (!slug || !ticketType || !nombre || !apellido || !cedula || !telefono || !email) {
    return NextResponse.json({ error: 'Faltan campos obligatorios.' }, { status: 400 });
  }
  if ([nombre, apellido, cedula, telefono, email, slug, ticketType, promoCode].some(v => v.includes('\0'))) {
    return NextResponse.json({ error: 'Solicitud inválida.' }, { status: 400 });
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
  if (nombre!.length < 2 || nombre!.length > 80 || apellido!.length < 2 || apellido!.length > 80) {
    return NextResponse.json({ error: 'Nombre y apellido inválidos.' }, { status: 400 });
  }
  if (email!.length > 254) {
    return NextResponse.json({ error: 'Correo electrónico inválido.' }, { status: 400 });
  }
  if (promoCode.length > 64) {
    return NextResponse.json({ error: 'Código de descuento inválido.' }, { status: 400 });
  }
  if (isNaN(quantity) || quantity < 1 || quantity > 5) {
    return NextResponse.json({ error: 'Cantidad inválida.' }, { status: 400 });
  }
  // Re-calcular precio desde los datos del servidor — nunca confiar en el cliente
  const event = getEventBySlug(slug!);
  if (!event) return NextResponse.json({ error: 'Evento no encontrado.' }, { status: 404 });
  if (event.past) return NextResponse.json({ error: 'Este evento ya finalizó.' }, { status: 400 });
  const serverTicketType = event.ticketTypes.find(t => t.name === ticketType);
  if (!serverTicketType) return NextResponse.json({ error: 'Tipo de entrada inválido.' }, { status: 400 });
  const subtotal = getEffectivePrice(serverTicketType, event.earlyBirdEnds) * quantity;

  if (subtotal <= 0) {
    return NextResponse.json({ error: 'Total inválido.' }, { status: 400 });
  }

  // Verificar tope de 5 entradas por cédula por evento (sumando todas sus compras)
  const MAX_PER_CEDULA = 5;
  const { data: prevOrders } = await supabaseAdmin
    .from('pedidos')
    .select('quantity')
    .eq('cedula', cedula)
    .eq('event_slug', slug);
  const alreadyBought = prevOrders?.reduce((s, r) => s + (r.quantity ?? 0), 0) ?? 0;
  if (alreadyBought + quantity > MAX_PER_CEDULA) {
    const remaining = MAX_PER_CEDULA - alreadyBought;
    const msg = remaining <= 0
      ? 'Ya alcanzaste el límite de entradas para este evento con esta cédula.'
      : `Solo puedes comprar ${remaining} entrada${remaining > 1 ? 's' : ''} más para este evento.`;
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  // Normalizar código antes de pasarlo a la DB
  const normalizedPromo = promoCode ? promoCode.toUpperCase() : '';

  // Reclamar código de descuento atómicamente (check + increment en un solo UPDATE)
  let discount = 0;
  let promoClaimed = false;
  if (normalizedPromo) {
    const { data: claimData, error: claimError } = await supabaseAdmin
      .rpc('claim_promo_code', { p_codigo: normalizedPromo });
    if (!claimError && claimData?.claimed) {
      discount = calcDiscount(claimData.tipo, claimData.valor, subtotal);
      promoClaimed = true;
    }
  }
  const verifiedTotal = Math.max(0, subtotal - discount);

  // Helper: liberar código ya reclamado y responder con error
  async function abortWithClaim(msg: string, status: number): Promise<NextResponse> {
    if (promoClaimed) await supabaseAdmin.rpc('release_promo_code', { p_codigo: normalizedPromo });
    return NextResponse.json({ error: msg }, { status });
  }

  if (!file || file.size === 0) return abortWithClaim('El comprobante es obligatorio.', 400);
  if (file.size > MAX_FILE)     return abortWithClaim('El archivo supera los 10 MB.', 400);

  // Verificar tipo real por magic bytes (no confiar en Content-Type del cliente)
  const bytes    = await file.arrayBuffer();
  const header   = new Uint8Array(bytes.slice(0, 8));
  const isJpeg   = header[0] === 0xFF && header[1] === 0xD8;
  const isPng    = header[0] === 0x89 && header[1] === 0x50 && header[2] === 0x4E && header[3] === 0x47;
  const isPdf    = header[0] === 0x25 && header[1] === 0x50 && header[2] === 0x44 && header[3] === 0x46;
  const isWebp   = header[0] === 0x52 && header[1] === 0x49 && header[2] === 0x46 && header[3] === 0x46;
  if (!isJpeg && !isPng && !isPdf && !isWebp) {
    return abortWithClaim('Solo se permiten imágenes (JPG, PNG, WEBP) o PDF.', 400);
  }

  // 4. Subir comprobante con service role (bypassa RLS)
  const ext  = isPdf ? 'pdf' : isPng ? 'png' : isWebp ? 'webp' : 'jpg';
  const path = `${slug}/${crypto.randomUUID()}.${ext}`;
  const { error: uploadError } = await supabaseAdmin.storage
    .from('comprobantes')
    .upload(path, bytes, { contentType: isPdf ? 'application/pdf' : isPng ? 'image/png' : isWebp ? 'image/webp' : 'image/jpeg', upsert: false });

  if (uploadError) {
    console.error('Upload error:', uploadError.message);
    if (promoClaimed) await supabaseAdmin.rpc('release_promo_code', { p_codigo: normalizedPromo });
    return NextResponse.json({ error: 'Error al subir el comprobante.' }, { status: 500 });
  }

  const ONE_YEAR = 365 * 24 * 60 * 60;
  const { data: signedData, error: signError } = await supabaseAdmin.storage
    .from('comprobantes')
    .createSignedUrl(path, ONE_YEAR);

  if (signError || !signedData) {
    console.error('Signed URL error:', signError?.message);
    await supabaseAdmin.storage.from('comprobantes').remove([path]);
    if (promoClaimed) await supabaseAdmin.rpc('release_promo_code', { p_codigo: normalizedPromo });
    return NextResponse.json({ error: 'Error al procesar el comprobante.' }, { status: 500 });
  }

  // 5. Insertar pedido con service role
  const orderRow: Record<string, unknown> = {
    event_slug:       slug,
    event_name:       event.name,
    ticket_type:      ticketType,
    quantity,
    total:            verifiedTotal,
    nombre,
    apellido,
    cedula,
    telefono,
    email,
    comprobante_url:  signedData.signedUrl,
    comprobante_path: path,
    status:           'pendiente',
  };
  if (discount > 0)  orderRow.descuento  = discount;
  if (normalizedPromo) orderRow.promo_code = normalizedPromo;

  const { error: insertError } = await supabaseAdmin.from('pedidos').insert(orderRow);

  if (insertError) {
    console.error('Insert error:', insertError.message);
    // Revertir: eliminar archivo subido y devolver el uso del código
    await supabaseAdmin.storage.from('comprobantes').remove([path]);
    if (promoClaimed) {
      await supabaseAdmin.rpc('release_promo_code', { p_codigo: normalizedPromo });
    }
    return NextResponse.json({ error: 'Error al registrar el pedido.' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
