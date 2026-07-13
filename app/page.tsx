'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, ArrowDown } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { MorphingText } from '@/components/ui/liquid-text';
import { events } from '@/lib/events';

const upcoming = events.filter(e => !e.past);
const past     = events.filter(e =>  e.past);
const featured = upcoming[0];

/* Contador animado al entrar en viewport */
function AnimatedNumber({ value, suffix = '' }: { value: number; suffix?: string }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const steps = 48;
    const inc = value / steps;
    const id = setInterval(() => {
      start += inc;
      if (start >= value) { setDisplay(value); clearInterval(id); }
      else setDisplay(Math.floor(start));
    }, 20);
    return () => clearInterval(id);
  }, [inView, value]);

  return <span ref={ref}>{display}{suffix}</span>;
}

export default function Page() {

  return (
    <main className="bg-[#F8F8F6] text-[#0A0A0A] overflow-x-hidden">
      <Navbar />

      {/* ════════════════════════════════════
          HERO
      ════════════════════════════════════ */}
      <section className="relative min-h-svh flex flex-col lg:flex-row items-stretch overflow-hidden">

        {/* ── Decoración fondo hero ── */}
        {[
          { size: 320, x: '72%', y: '18%', delay: 0.2, opacity: 0.04 },
          { size: 180, x: '85%', y: '65%', delay: 0.5, opacity: 0.03 },
          { size: 90,  x: '8%',  y: '80%', delay: 0.8, opacity: 0.04 },
        ].map((c, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: c.opacity }}
            transition={{ delay: c.delay, duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
            className="absolute rounded-full border border-black pointer-events-none hidden lg:block"
            style={{ width: c.size, height: c.size, left: c.x, top: c.y, transform: 'translate(-50%,-50%)' }}
          />
        ))}

        {/* Línea diagonal decorativa */}
        <motion.div
          initial={{ scaleY: 0, opacity: 0 }}
          animate={{ scaleY: 1, opacity: 1 }}
          transition={{ delay: 1, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          style={{ originY: 0 }}
          className="absolute left-[50%] top-0 bottom-0 w-px bg-black/[0.04] pointer-events-none hidden lg:block"
        />

        {/* ── Columna texto ── */}
        <div className="relative z-10 flex-1 flex flex-col justify-center px-5 sm:px-8 lg:px-16 xl:px-24 pt-24 pb-16 lg:pt-0 lg:pb-0">

          {/* Slogan — Liquid morph */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="mb-2"
          >
            <p
              className="font-[family-name:var(--font-bebas-neue)] text-black/18 leading-none mb-1"
              style={{ fontSize: 'clamp(13px, 2.2vw, 22px)', letterSpacing: '0.22em' }}
            >
              TU ACCESO A LOS MEJORES
            </p>
            <div
              className="font-[family-name:var(--font-bebas-neue)] text-[#0A0A0A]"
              style={{ fontSize: 'clamp(68px, 13vw, 140px)', letterSpacing: '-0.015em' }}
            >
              <MorphingText texts={['EVENTOS', 'CONCIERTOS', 'FESTIVALES']} />
            </div>
          </motion.div>

          {/* Divider */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            style={{ originX: 0 }}
            transition={{ delay: 0.5, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="h-px w-10 bg-black/25 mb-6"
          />

          {/* Subtítulo */}
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65 }}
            className="text-black/45 text-sm leading-relaxed max-w-[300px] mb-8"
          >
            Compra entradas para conciertos, festivales y eventos universitarios. Rápido y seguro.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85 }}
            className="flex flex-wrap items-center gap-3 mb-8 lg:mb-0"
          >
            <a href="#eventos">
              <motion.button
                whileHover={{ scale: 1.03, backgroundColor: '#222' }}
                whileTap={{ scale: 0.97 }}
                className="bg-[#0A0A0A] text-white font-bold px-7 py-[13px] rounded-full text-xs uppercase tracking-widest transition-colors"
              >
                Ver eventos →
              </motion.button>
            </a>
            <a href="#como-funciona">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="border border-black/12 text-black/40 px-7 py-[13px] rounded-full text-xs uppercase tracking-widest hover:border-black/25 hover:text-black/60 transition-all"
              >
                Cómo funciona
              </motion.button>
            </a>
          </motion.div>

          {/* Featured event card — solo móvil */}
          {featured && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.05 }}
              className="lg:hidden"
            >
              <Link href={`/${featured.slug}`}>
                <div className="flex items-center gap-3.5 bg-white border border-black/[0.07] rounded-2xl p-3 pr-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0">
                    <Image src={featured.flyer} fill alt={featured.name}
                      className="object-cover object-top" sizes="56px" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-black/35 text-[9px] uppercase tracking-[0.35em] mb-0.5">Próximo evento</p>
                    <p className="font-semibold text-sm text-[#0A0A0A] truncate leading-tight">{featured.name}</p>
                    <p className="text-black/40 text-xs mt-0.5">{featured.date} · desde ${featured.price}</p>
                  </div>
                  <ArrowDown className="w-3.5 h-3.5 text-black/20 shrink-0 -rotate-90" />
                </div>
              </Link>
            </motion.div>
          )}

          {/* Scroll hint mobile */}
          <motion.a
            href="#eventos"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
            className="absolute bottom-6 left-5 sm:left-8 lg:left-16 xl:left-24 z-10 flex items-center gap-2 lg:hidden"
            aria-label="Ver eventos"
          >
            <motion.div
              animate={{ y: [0, 4, 0] }}
              transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
            >
              <ArrowDown className="w-3.5 h-3.5 text-black/20" />
            </motion.div>
            <span className="text-black/20 text-[9px] uppercase tracking-[0.4em]">Scroll</span>
          </motion.a>
        </div>

        {/* ── Columna poster — solo desktop ── */}
        <div className="hidden lg:flex lg:flex-1 relative items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 28, rotate: -2 }}
            animate={{ opacity: 1, y: 0, rotate: -4 }}
            transition={{ delay: 0.38, duration: 1.35, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10"
            style={{
              width: 'clamp(200px, 28vw, 310px)',
              aspectRatio: '2/3',
              borderRadius: '20px',
              overflow: 'hidden',
              boxShadow: '0 40px 100px rgba(0,0,0,0.18), 0 16px 48px rgba(0,0,0,0.10), 0 0 0 1px rgba(0,0,0,0.06)',
            }}
          >
            <Image src={featured.flyer} fill alt={featured.name} priority className="object-cover object-top" />
          </motion.div>

          {/* Badge precio */}
          <motion.div
            initial={{ opacity: 0, scale: 0.7, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.92, type: 'spring', stiffness: 260, damping: 18 }}
            className="absolute z-20 right-[13%]"
            style={{ top: '29%' }}
          >
            <div className="bg-[#0A0A0A] text-white font-bold text-[13px] px-4 py-2.5 rounded-full shadow-lg">
              desde ${featured.price}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════
          PRÓXIMOS EVENTOS
      ════════════════════════════════════ */}
      <section id="eventos" className="px-4 sm:px-7 lg:px-14 pt-14 sm:pt-20 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <p className="text-black/35 text-[10px] uppercase tracking-[0.5em] mb-1">Cartelera</p>
          <h2
            className="font-[family-name:var(--font-bebas-neue)] text-[#0A0A0A] leading-none"
            style={{ fontSize: 'clamp(42px, 8vw, 88px)', letterSpacing: '-0.01em' }}
          >
            Próximos eventos
          </h2>
        </motion.div>

        {upcoming.length === 0 ? (
          <p className="text-black/25 text-sm">No hay eventos próximos por ahora.</p>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {upcoming.map((ev, i) => (
              <motion.div
                key={ev.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              >
                <Link href={`/${ev.slug}`}>
                  <motion.div
                    whileHover={{ y: -4 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                    className="group relative overflow-hidden rounded-2xl border border-black/[0.07] bg-white cursor-pointer"
                    style={{ boxShadow: '0 2px 20px rgba(0,0,0,0.06)' }}
                  >
                    <div className="flex flex-col sm:flex-row">
                      {/* Flyer */}
                      <div className="relative shrink-0 w-full aspect-[3/2] sm:aspect-auto sm:w-[280px] lg:w-[360px] sm:self-stretch">
                        <Image
                          src={ev.flyer} alt={ev.name} fill
                          className="object-cover object-top group-hover:scale-[1.03] transition-transform duration-700 rounded-t-2xl sm:rounded-t-none sm:rounded-l-2xl"
                          sizes="(max-width: 640px) 100vw, 360px" priority={i === 0}
                        />
                      </div>

                      {/* Info */}
                      <div className="flex flex-col justify-between p-5 sm:p-8 flex-1">
                        <div>
                          <div className="flex items-center gap-2 mb-3">
                            <span className="w-1.5 h-1.5 rounded-full bg-black animate-pulse" />
                            <span className="text-black/50 text-[10px] uppercase tracking-[0.4em]">Próximo</span>
                          </div>
                          <h3
                            className="font-[family-name:var(--font-bebas-neue)] text-[#0A0A0A] leading-none mb-2.5"
                            style={{ fontSize: 'clamp(30px, 5vw, 60px)', letterSpacing: '-0.015em' }}
                          >
                            {ev.name}
                          </h3>
                          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-black/45 text-xs">
                            <span className="font-semibold text-black/65">{ev.date}</span>
                            <span className="text-black/20">·</span>
                            <span>{ev.time}</span>
                            <span className="text-black/20">·</span>
                            <MapPin className="w-3 h-3" />
                            <span>{ev.location}, {ev.city}</span>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-5 pt-5 border-t border-black/[0.06] gap-4">
                          <div>
                            <p className="text-black/35 text-[10px] uppercase tracking-widest mb-0.5">Precio desde</p>
                            <p className="font-[family-name:var(--font-bebas-neue)] text-[#0A0A0A] text-3xl leading-none">
                              ${ev.price}
                            </p>
                          </div>
                          <motion.span
                            whileHover={{ scale: 1.03 }}
                            className="bg-[#0A0A0A] text-white font-bold text-xs uppercase tracking-widest px-7 py-3.5 rounded-full text-center sm:text-left"
                          >
                            Ver y comprar →
                          </motion.span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* ════════════════════════════════════
          EVENTOS PASADOS
      ════════════════════════════════════ */}
      <section className="px-4 sm:px-7 lg:px-14 pt-10 pb-14 sm:pt-16 sm:pb-20">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <p className="text-black/35 text-[10px] uppercase tracking-[0.5em] mb-1">Archivo</p>
          <h2
            className="font-[family-name:var(--font-bebas-neue)] text-black/25 leading-none"
            style={{ fontSize: 'clamp(42px, 8vw, 88px)', letterSpacing: '-0.01em' }}
          >
            Eventos pasados
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {past.map((ev, i) => (
            <motion.div
              key={ev.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <Link href={`/${ev.slug}`}>
                <motion.div
                  whileHover={{ y: -6, scale: 1.02 }}
                  transition={{ type: 'spring', stiffness: 280, damping: 22 }}
                  className="group relative overflow-hidden rounded-xl border border-black/[0.06] cursor-pointer"
                  style={{ aspectRatio: '2/3' }}
                >
                  <Image
                    src={ev.flyer} alt={ev.name} fill
                    className="object-cover object-top grayscale brightness-60 group-hover:brightness-75 group-hover:grayscale-0 transition-all duration-700"
                    sizes="400px"
                  />
                  {/* Shimmer on hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 60%)' }} />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.82) 0%, transparent 55%)' }} />

                  <div className="absolute top-3 left-3">
                    <motion.span
                      initial={{ opacity: 0, y: -4 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 + 0.3 }}
                      className="bg-black/50 backdrop-blur-sm text-white/50 text-[9px] uppercase tracking-[0.3em] px-2.5 py-1 rounded-full"
                    >
                      Finalizado
                    </motion.span>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
                    <p className="text-white/35 text-[10px] uppercase tracking-widest mb-1">{ev.date}</p>
                    <h3
                      className="font-[family-name:var(--font-bebas-neue)] text-white/60 group-hover:text-white/85 leading-none transition-colors duration-300"
                      style={{ fontSize: 'clamp(18px, 2.5vw, 26px)', letterSpacing: '-0.01em' }}
                    >
                      {ev.name}
                    </h3>
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════
          STATS STRIP
      ════════════════════════════════════ */}
      <section className="border-y border-black/[0.06] bg-white overflow-hidden">
        <div className="px-4 sm:px-7 lg:px-14 py-10 grid grid-cols-2 sm:grid-cols-4 divide-x divide-black/[0.05]">
          {[
            { num: events.length, suffix: '',    label: 'Eventos realizados' },
            { num: 2,             suffix: '',    label: 'Ciudades' },
            { num: 24,            suffix: 'h',   label: 'Validación máxima' },
            { num: 100,           suffix: '%',   label: 'Entradas digitales' },
          ].map(({ num, suffix, label }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.09, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="text-center sm:text-left px-5 sm:px-8 first:pl-0 last:pr-0 py-2"
            >
              <p
                className="font-[family-name:var(--font-bebas-neue)] text-[#0A0A0A] leading-none mb-1.5"
                style={{ fontSize: 'clamp(36px, 5vw, 58px)', letterSpacing: '-0.01em' }}
              >
                <AnimatedNumber value={num} suffix={suffix} />
              </p>
              <p className="text-black/25 text-xs">{label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════
          CÓMO FUNCIONA
      ════════════════════════════════════ */}
      <section id="como-funciona" className="px-4 sm:px-7 lg:px-14 pt-16 pb-16 sm:pt-20 sm:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">

          {/* Título columna */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:sticky lg:top-24"
          >
            <p className="text-black/20 text-[10px] uppercase tracking-[0.5em] mb-3">Proceso</p>
            <h2
              className="font-[family-name:var(--font-bebas-neue)] text-[#0A0A0A] leading-none mb-6"
              style={{ fontSize: 'clamp(42px, 7vw, 88px)', letterSpacing: '-0.015em' }}
            >
              Cómo funciona
            </h2>
            <p className="text-black/35 text-sm leading-relaxed max-w-xs">
              Sin apps, sin filas, sin complicaciones. Tu entrada llega directo al correo en menos de 24 horas.
            </p>

            <motion.a
              href="#eventos"
              whileHover={{ scale: 1.03, backgroundColor: '#222' }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 bg-[#0A0A0A] text-white font-bold px-7 py-3.5 rounded-full text-xs uppercase tracking-widest transition-colors mt-8"
            >
              Ver eventos →
            </motion.a>
          </motion.div>

          {/* Steps con línea conectora */}
          <div className="relative">
            {/* Línea vertical que se dibuja al hacer scroll */}
            <div className="absolute left-[23px] top-0 bottom-0 w-px bg-black/[0.05] hidden sm:block" />
            <motion.div
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
              style={{ originY: 0 }}
              className="absolute left-[23px] top-0 bottom-0 w-px bg-black/20 hidden sm:block"
            />

            {[
              { n: '01', h: 'Elige tu entrada',   b: 'Selecciona el evento, el tipo de entrada y la cantidad que necesitas.' },
              { n: '02', h: 'Transfiere',          b: 'Realiza la transferencia bancaria al número de cuenta indicado en el evento.' },
              { n: '03', h: 'Sube el comprobante', b: 'Llena el formulario con tus datos y adjunta la captura o PDF del pago.' },
              { n: '04', h: 'Recibe tu entrada',   b: 'Validamos en máx. 24 h y te enviamos tu entrada digital al correo registrado.' },
            ].map(({ n, h, b }, i) => (
              <motion.div
                key={n}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="grid grid-cols-[48px_1fr] gap-5 py-7 border-t border-black/[0.06] group"
              >
                {/* Dot en la línea */}
                <div className="flex justify-end pt-1 relative">
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.15 + i * 0.1, type: 'spring', stiffness: 300 }}
                    className="w-2 h-2 rounded-full bg-black/20 group-hover:bg-black/60 transition-colors duration-300 relative z-10"
                  />
                </div>
                <div>
                  <h3 className="text-[#0A0A0A] font-semibold text-[15px] mb-1.5 group-hover:translate-x-0.5 transition-transform duration-300">
                    {h}
                  </h3>
                  <p className="text-black/35 text-sm leading-relaxed">{b}</p>
                </div>
              </motion.div>
            ))}
            <div className="border-t border-black/[0.06]" />
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════
          CTA FINAL
      ════════════════════════════════════ */}
      <section className="px-4 sm:px-7 lg:px-14 py-16 sm:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative bg-[#0A0A0A] rounded-3xl px-8 sm:px-14 py-14 sm:py-16 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8 overflow-hidden"
        >
          {/* Orbs decorativos */}
          <motion.div
            animate={{ scale: [1, 1.15, 1], opacity: [0.06, 0.1, 0.06] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-white pointer-events-none"
          />
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.03, 0.06, 0.03] }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            className="absolute -left-10 -bottom-16 w-56 h-56 rounded-full bg-white pointer-events-none"
          />

          <div className="relative">
            <p className="text-white/30 text-[10px] uppercase tracking-[0.5em] mb-3">¿Listo?</p>
            <h2
              className="font-[family-name:var(--font-bebas-neue)] text-white leading-none"
              style={{ fontSize: 'clamp(42px, 6vw, 80px)', letterSpacing: '-0.015em' }}
            >
              Tu entrada te espera.
            </h2>
          </div>
          <div className="relative shrink-0">
            <a href="#eventos">
              <motion.button
                whileHover={{ scale: 1.04, backgroundColor: '#f0f0f0' }}
                whileTap={{ scale: 0.97 }}
                className="bg-white text-[#0A0A0A] font-bold px-8 py-4 rounded-full text-xs uppercase tracking-widest transition-colors whitespace-nowrap"
              >
                Ver eventos →
              </motion.button>
            </a>
          </div>
        </motion.div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-black/[0.06] px-4 sm:px-7 lg:px-14 py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <Image src="/logo.svg" alt="UPPASS" width={80} height={46} className="h-7 w-auto"
            style={{ filter: 'brightness(0)', opacity: 0.22 }} />
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-black/22 text-xs">
            <a href="#eventos"       className="hover:text-black/55 transition-colors">Eventos</a>
            <a href="#como-funciona" className="hover:text-black/55 transition-colors">Cómo funciona</a>
            <Link href="/terminos"   className="hover:text-black/55 transition-colors">Términos</Link>
            <Link href="/privacidad" className="hover:text-black/55 transition-colors">Privacidad</Link>
            <span className="text-black/12">·</span>
            <span className="text-black/15">© 2026 UP</span>
          </div>
        </div>
        <div className="mt-5 pt-5 border-t border-black/[0.04] flex items-center gap-2 text-black/15 text-[10px]">
          <svg width="12" height="12" viewBox="0 0 100 100" fill="none" className="shrink-0 opacity-40">
            <line x1="13.5" y1="6.5"  x2="93.5" y2="86.5" stroke="currentColor" strokeWidth="12" strokeLinecap="butt"/>
            <line x1="6.5"  y1="13.5" x2="86.5" y2="93.5" stroke="currentColor" strokeWidth="12" strokeLinecap="butt"/>
            <line x1="86.5" y1="6.5"  x2="6.5"  y2="86.5" stroke="currentColor" strokeWidth="12" strokeLinecap="butt"/>
            <line x1="93.5" y1="13.5" x2="13.5" y2="93.5" stroke="currentColor" strokeWidth="12" strokeLinecap="butt"/>
          </svg>
          <span>Desarrollado por <span style={{ fontFamily: "'Century Gothic', Futura, Arial, sans-serif" }}>Drex</span></span>
        </div>
      </footer>
    </main>
  );
}
