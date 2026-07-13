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

export default function TerminosPage() {
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
            Términos y Condiciones
          </h1>
          <p className="text-black/30 text-xs mt-3">Última actualización: julio 2026 · Riobamba, Ecuador</p>
        </motion.div>

        <motion.div initial={{ y: 8 }} animate={{ y: 0 }} transition={{ delay: 0.2 }}>
          <div className="h-px bg-black/10 mb-12" />

          <p className="text-black/45 text-sm leading-relaxed mb-12">
            Los presentes Términos y Condiciones regulan el acceso y uso de la plataforma <strong className="text-[#0A0A0A]">UP</strong> (en adelante "la Plataforma"), así como la adquisición de entradas para los eventos publicados en ella. Al realizar una compra o utilizar cualquier función de la Plataforma, el usuario declara haber leído, comprendido y aceptado estos términos en su totalidad.
          </p>

          <Section n="01" title="Identificación del operador">
            <p>La Plataforma es operada por <strong className="text-[#0A0A0A]">UP</strong>, con domicilio en la ciudad de Riobamba, provincia de Chimborazo, República del Ecuador.</p>
            <p>Correo de contacto: <strong className="text-[#0A0A0A]">informacion@unipolifest.com</strong></p>
            <p>UP actúa como plataforma intermediaria de venta de entradas. Los eventos pueden ser organizados directamente por UP o por productoras y promotores independientes que utilizan la Plataforma para la comercialización de sus entradas. En los eventos de terceros, UP no asume responsabilidad por la organización, calidad ni realización del evento.</p>
          </Section>

          <Section n="02" title="Proceso de compra y pago">
            <p>La adquisición de entradas se realiza exclusivamente mediante transferencia bancaria al número de cuenta indicado en cada evento. El proceso completo es el siguiente:</p>
            <ol className="list-decimal list-inside space-y-2 mt-2">
              <li>El usuario selecciona el evento, tipo de entrada y cantidad deseada.</li>
              <li>Completa el formulario con sus datos personales: nombre, apellido, cédula de identidad, número de teléfono (WhatsApp) y correo electrónico.</li>
              <li>Realiza la transferencia bancaria por el monto exacto indicado en el resumen de compra.</li>
              <li>Sube el comprobante de pago (imagen en formato JPG, PNG o WEBP, o archivo PDF) a través del formulario.</li>
              <li>UP verifica el pago y, una vez confirmado, envía la entrada digital al correo electrónico y al número de WhatsApp proporcionados, en un plazo máximo de 24 horas hábiles.</li>
            </ol>
            <p>El usuario es responsable de proporcionar datos correctos y vigentes. UP no se hace responsable por entradas enviadas a correos o números erróneos indicados por el usuario.</p>
          </Section>

          <Section n="03" title="Validez y uso de la entrada">
            <p>Cada entrada es personal e intransferible. La entrada digital contiene un código único que será verificado en el acceso al evento. El uso o distribución no autorizada de la entrada puede implicar la invalidación de la misma sin derecho a reembolso.</p>
            <p>El organizador del evento se reserva el derecho de admisión. Se podrá denegar el ingreso a personas que presenten comportamientos inadecuados, se encuentren en estado de embriaguez o bajo efectos de sustancias, o incumplan las normas del venue.</p>
            <p>La entrada no garantiza acceso a zonas específicas del evento distintas a las indicadas en el tipo de entrada adquirido.</p>
          </Section>

          <Section n="04" title="Límite de entradas por usuario">
            <p>Con el fin de garantizar el acceso equitativo al evento, cada cédula de identidad puede adquirir un máximo de <strong className="text-[#0A0A0A]">5 entradas por evento</strong>. La Plataforma verificará automáticamente este límite al momento de procesar la solicitud.</p>
            <p>UP se reserva el derecho de cancelar pedidos que superen este límite o que presenten indicios de reventa no autorizada.</p>
          </Section>

          <Section n="05" title="Política de reembolsos y cancelaciones">
            <p>Una vez realizada la transferencia y enviado el comprobante, <strong className="text-[#0A0A0A]">no se procesarán reembolsos</strong>, salvo en los siguientes casos expresamente reconocidos:</p>
            <ul className="list-disc list-inside space-y-2 mt-2">
              <li><strong className="text-[#0A0A0A]">Cancelación del evento</strong> por parte del organizador: se reembolsará el 100% del valor pagado.</li>
              <li><strong className="text-[#0A0A0A]">Cambio de fecha</strong> que imposibilite objetivamente la asistencia del comprador, previa solicitud escrita y verificación por parte de UP.</li>
              <li><strong className="text-[#0A0A0A]">Error de cobro</strong> imputable a UP: se reembolsará la diferencia o el total según corresponda.</li>
            </ul>
            <p className="mt-2">Para solicitar un reembolso en los casos admitidos, el usuario deberá contactar a <strong className="text-[#0A0A0A]">informacion@unipolifest.com</strong> dentro de las 48 horas siguientes al evento o al anuncio de cancelación, adjuntando su comprobante de pago y número de cédula.</p>
            <p>Los reembolsos procedentes se procesarán en un plazo máximo de 7 días hábiles por el mismo medio de pago utilizado en la compra.</p>
            <p>No se realizan reembolsos por inasistencia voluntaria, llegada tardía, pérdida de la entrada digital ni por cambios en la programación artística (artistas, horarios, orden de presentaciones) siempre que el evento se lleve a cabo.</p>
          </Section>

          <Section n="06" title="Restricciones de edad">
            <p>Los eventos marcados como <strong className="text-[#0A0A0A]">+18</strong> están dirigidos exclusivamente a personas mayores de 18 años cumplidos. Al adquirir una entrada para dichos eventos, el comprador declara bajo su responsabilidad ser mayor de edad.</p>
            <p>El organizador podrá solicitar documento de identidad válido (cédula de ciudadanía o pasaporte) en el ingreso al evento. La compra de una entrada no garantiza el acceso si el usuario no puede acreditar la edad mínima requerida, sin que esto genere derecho a reembolso.</p>
          </Section>

          <Section n="07" title="Modificación de eventos">
            <p>UP y los organizadores se reservan el derecho de modificar la fecha, hora, lugar o cartel artístico de un evento por causas de fuerza mayor, decisiones organizativas o circunstancias fuera de su control (condiciones climáticas, disposiciones de autoridades, etc.).</p>
            <p>En caso de cambio de fecha, el usuario podrá optar por conservar su entrada para la nueva fecha o solicitar el reembolso dentro del plazo indicado en la cláusula 5. Los cambios de venue dentro de la misma ciudad no dan derecho a reembolso automático.</p>
            <p>UP comunicará los cambios a través del correo electrónico registrado y de los canales oficiales de redes sociales del evento.</p>
          </Section>

          <Section n="08" title="Responsabilidad y exoneración">
            <p>UP limita su responsabilidad a la correcta gestión del proceso de venta de entradas y envío de las mismas. La Plataforma no es responsable por:</p>
            <ul className="list-disc list-inside space-y-2 mt-2">
              <li>La calidad, organización o realización del evento cuando este sea organizado por un tercero.</li>
              <li>Daños, pérdidas, robos o lesiones ocurridos durante el evento o en sus inmediaciones.</li>
              <li>Interrupciones del servicio por mantenimiento, fallos técnicos o causas de fuerza mayor.</li>
              <li>Información incorrecta proporcionada por el usuario al momento de la compra.</li>
            </ul>
            <p className="mt-2">La responsabilidad máxima de UP frente al usuario, en cualquier caso, no excederá el valor pagado por las entradas adquiridas a través de la Plataforma.</p>
          </Section>

          <Section n="09" title="Protección de datos personales">
            <p>Los datos personales recopilados durante el proceso de compra son tratados de conformidad con nuestra <Link href="/privacidad" className="text-[#0A0A0A] underline underline-offset-2 hover:text-black/50 transition-colors">Política de Privacidad</Link> y la Ley Orgánica de Protección de Datos Personales del Ecuador (LOPDP).</p>
            <p>Los datos se utilizan exclusivamente para la gestión de la compra, envío de la entrada y comunicaciones relacionadas con el evento. No se ceden a terceros sin consentimiento expreso, salvo obligación legal.</p>
          </Section>

          <Section n="10" title="Propiedad intelectual">
            <p>Todos los contenidos publicados en la Plataforma, incluyendo textos, imágenes, logotipos, diseños y código, son propiedad de UP o de sus respectivos titulares y están protegidos por la legislación ecuatoriana e internacional sobre propiedad intelectual.</p>
            <p>Queda expresamente prohibida la reproducción, distribución, modificación o uso comercial de dichos contenidos sin autorización escrita previa de UP.</p>
          </Section>

          <Section n="11" title="Modificación de los términos">
            <p>UP se reserva el derecho de actualizar o modificar estos Términos y Condiciones en cualquier momento. Los cambios serán publicados en esta página con la fecha de actualización correspondiente. El uso continuado de la Plataforma tras la publicación de cambios implica la aceptación de los nuevos términos.</p>
            <p>Se recomienda revisar periódicamente esta página para mantenerse informado sobre las condiciones vigentes.</p>
          </Section>

          <Section n="12" title="Ley aplicable y jurisdicción">
            <p>Estos Términos y Condiciones se rigen e interpretan de conformidad con las leyes de la República del Ecuador, en particular la Ley Orgánica de Defensa del Consumidor, la Ley de Comercio Electrónico, Firmas y Mensajes de Datos, y la Ley Orgánica de Protección de Datos Personales.</p>
            <p>Para cualquier controversia derivada del uso de la Plataforma o de la adquisición de entradas, las partes se someten a la jurisdicción de los jueces y tribunales competentes de la ciudad de Riobamba, Ecuador, renunciando a cualquier otro fuero que pudiera corresponderles.</p>
          </Section>

          <Section n="13" title="Contacto">
            <p>Para consultas, reclamos o solicitudes relacionadas con estos Términos y Condiciones, puedes contactarnos en:</p>
            <p><strong className="text-[#0A0A0A]">Correo:</strong> informacion@unipolifest.com</p>
            <p>Atendemos consultas de lunes a viernes en horario de 9:00 a 17:00 (hora Ecuador). El tiempo de respuesta habitual es de 1 a 2 días hábiles.</p>
          </Section>

          <div className="h-px bg-black/10 mt-4 mb-8" />
          <p className="text-black/25 text-xs leading-relaxed">
            Al completar una compra en esta Plataforma, el usuario confirma haber leído, comprendido y aceptado íntegramente estos Términos y Condiciones.
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
