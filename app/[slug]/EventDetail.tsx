'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, MapPin, Clock, Calendar, ExternalLink } from 'lucide-react';
import type { Event } from '@/lib/events';
import { getEffectivePrice } from '@/lib/events';
import Navbar from '@/components/Navbar';
import EarlyBirdCountdown from '@/components/EarlyBirdCountdown';
import { RetroTvError } from '@/components/ui/retro-tv-error';

interface Props {
  event: Event;
}

export default function EventDetail({ event }: Props) {
  // null = SSR / pre-mount (evita mismatch de hidratación)
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(id);
  }, []);

  return (
    <main className="bg-[#F8F8F6] text-[#0A0A0A] min-h-screen">
      <Navbar />

      <div className="px-4 sm:px-7 lg:px-14 pt-28 pb-20">

        {/* Back */}
        <motion.div
          initial={{ x: -8 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-10"
        >
          <Link
            href="/#eventos"
            className="inline-flex items-center gap-2 text-black/30 hover:text-black/70 transition-colors text-xs uppercase tracking-widest"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Volver a eventos
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">

          {/* Flyer */}
          <motion.div
            initial={{ y: 24 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="relative rounded-2xl overflow-hidden"
            style={{
              aspectRatio: '2/3',
              boxShadow: '0 32px 80px rgba(0,0,0,0.14), 0 8px 32px rgba(0,0,0,0.08)',
            }}
          >
            <Image
              key={event.slug}
              src={event.flyer} alt={event.name} fill priority
              className={`object-cover object-top ${event.past ? 'grayscale brightness-75' : ''}`}
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            {event.past && (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="bg-black/50 backdrop-blur-sm text-white/70 text-xs uppercase tracking-[0.4em] px-5 py-2.5 rounded-full border border-white/10">
                  Finalizado
                </span>
              </div>
            )}
          </motion.div>

          {/* Info */}
          <div>
            {/* Status */}
            <motion.div
              initial={{ y: 8 }}
              animate={{ y: 0 }}
              transition={{ delay: 0.15 }}
              className="flex items-center gap-2 mb-6"
            >
              <span className={`w-1.5 h-1.5 rounded-full ${event.past ? 'bg-black/30' : 'bg-black animate-pulse'}`} />
              <span className="text-black/45 text-[10px] uppercase tracking-[0.45em]">
                {event.past ? 'Evento finalizado' : 'Próximo evento'}
              </span>
            </motion.div>

            {/* Título */}
            <div className="overflow-hidden mb-6">
              <motion.h1
                initial={{ y: '105%' }}
                animate={{ y: 0 }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                className="font-[family-name:var(--font-bebas-neue)] text-[#0A0A0A] leading-none"
                style={{ fontSize: 'clamp(48px, 7vw, 96px)', letterSpacing: '-0.015em' }}
              >
                {event.name}
              </motion.h1>
            </div>

            {/* Divider */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              style={{ originX: 0 }}
              transition={{ delay: 0.4, duration: 0.4 }}
              className="h-px bg-black/10 mb-7"
            />

            {/* Meta */}
            <motion.div
              initial={{ y: 6 }}
              animate={{ y: 0 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-2 gap-4 mb-8"
            >
              {[
                { icon: <Calendar className="w-3.5 h-3.5 text-black/25" />, label: 'Fecha', value: event.date },
                { icon: <Clock className="w-3.5 h-3.5 text-black/25" />,    label: 'Hora',  value: event.time },
                {
                icon: <MapPin className="w-3.5 h-3.5 text-black/25" />,
                label: 'Lugar',
                value: event.location,
                href: event.mapUrl,
              },
                { icon: null, label: 'Ciudad', value: event.city },
              ].map(({ icon, label, value, href }: { icon: React.ReactNode; label: string; value: string; href?: string }) => (
                <div key={label} className="border border-black/[0.07] rounded-xl p-4 bg-white">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    {icon}
                    <p className="text-black/40 text-[9px] uppercase tracking-[0.35em]">{label}</p>
                  </div>
                  {href ? (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-[#0A0A0A] font-semibold text-sm hover:text-black/60 transition-colors group"
                    >
                      {value}
                      <ExternalLink className="w-3 h-3 text-black/25 group-hover:text-black/50 transition-colors" />
                    </a>
                  ) : (
                    <p className="text-[#0A0A0A] font-semibold text-sm">{value}</p>
                  )}
                </div>
              ))}
            </motion.div>

            {/* Descripción */}
            <motion.div
              initial={{ y: 8 }}
              animate={{ y: 0 }}
              transition={{ delay: 0.45 }}
              className="mb-8"
            >
              <p className="text-black/40 text-[10px] uppercase tracking-[0.4em] mb-3">Sobre el evento</p>
              <div className="space-y-3">
                {event.description.split('\n\n').map((block, i, arr) => (
                  <p
                    key={i}
                    className={
                      i === 0
                        ? 'text-[#0A0A0A] font-semibold text-[15px] leading-snug'
                        : i === arr.length - 1
                        ? 'text-black/40 text-sm tracking-wide'
                        : 'text-black/60 text-sm leading-relaxed whitespace-pre-line'
                    }
                  >
                    {block}
                  </p>
                ))}
              </div>
            </motion.div>

            {/* Entradas */}
            {!event.past && (
              <motion.div
                initial={{ y: 10 }}
                animate={{ y: 0 }}
                transition={{ delay: 0.55 }}
                className="mb-8"
              >
                <p className="text-black/25 text-[10px] uppercase tracking-[0.4em] mb-4">Tipos de entrada</p>
                <div className="grid grid-cols-2 gap-3">
                  {event.ticketTypes.map((tt) => (
                    <div
                      key={tt.name}
                      className="border border-black/[0.07] rounded-xl p-4 bg-white"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <p className="text-[#0A0A0A] font-semibold text-sm">{tt.name}</p>
                        <span
                          suppressHydrationWarning
                          className="font-[family-name:var(--font-bebas-neue)] text-3xl text-[#0A0A0A] leading-none"
                        >
                          ${now ? getEffectivePrice(tt, event.earlyBirdEnds, now) : tt.price}
                        </span>
                      </div>
                      <p className="text-black/25 text-[10px]">Entrada · por persona</p>
                    </div>
                  ))}
                </div>
                {event.earlyBirdEnds && (
                  <EarlyBirdCountdown deadline={event.earlyBirdEnds} className="mt-4" />
                )}
              </motion.div>
            )}

            {/* Cronómetro cierre venta online */}
            {event.onlineEnds && (
              <EarlyBirdCountdown
                deadline={event.onlineEnds}
                label="Venta online cierra en"
                className="mb-4"
              />
            )}

            {/* CTA */}
            <motion.div
              initial={{ y: 8 }}
              animate={{ y: 0 }}
              transition={{ delay: 0.7 }}
            >
              {event.past ? (
                <div className="border border-black/[0.07] rounded-full py-4 text-center text-black/20 text-xs uppercase tracking-widest">
                  Este evento ya finalizó
                </div>
              ) : now && event.onlineEnds && now >= new Date(event.onlineEnds) ? (
                <div className="border border-black/[0.07] rounded-2xl p-6 bg-white flex flex-col items-center gap-3">
                  <RetroTvError title="UPS" message="SOLO BOLETERÍA" />
                  <div className="flex gap-4 pt-1">
                    {event.ticketTypes.map((tt) => tt.boxOfficePrice ? (
                      <p key={tt.name} className="text-black/50 text-xs text-center">
                        {tt.name}<br />
                        <span className="font-[family-name:var(--font-bebas-neue)] text-xl text-[#0A0A0A]">${tt.boxOfficePrice}</span>
                      </p>
                    ) : null)}
                  </div>
                </div>
              ) : (
                <Link href={`/${event.slug}/comprar`}>
                  <motion.button
                    whileHover={{ scale: 1.02, backgroundColor: '#222' }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-[#0A0A0A] text-white font-bold py-4 rounded-full text-sm uppercase tracking-widest transition-colors"
                  >
                    Comprar entrada →
                  </motion.button>
                </Link>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </main>
  );
}
