'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import Navbar from '@/components/Navbar';

const section = (title: string, children: React.ReactNode) => (
  <div className="mb-10">
    <h2 className="font-semibold text-[#0A0A0A] text-sm mb-3 uppercase tracking-widest">{title}</h2>
    <div className="text-black/50 text-sm leading-relaxed space-y-3">{children}</div>
  </div>
);

export default function TerminosPage() {
  return (
    <main className="bg-[#F8F8F6] text-[#0A0A0A] min-h-screen">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-28 pb-20">

        <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} className="mb-10">
          <Link href="/" className="inline-flex items-center gap-2 text-black/28 hover:text-black/60 transition-colors text-xs uppercase tracking-widest">
            <ArrowLeft className="w-3.5 h-3.5" /> Volver
          </Link>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <p className="text-black/20 text-[10px] uppercase tracking-[0.45em] mb-2">Legal</p>
          <h1
            className="font-[family-name:var(--font-bebas-neue)] text-[#0A0A0A] leading-none"
            style={{ fontSize: 'clamp(38px, 7vw, 72px)', letterSpacing: '-0.015em' }}
          >
            Términos y Condiciones
          </h1>
          <p className="text-black/30 text-xs mt-3">Última actualización: julio 2026 · Riobamba, Ecuador</p>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          <div className="h-px bg-black/10 mb-10" />

          {section('1. Sobre la plataforma',
            <p>Esta plataforma es operada por <strong className="text-[#0A0A0A]">UP</strong>, con domicilio en Riobamba, Ecuador. Contacto: diegoalexanderc30@gmail.com.<br /><br />
            Los eventos publicados pueden ser organizados por UP u otros promotores o productoras independientes. Cada evento indica a su respectivo organizador. UP actúa como plataforma intermediaria de venta de entradas y no asume responsabilidad por la organización de eventos de terceros.</p>
          )}

          {section('2. Proceso de compra',
            <>
              <p>La adquisición de entradas se realiza mediante transferencia bancaria. El proceso es el siguiente:</p>
              <ol className="list-decimal list-inside space-y-1.5 mt-2 pl-1">
                <li>Selecciona el evento, tipo y cantidad de entradas.</li>
                <li>Completa el formulario con tus datos personales.</li>
                <li>Realiza la transferencia al número de cuenta indicado por el monto exacto.</li>
                <li>Sube el comprobante de pago (imagen o PDF).</li>
                <li>Recibirás tu entrada digital al correo en un máximo de 24 horas hábiles tras la validación del pago.</li>
              </ol>
            </>
          )}

          {section('3. Política de reembolsos',
            <>
              <p><strong className="text-[#0A0A0A]">No se realizan reembolsos</strong> una vez efectuada la transferencia y enviado el comprobante, salvo en los siguientes casos:</p>
              <ul className="list-disc list-inside space-y-1.5 mt-2 pl-1">
                <li>Cancelación del evento por parte de UP.</li>
                <li>Cambio de fecha que imposibilite la asistencia del comprador, previa verificación.</li>
              </ul>
              <p className="mt-2">En caso de reembolso procedente, el valor se devolverá por el mismo medio de pago en un plazo máximo de 7 días hábiles.</p>
            </>
          )}

          {section('4. Restricciones de edad',
            <p>Los eventos marcados como <strong className="text-[#0A0A0A]">+18</strong> son exclusivamente para mayores de 18 años. El organizador podrá solicitar documento de identidad en el ingreso. La compra de una entrada para un evento +18 implica la declaración del comprador de ser mayor de edad.</p>
          )}

          {section('5. Modificación o cancelación de eventos',
            <p>UP se reserva el derecho de modificar la fecha, hora, lugar o artistas de un evento por causas de fuerza mayor o decisión organizativa. En caso de cancelación definitiva, se procederá al reembolso conforme a la cláusula 3. No se garantiza reembolso por cambios en la programación artística.</p>
          )}

          {section('6. Responsabilidad',
            <p>UP no se responsabiliza por daños, pérdidas o lesiones ocurridos durante el evento, más allá de lo establecido por la legislación ecuatoriana vigente. El asistente acepta las condiciones de acceso del venue donde se realiza el evento.</p>
          )}

          {section('7. Propiedad intelectual',
            <p>Todos los contenidos de esta plataforma (imágenes, textos, logotipos) son propiedad de UP o de sus respectivos titulares. Queda prohibida su reproducción sin autorización expresa.</p>
          )}

          {section('8. Ley aplicable',
            <p>Estos términos se rigen por las leyes de la República del Ecuador. Para cualquier controversia, las partes se someten a los jueces y tribunales competentes de la ciudad de Riobamba.</p>
          )}

          {section('9. Contacto',
            <p>Para consultas relacionadas con estos términos, escríbenos a <strong className="text-[#0A0A0A]">diegoalexanderc30@gmail.com</strong>.</p>
          )}

          <div className="h-px bg-black/10 mt-10 mb-8" />
          <p className="text-black/20 text-xs">
            Al completar una compra en esta plataforma, aceptas estos Términos y Condiciones en su totalidad.
            Ver también nuestra{' '}
            <Link href="/privacidad" className="underline underline-offset-2 hover:text-black/50 transition-colors">
              Política de Privacidad
            </Link>.
          </p>
        </motion.div>
      </div>
    </main>
  );
}
