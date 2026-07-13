import { NextRequest, NextResponse } from 'next/server';
import { validatePromoCode } from '@/lib/promo-codes';

// Rate limit por IP: 20 req/min
const ipHits = new Map<string, { n: number; reset: number }>();
function isIpLimited(ip: string): boolean {
  const now = Date.now();
  const entry = ipHits.get(ip);
  if (!entry || now > entry.reset) {
    for (const [k, v] of ipHits) if (now > v.reset) ipHits.delete(k);
    ipHits.set(ip, { n: 1, reset: now + 60_000 });
    return false;
  }
  if (entry.n >= 20) return true;
  entry.n++;
  return false;
}

// Rate limit por código: bloquear después de 50 intentos fallidos (cualquier IP)
const codeFailures = new Map<string, { n: number; lockedUntil: number }>();
function isCodeLocked(code: string): boolean {
  const entry = codeFailures.get(code);
  if (!entry) return false;
  return Date.now() < entry.lockedUntil;
}
function recordFailure(code: string): void {
  const now = Date.now();
  const entry = codeFailures.get(code) ?? { n: 0, lockedUntil: 0 };
  entry.n++;
  if (entry.n >= 50) entry.lockedUntil = now + 60 * 60 * 1000; // bloquear 1h
  codeFailures.set(code, entry);
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown';
  if (isIpLimited(ip)) return NextResponse.json({ valid: false, error: 'Demasiados intentos' }, { status: 429 });

  const { code, subtotal } = await req.json();

  if (!code || typeof code !== 'string' || code.length > 64 || code.includes('\0')) {
    return NextResponse.json({ valid: false, error: 'Datos inválidos' }, { status: 400 });
  }
  if (typeof subtotal !== 'number' || !isFinite(subtotal) || subtotal <= 0) {
    return NextResponse.json({ valid: false, error: 'Datos inválidos' }, { status: 400 });
  }

  const normalizedCode = code.toUpperCase().trim();

  if (isCodeLocked(normalizedCode)) {
    return NextResponse.json({ valid: false, error: 'Código temporalmente bloqueado' }, { status: 429 });
  }

  const result = await validatePromoCode(normalizedCode, subtotal);

  if (!result.valid) {
    recordFailure(normalizedCode);
    // Delay artificial para frenar brute force (no afecta al usuario legítimo)
    await new Promise(r => setTimeout(r, 400));
    return NextResponse.json({ valid: false, error: result.error }, { status: 400 });
  }

  return NextResponse.json({ valid: true, discount: result.discount, label: result.label });
}
