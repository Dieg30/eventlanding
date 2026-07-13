import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export interface PromoResult {
  valid: boolean;
  discount: number;
  label: string;
  error?: string;
}

export async function validatePromoCode(code: string, subtotal: number): Promise<PromoResult> {
  const { data, error } = await supabaseAdmin
    .from('codigos_descuento')
    .select('tipo, valor, activo, usos_maximos, usos_actuales, valido_hasta')
    .eq('codigo', code.toUpperCase().trim())
    .single();

  if (error || !data) {
    return { valid: false, discount: 0, label: '', error: 'Código inválido o expirado' };
  }
  if (!data.activo) {
    return { valid: false, discount: 0, label: '', error: 'Código inválido o expirado' };
  }
  if (data.valido_hasta && new Date(data.valido_hasta) < new Date()) {
    return { valid: false, discount: 0, label: '', error: 'Código expirado' };
  }
  if (data.usos_maximos !== null && data.usos_actuales >= data.usos_maximos) {
    return { valid: false, discount: 0, label: '', error: 'Código agotado' };
  }

  const discount = calcDiscount(data.tipo, data.valor, subtotal);
  const label    = data.tipo === 'percent'
    ? `${data.valor}% de descuento`
    : `$${data.valor} de descuento`;

  return { valid: true, discount, label };
}

export async function incrementPromoUsage(code: string) {
  // El RPC hace un UPDATE atómico a nivel DB — seguro bajo concurrencia
  await supabaseAdmin.rpc('increment_promo_usage', { p_codigo: code.toUpperCase().trim() });
}

export function calcDiscount(tipo: string, valor: number, subtotal: number): number {
  if (tipo === 'percent') return Math.round(subtotal * valor) / 100;
  return Math.min(valor, subtotal);
}
