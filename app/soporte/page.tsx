'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Mail, Clock, MessageCircle, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import Navbar from '@/components/Navbar';

const CONTACT_EMAIL = 'informacion@unipolifest.com';
const WHATSAPP_NUMBER = '593983409378'; // +593 es el código de Ecuador
const WHATSAPP_DISPLAY = '+593 98 340 9378';

const WA_COMPROBANTE = `https://wa.me/593983409378?text=${encodeURIComponent('Hola, soy [tu nombre] y tengo este problema. ¿Me pueden ayudar?')}`;

const faqs: { q: string; a: React.ReactNode }[] = [
  {
    q: '¿Cuándo recibiré mi entrada?',
    a: 'Validamos los comprobantes en un máximo de 24 horas hábiles. Una vez aprobado el pago, te enviamos tu entrada digital al WhatsApp y al correo que registraste en el formulario.',
  },
  {
    q: '¿Qué hago si subí mal el comprobante?',
    a: (
      <>
        Escríbenos directo por WhatsApp con tu nombre, cédula y el evento.{' '}
        <a
          href={WA_COMPROBANTE}
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 text-[#0A0A0A] hover:opacity-60 transition-opacity font-medium"
        >
          Toca aquí para abrir WhatsApp
        </a>{' '}
        — el mensaje ya viene redactado, solo completa tu nombre y el evento. Te ayudamos a corregirlo sin problema.
      </>
    ),
  },
  {
    q: '¿Puedo transferir mi entrada a otra persona?',
    a: 'Las entradas están asociadas a la cédula registrada en el formulario. Si necesitas hacer un cambio de titular, contáctanos antes del evento con al menos 24 horas de anticipación.',
  },
  {
    q: '¿Qué pasa si el evento se cancela?',
    a: 'En caso de cancelación por parte de UP, realizamos el reembolso completo por el mismo medio de pago en un plazo máximo de 7 días hábiles. Te notificaremos por WhatsApp y correo.',
  },
  {
    q: '¿Puedo comprar más de 5 entradas?',
    a: 'El límite es de 5 entradas por cédula por evento. Si necesitas más para un grupo, otros integrantes pueden comprar con sus propias cédulas.',
  },
  {
    q: 'Realicé el pago pero no aparece mi pedido',
    a: 'El sistema registra tu pedido al subir el comprobante, no al hacer la transferencia. Si completaste el formulario y subiste el archivo correctamente, verás la pantalla de confirmación. Si no la viste, escríbenos con tu comprobante.',
  },
  {
    q: '¿Cómo sé que mi transferencia llegó bien?',
    a: 'La validación la realizamos manualmente revisando el comprobante que subiste. Si el monto y los datos son correctos, recibirás tu entrada en menos de 24 h. Puedes escribirnos si tienes dudas.',
  },
];

function Faq({ q, a }: { q: string; a: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-black/[0.07]">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between py-4 text-left gap-4 hover:text-black/70 transition-colors"
      >
        <span className="text-[#0A0A0A] text-sm font-medium">{q}</span>
        <ChevronDown
          className={`w-4 h-4 text-black/30 shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && (
        <div className="text-black/50 text-sm leading-relaxed pb-4 pr-8">{a}</div>
      )}
    </div>
  );
}

export default function SoportePage() {
  return (
    <main className="bg-[#F8F8F6] text-[#0A0A0A] min-h-screen">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-28 pb-20">

        <motion.div initial={{ x: -8 }} animate={{ x: 0 }} className="mb-10">
          <Link href="/" className="inline-flex items-center gap-2 text-black/28 hover:text-black/60 transition-colors text-xs uppercase tracking-widest">
            <ArrowLeft className="w-3.5 h-3.5" /> Volver
          </Link>
        </motion.div>

        <motion.div initial={{ y: 16 }} animate={{ y: 0 }} className="mb-12">
          <p className="text-black/20 text-[10px] uppercase tracking-[0.45em] mb-2">Ayuda</p>
          <h1
            className="font-[family-name:var(--font-bebas-neue)] text-[#0A0A0A] leading-none"
            style={{ fontSize: 'clamp(38px, 7vw, 72px)', letterSpacing: '-0.015em' }}
          >
            Soporte
          </h1>
          <p className="text-black/30 text-sm mt-3">Estamos para ayudarte con tu compra o cualquier duda sobre el evento.</p>
        </motion.div>

        <motion.div initial={{ y: 8 }} animate={{ y: 0 }} transition={{ delay: 0.15 }}>
          <div className="h-px bg-black/10 mb-10" />

          {/* Tarjetas de contacto — WhatsApp primero */}
          <div className="grid sm:grid-cols-2 gap-4 mb-12">
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group border border-black/[0.08] bg-white rounded-2xl p-6 hover:border-black/20 hover:shadow-sm transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-black/[0.04] flex items-center justify-center group-hover:bg-black/[0.07] transition-colors">
                  <MessageCircle className="w-5 h-5 text-[#0A0A0A]" />
                </div>
                <span className="text-[10px] font-semibold uppercase tracking-widest bg-[#0A0A0A] text-white px-2.5 py-1 rounded-full">Recomendado</span>
              </div>
              <p className="text-[#0A0A0A] font-semibold text-sm mb-1">WhatsApp</p>
              <p className="text-black/40 text-xs font-mono">{WHATSAPP_DISPLAY}</p>
              <p className="text-black/25 text-xs mt-3 flex items-center gap-1">
                <Clock className="w-3 h-3" /> Respuesta rápida · Lun–Vie 9:00–18:00
              </p>
            </a>

            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="group border border-black/[0.08] bg-white rounded-2xl p-6 hover:border-black/20 hover:shadow-sm transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-black/[0.04] flex items-center justify-center mb-4 group-hover:bg-black/[0.07] transition-colors">
                <Mail className="w-5 h-5 text-[#0A0A0A]" />
              </div>
              <p className="text-[#0A0A0A] font-semibold text-sm mb-1">Correo electrónico</p>
              <p className="text-black/40 text-xs font-mono break-all">{CONTACT_EMAIL}</p>
              <p className="text-black/25 text-xs mt-3 flex items-center gap-1">
                <Clock className="w-3 h-3" /> Respuesta en máx. 24 h hábiles
              </p>
            </a>
          </div>

          {/* FAQ */}
          <div className="mb-10">
            <p className="text-black/30 text-[10px] uppercase tracking-[0.42em] mb-6">Preguntas frecuentes</p>
            <div>
              {faqs.map((item) => (
                <Faq key={item.q} q={item.q} a={item.a} />
              ))}
            </div>
          </div>

          <div className="h-px bg-black/10 mb-8" />

          <p className="text-black/20 text-xs leading-relaxed">
            Si tu duda no está resuelta aquí, escríbenos por{' '}
            <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-black/50 transition-colors">
              WhatsApp
            </a>{' '}
            o al correo{' '}
            <a href={`mailto:${CONTACT_EMAIL}`} className="underline underline-offset-2 hover:text-black/50 transition-colors">
              {CONTACT_EMAIL}
            </a>{' '}
            con tu nombre, cédula, evento y captura del comprobante si aplica. También puedes revisar nuestros{' '}
            <Link href="/terminos" className="underline underline-offset-2 hover:text-black/50 transition-colors">
              Términos y Condiciones
            </Link>{' '}
            y la{' '}
            <Link href="/privacidad" className="underline underline-offset-2 hover:text-black/50 transition-colors">
              Política de Privacidad
            </Link>.
          </p>
        </motion.div>
      </div>
    </main>
  );
}
