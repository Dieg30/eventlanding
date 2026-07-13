import { NextRequest, NextResponse } from 'next/server';
import { validatePromoCode } from '@/lib/promo-codes';

export async function POST(req: NextRequest) {
  const { code, subtotal } = await req.json();

  if (!code || typeof subtotal !== 'number') {
    return NextResponse.json({ valid: false, error: 'Datos inválidos' }, { status: 400 });
  }

  const result = await validatePromoCode(code, subtotal);

  if (!result.valid) {
    return NextResponse.json({ valid: false, error: result.error }, { status: 400 });
  }

  return NextResponse.json({ valid: true, discount: result.discount, label: result.label });
}
