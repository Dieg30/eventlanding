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

export default function PrivacidadPage() {
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
            Política de Privacidad
          </h1>
          <p className="text-black/30 text-xs mt-3">Última actualización: julio 2026 · Riobamba, Ecuador</p>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          <div className="h-px bg-black/10 mb-10" />

          {section('1. Responsable del tratamiento',
            <p>De conformidad con la <strong className="text-[#0A0A0A]">Ley Orgánica de Protección de Datos Personales (LOPDP)</strong> del Ecuador, el responsable del tratamiento de tus datos personales es:<br /><br />
              <strong className="text-[#0A0A0A]">UP</strong><br />
              Riobamba, Ecuador<br />
              diegoalexanderc30@gmail.com<br /><br />
              Esta plataforma fue desarrollada por <strong className="text-[#0A0A0A]">Drex</strong> como proveedor tecnológico y no tiene acceso ni responsabilidad sobre los datos personales de los usuarios.
            </p>
          )}

          {section('2. Datos que recopilamos',
            <>
              <p>Al realizar una compra de entrada, recopilamos los siguientes datos personales:</p>
              <ul className="list-disc list-inside space-y-1.5 mt-2 pl-1">
                <li>Nombre y apellido</li>
                <li>Número de cédula de identidad</li>
                <li>Número de teléfono celular</li>
                <li>Dirección de correo electrónico</li>
                <li>Comprobante de transferencia bancaria (imagen o PDF)</li>
              </ul>
            </>
          )}

          {section('3. Finalidad del tratamiento',
            <>
              <p>Tus datos personales son utilizados exclusivamente para:</p>
              <ul className="list-disc list-inside space-y-1.5 mt-2 pl-1">
                <li>Validar el pago y procesar tu solicitud de entrada.</li>
                <li>Enviarte tu entrada digital al correo electrónico registrado.</li>
                <li>Contactarte en caso de incidencias relacionadas con tu compra.</li>
                <li>Verificar tu identidad en el acceso al evento cuando corresponda.</li>
              </ul>
            </>
          )}

          {section('4. Base legal',
            <p>El tratamiento de tus datos se basa en el <strong className="text-[#0A0A0A]">consentimiento expreso</strong> que otorgas al aceptar esta política al momento de completar el formulario de compra, conforme al Art. 8 de la LOPDP.</p>
          )}

          {section('5. Conservación de los datos',
            <p>Conservamos tus datos personales durante el tiempo necesario para cumplir con las finalidades descritas y por el plazo mínimo exigido por la legislación ecuatoriana aplicable (máximo 5 años desde la fecha del evento). Los comprobantes de pago se conservan como respaldo contable.</p>
          )}

          {section('6. Destinatarios',
            <p>Tus datos <strong className="text-[#0A0A0A]">no son vendidos ni cedidos</strong> a terceros. El comprobante y los datos de la transacción son almacenados de forma segura en Supabase (infraestructura en la nube con cifrado en tránsito y en reposo). Solo el organizador del evento tiene acceso a estos datos.</p>
          )}

          {section('7. Tus derechos (LOPDP)',
            <>
              <p>Como titular de tus datos, tienes derecho a:</p>
              <ul className="list-disc list-inside space-y-1.5 mt-2 pl-1">
                <li><strong className="text-[#0A0A0A]">Acceso:</strong> conocer qué datos tuyos tenemos almacenados.</li>
                <li><strong className="text-[#0A0A0A]">Rectificación:</strong> corregir datos inexactos.</li>
                <li><strong className="text-[#0A0A0A]">Supresión:</strong> solicitar la eliminación de tus datos.</li>
                <li><strong className="text-[#0A0A0A]">Oposición:</strong> oponerte al tratamiento en cualquier momento.</li>
                <li><strong className="text-[#0A0A0A]">Portabilidad:</strong> recibir tus datos en formato estructurado.</li>
              </ul>
              <p className="mt-2">Para ejercer cualquiera de estos derechos, escríbenos a <strong className="text-[#0A0A0A]">diegoalexanderc30@gmail.com</strong> indicando tu solicitud. Responderemos en un plazo máximo de 15 días hábiles.</p>
            </>
          )}

          {section('8. Seguridad',
            <p>Aplicamos medidas técnicas y organizativas para proteger tus datos contra acceso no autorizado, pérdida o alteración. Sin embargo, ningún sistema de transmisión por internet es 100% seguro; en caso de brecha de seguridad que afecte tus datos, serás notificado conforme a lo establecido en la LOPDP.</p>
          )}

          {section('9. Cambios a esta política',
            <p>Podemos actualizar esta política en cualquier momento. La fecha de última actualización aparece al inicio del documento. Te recomendamos revisarla periódicamente.</p>
          )}

          {section('10. Contacto',
            <p>Para cualquier consulta sobre el tratamiento de tus datos personales, contáctanos en <strong className="text-[#0A0A0A]">diegoalexanderc30@gmail.com</strong>.</p>
          )}

          <div className="h-px bg-black/10 mt-10 mb-8" />
          <p className="text-black/20 text-xs">
            Ver también nuestros{' '}
            <Link href="/terminos" className="underline underline-offset-2 hover:text-black/50 transition-colors">
              Términos y Condiciones
            </Link>.
          </p>
        </motion.div>
      </div>
    </main>
  );
}
