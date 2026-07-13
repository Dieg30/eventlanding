'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import Navbar from '@/components/Navbar';

const Section = ({ n, title, children }: { n: string; title: string; children: React.ReactNode }) => (
  <div className="mb-12">
    <div className="flex items-baseline gap-3 mb-4">
      <span className="text-black/18 text-[10px] font-mono">{n}</span>
      <h2 className="font-semibold text-[#0A0A0A] text-sm uppercase tracking-widest">{title}</h2>
    </div>
    <div className="text-black/50 text-sm leading-relaxed space-y-3 pl-6">{children}</div>
  </div>
);

export default function PrivacidadPage() {
  return (
    <main className="bg-[#F8F8F6] text-[#0A0A0A] min-h-screen">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-28 pb-24">

        <motion.div initial={{ x: -8 }} animate={{ x: 0 }} className="mb-10">
          <Link href="/" className="inline-flex items-center gap-2 text-black/28 hover:text-black/60 transition-colors text-xs uppercase tracking-widest">
            <ArrowLeft className="w-3.5 h-3.5" /> Volver
          </Link>
        </motion.div>

        <motion.div initial={{ y: 16 }} animate={{ y: 0 }} className="mb-12">
          <p className="text-black/20 text-[10px] uppercase tracking-[0.45em] mb-2">Legal</p>
          <h1
            className="font-[family-name:var(--font-bebas-neue)] text-[#0A0A0A] leading-none"
            style={{ fontSize: 'clamp(38px, 7vw, 72px)', letterSpacing: '-0.015em' }}
          >
            Política de Privacidad
          </h1>
          <p className="text-black/30 text-xs mt-3">Última actualización: julio 2026 · Riobamba, Ecuador</p>
        </motion.div>

        <motion.div initial={{ y: 8 }} animate={{ y: 0 }} transition={{ delay: 0.2 }}>
          <div className="h-px bg-black/10 mb-12" />

          <p className="text-black/45 text-sm leading-relaxed mb-12">
            En <strong className="text-[#0A0A0A]">UP</strong> nos comprometemos a proteger la privacidad de quienes utilizan nuestra plataforma. Esta Política de Privacidad describe qué datos personales recopilamos, con qué finalidad, cómo los protegemos y cuáles son tus derechos como titular, de conformidad con la <strong className="text-[#0A0A0A]">Ley Orgánica de Protección de Datos Personales (LOPDP)</strong> de la República del Ecuador y demás normativa aplicable.
          </p>

          <Section n="01" title="Responsable del tratamiento">
            <p>El responsable del tratamiento de los datos personales recopilados a través de esta Plataforma es:</p>
            <div className="bg-white border border-black/[0.07] rounded-xl p-4 mt-2 space-y-1">
              <p><strong className="text-[#0A0A0A]">Denominación:</strong> UP</p>
              <p><strong className="text-[#0A0A0A]">Domicilio:</strong> Riobamba, provincia de Chimborazo, Ecuador</p>
              <p><strong className="text-[#0A0A0A]">Correo:</strong> informacion@unipolifest.com</p>
            </div>
            <p className="mt-3">La infraestructura tecnológica de la Plataforma fue desarrollada por <strong className="text-[#0A0A0A]">Drex</strong> en calidad de proveedor de servicios tecnológicos. Drex actúa como encargado del tratamiento y no tiene acceso autónomo a los datos personales de los usuarios ni los utiliza para fines propios.</p>
          </Section>

          <Section n="02" title="Datos personales que recopilamos">
            <p>Al realizar una compra de entrada a través de la Plataforma, recopilamos los siguientes datos:</p>
            <ul className="list-disc list-inside space-y-1.5 mt-2">
              <li><strong className="text-[#0A0A0A]">Nombre y apellido</strong></li>
              <li><strong className="text-[#0A0A0A]">Número de cédula de identidad</strong> — para verificación de identidad y límite de entradas por persona</li>
              <li><strong className="text-[#0A0A0A]">Número de teléfono celular (WhatsApp)</strong> — para el envío de la entrada digital</li>
              <li><strong className="text-[#0A0A0A]">Dirección de correo electrónico</strong> — para el envío de la entrada digital y comunicaciones del evento</li>
              <li><strong className="text-[#0A0A0A]">Comprobante de transferencia bancaria</strong> (imagen JPG, PNG, WEBP o PDF) — para validar el pago</li>
            </ul>
            <p className="mt-3">Adicionalmente, la Plataforma puede registrar de forma automática la dirección IP del dispositivo desde el que se realiza la solicitud, con fines exclusivos de seguridad y prevención de fraude (control de intentos abusivos).</p>
            <p>No recopilamos datos sensibles como información médica, religión, ideología política ni datos biométricos.</p>
          </Section>

          <Section n="03" title="Finalidad del tratamiento">
            <p>Los datos personales que recopilamos son utilizados únicamente para las siguientes finalidades:</p>
            <ul className="list-disc list-inside space-y-2 mt-2">
              <li><strong className="text-[#0A0A0A]">Gestión de la compra:</strong> verificar el pago realizado y procesar la solicitud de entrada.</li>
              <li><strong className="text-[#0A0A0A]">Entrega de la entrada digital:</strong> enviar el acceso al evento al correo electrónico y número de WhatsApp proporcionados.</li>
              <li><strong className="text-[#0A0A0A]">Atención al usuario:</strong> contactar al comprador en caso de incidencias, dudas o problemas relacionados con su pedido.</li>
              <li><strong className="text-[#0A0A0A]">Control de acceso:</strong> verificar la identidad del asistente en el ingreso al evento cuando así lo requiera el organizador.</li>
              <li><strong className="text-[#0A0A0A]">Seguridad y prevención de fraude:</strong> detectar y prevenir comportamientos abusivos, como la adquisición masiva de entradas con fines de reventa.</li>
              <li><strong className="text-[#0A0A0A]">Cumplimiento legal:</strong> conservar registros contables y de transacciones conforme a la legislación ecuatoriana vigente.</li>
            </ul>
            <p className="mt-3">No utilizamos tus datos para elaborar perfiles de comportamiento, publicidad personalizada ni los cedemos a terceros con fines comerciales.</p>
          </Section>

          <Section n="04" title="Base legal del tratamiento">
            <p>El tratamiento de tus datos personales se sustenta en las siguientes bases legales reconocidas por la LOPDP:</p>
            <ul className="list-disc list-inside space-y-2 mt-2">
              <li><strong className="text-[#0A0A0A]">Consentimiento expreso (Art. 8 LOPDP):</strong> otorgado al aceptar esta Política de Privacidad al momento de completar el formulario de compra.</li>
              <li><strong className="text-[#0A0A0A]">Ejecución de un contrato (Art. 9 LOPDP):</strong> el tratamiento es necesario para cumplir con la relación contractual derivada de la compra de entradas.</li>
              <li><strong className="text-[#0A0A0A]">Cumplimiento de obligaciones legales (Art. 10 LOPDP):</strong> conservación de registros contables y fiscales exigidos por la normativa ecuatoriana.</li>
              <li><strong className="text-[#0A0A0A]">Interés legítimo (Art. 11 LOPDP):</strong> para fines de seguridad y prevención de fraude, siempre que no prevalezcan los derechos del titular.</li>
            </ul>
          </Section>

          <Section n="05" title="Conservación de los datos">
            <p>Conservamos tus datos personales durante el tiempo estrictamente necesario para cumplir con las finalidades descritas en esta política:</p>
            <ul className="list-disc list-inside space-y-2 mt-2">
              <li><strong className="text-[#0A0A0A]">Datos de la compra y comprobante de pago:</strong> hasta 5 años desde la fecha del evento, como respaldo contable y en cumplimiento de la normativa tributaria ecuatoriana.</li>
              <li><strong className="text-[#0A0A0A]">Datos de contacto (correo, teléfono):</strong> hasta 12 meses después del evento, salvo que solicites su eliminación antes.</li>
              <li><strong className="text-[#0A0A0A]">Registros de seguridad (IP):</strong> máximo 90 días, salvo requerimiento legal en contrario.</li>
            </ul>
            <p className="mt-3">Transcurridos dichos plazos, los datos serán eliminados o anonimizados de forma irreversible.</p>
          </Section>

          <Section n="06" title="Destinatarios y transferencias de datos">
            <p>Tus datos personales <strong className="text-[#0A0A0A]">no son vendidos ni compartidos con terceros</strong> con fines comerciales o publicitarios. Sin embargo, para el funcionamiento de la Plataforma, tus datos pueden ser accedidos por los siguientes encargados del tratamiento:</p>
            <ul className="list-disc list-inside space-y-2 mt-2">
              <li><strong className="text-[#0A0A0A]">Supabase Inc.:</strong> proveedor de base de datos e infraestructura en la nube donde se almacenan los pedidos y comprobantes. Los datos se cifran en tránsito (TLS) y en reposo (AES-256). Supabase actúa como encargado del tratamiento bajo acuerdo de confidencialidad.</li>
              <li><strong className="text-[#0A0A0A]">Organizador del evento:</strong> en los casos en que el evento sea organizado por un tercero, el organizador tendrá acceso a los datos necesarios para validar el acceso (nombre, cédula, tipo de entrada).</li>
            </ul>
            <p className="mt-3">No se realizan transferencias internacionales de datos fuera del marco legal aplicable. En caso de requerimiento por autoridad competente, UP cumplirá con la normativa ecuatoriana vigente.</p>
          </Section>

          <Section n="07" title="Seguridad de los datos">
            <p>UP implementa medidas técnicas y organizativas adecuadas para proteger tus datos personales contra acceso no autorizado, pérdida, alteración o divulgación, incluyendo:</p>
            <ul className="list-disc list-inside space-y-2 mt-2">
              <li>Cifrado en tránsito mediante HTTPS/TLS en todas las comunicaciones.</li>
              <li>Almacenamiento cifrado en reposo en los servidores de Supabase.</li>
              <li>Acceso restringido a los datos mediante roles y permisos (Row Level Security).</li>
              <li>Limitación de intentos de validación de códigos mediante control de tasa por IP.</li>
              <li>Revisión periódica de las medidas de seguridad implementadas.</li>
            </ul>
            <p className="mt-3">En caso de producirse una brecha de seguridad que pueda afectar tus derechos, UP te notificará en el plazo establecido por la LOPDP y adoptará las medidas correctivas necesarias.</p>
          </Section>

          <Section n="08" title="Tus derechos como titular">
            <p>De conformidad con la LOPDP, como titular de tus datos personales tienes los siguientes derechos:</p>
            <ul className="list-disc list-inside space-y-2 mt-2">
              <li><strong className="text-[#0A0A0A]">Acceso:</strong> obtener confirmación sobre si tratamos tus datos y acceder a los mismos.</li>
              <li><strong className="text-[#0A0A0A]">Rectificación:</strong> solicitar la corrección de datos inexactos o incompletos.</li>
              <li><strong className="text-[#0A0A0A]">Supresión ("derecho al olvido"):</strong> solicitar la eliminación de tus datos cuando ya no sean necesarios para las finalidades para las que fueron recopilados, siempre que no exista obligación legal de conservación.</li>
              <li><strong className="text-[#0A0A0A]">Oposición:</strong> oponerte al tratamiento de tus datos en cualquier momento, en especial cuando se base en interés legítimo.</li>
              <li><strong className="text-[#0A0A0A]">Limitación del tratamiento:</strong> solicitar que el tratamiento de tus datos quede restringido a su conservación mientras se resuelve una reclamación.</li>
              <li><strong className="text-[#0A0A0A]">Portabilidad:</strong> recibir tus datos en un formato estructurado, de uso común y lectura mecánica.</li>
              <li><strong className="text-[#0A0A0A]">Revocación del consentimiento:</strong> retirar el consentimiento otorgado en cualquier momento, sin que ello afecte la licitud del tratamiento previo.</li>
            </ul>
            <p className="mt-3">Para ejercer cualquiera de estos derechos, envía tu solicitud a <strong className="text-[#0A0A0A]">informacion@unipolifest.com</strong> indicando tu nombre completo, número de cédula y el derecho que deseas ejercer. Responderemos en un plazo máximo de <strong className="text-[#0A0A0A]">15 días hábiles</strong>.</p>
            <p>Si consideras que el tratamiento de tus datos vulnera la normativa vigente, tienes derecho a presentar una reclamación ante la <strong className="text-[#0A0A0A]">Autoridad de Protección de Datos Personales del Ecuador</strong>.</p>
          </Section>

          <Section n="09" title="Cookies y tecnologías de seguimiento">
            <p>La Plataforma no utiliza cookies de rastreo publicitario ni tecnologías de seguimiento de terceros. Únicamente se pueden generar cookies técnicas estrictamente necesarias para el funcionamiento del sitio (como la gestión de sesión), las cuales no almacenan información personal identificable más allá de lo necesario para la navegación.</p>
            <p>No integramos herramientas de analítica de terceros (Google Analytics, Meta Pixel u similares) que transmitan tus datos a plataformas externas.</p>
          </Section>

          <Section n="10" title="Menores de edad">
            <p>La Plataforma está destinada a personas mayores de 18 años. No recopilamos conscientemente datos personales de menores de edad. Si detectamos que se han recopilado datos de un menor sin consentimiento parental, procederemos a eliminarlos de inmediato.</p>
            <p>Si eres padre, madre o tutor y crees que tu hijo menor ha proporcionado datos a través de la Plataforma, contáctanos en <strong className="text-[#0A0A0A]">informacion@unipolifest.com</strong>.</p>
          </Section>

          <Section n="11" title="Actualizaciones de esta política">
            <p>UP se reserva el derecho de actualizar o modificar esta Política de Privacidad en cualquier momento para adaptarla a cambios legislativos, jurisprudenciales o de funcionamiento interno. La fecha de última actualización aparece al inicio de este documento.</p>
            <p>Te recomendamos revisar esta página periódicamente. El uso continuado de la Plataforma tras la publicación de cambios implica la aceptación de la versión actualizada.</p>
          </Section>

          <Section n="12" title="Contacto y reclamaciones">
            <p>Para cualquier consulta, solicitud o reclamación relacionada con el tratamiento de tus datos personales, puedes contactarnos en:</p>
            <div className="bg-white border border-black/[0.07] rounded-xl p-4 mt-2 space-y-1">
              <p><strong className="text-[#0A0A0A]">Correo:</strong> informacion@unipolifest.com</p>
              <p><strong className="text-[#0A0A0A]">Horario de atención:</strong> lunes a viernes, 9:00 – 17:00 (hora Ecuador)</p>
              <p><strong className="text-[#0A0A0A]">Plazo de respuesta:</strong> máximo 15 días hábiles</p>
            </div>
          </Section>

          <div className="h-px bg-black/10 mt-4 mb-8" />
          <p className="text-black/25 text-xs leading-relaxed">
            Al completar una compra en esta Plataforma, el usuario confirma haber leído y aceptado esta Política de Privacidad.
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
