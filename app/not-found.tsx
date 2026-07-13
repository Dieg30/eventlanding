'use client';

import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';

const EASE = [0.43, 0.13, 0.23, 0.96] as [number, number, number, number];

const containerVariants = {
  hidden:  { opacity: 0, y: 30 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: 0.7, ease: EASE, delayChildren: 0.1, staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

const numberVariants = {
  hidden:  (dir: number) => ({ opacity: 0, x: dir * 40, y: 15, rotate: dir * 5 }),
  visible: { opacity: 1, x: 0, y: 0, rotate: 0, transition: { duration: 0.8, ease: EASE } },
};

const ghostVariants = {
  hidden:   { scale: 0.8, opacity: 0, y: 15, rotate: -5 },
  visible:  { scale: 1, opacity: 1, y: 0, rotate: 0, transition: { duration: 0.6, ease: EASE } },
  floating: {
    y: [0, -12, 0],
    transition: { y: { duration: 2.4, ease: 'easeInOut' as const, repeat: Infinity } },
  },
};

function GhostIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 96" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden>
      <path
        d="M40 4C20.12 4 4 20.12 4 40V88L14 80L24 88L34 80L40 88L46 80L56 88L66 80L76 88V40C76 20.12 59.88 4 40 4Z"
        fill="#0A0A0A"
      />
      <circle cx="28" cy="42" r="7" fill="white"/>
      <circle cx="52" cy="42" r="7" fill="white"/>
      <circle cx="30" cy="44" r="3.5" fill="#0A0A0A"/>
      <circle cx="54" cy="44" r="3.5" fill="#0A0A0A"/>
      <circle cx="31" cy="42" r="1.2" fill="white"/>
      <circle cx="55" cy="42" r="1.2" fill="white"/>
    </svg>
  );
}

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#F8F8F6] text-[#0A0A0A]">
      <Navbar />

      <div className="min-h-screen flex flex-col items-center justify-center px-4 pt-16">
        <AnimatePresence mode="wait">
          <motion.div
            className="text-center"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* 4 👻 4 */}
            <div className="flex items-center justify-center gap-4 md:gap-8 mb-10">
              <motion.span
                className="font-[family-name:var(--font-bebas-neue)] text-[96px] md:text-[140px] text-[#0A0A0A] leading-none select-none"
                variants={numberVariants}
                custom={-1}
              >
                4
              </motion.span>

              <motion.div
                variants={ghostVariants}
                animate={['visible', 'floating']}
                initial="hidden"
              >
                <GhostIcon className="w-[72px] h-[88px] md:w-[100px] md:h-[120px]" />
              </motion.div>

              <motion.span
                className="font-[family-name:var(--font-bebas-neue)] text-[96px] md:text-[140px] text-[#0A0A0A] leading-none select-none"
                variants={numberVariants}
                custom={1}
              >
                4
              </motion.span>
            </div>

            {/* Título */}
            <motion.h1
              className="font-[family-name:var(--font-bebas-neue)] text-[#0A0A0A] leading-none mb-4 select-none"
              style={{ fontSize: 'clamp(32px, 6vw, 60px)', letterSpacing: '-0.015em' }}
              variants={itemVariants}
            >
              Página no encontrada
            </motion.h1>

            {/* Subtítulo */}
            <motion.p
              className="text-black/45 text-base md:text-lg mb-10 max-w-sm mx-auto select-none"
              variants={itemVariants}
            >
              Esta página se perdió en el evento. Vuelve al inicio para encontrar lo que buscas.
            </motion.p>

            {/* CTA */}
            <motion.div variants={itemVariants}>
              <Link href="/">
                <motion.button
                  whileHover={{ scale: 1.03, backgroundColor: '#222' }}
                  whileTap={{ scale: 0.97 }}
                  className="bg-[#0A0A0A] text-white font-bold px-10 py-4 rounded-full text-sm uppercase tracking-widest transition-colors"
                >
                  Volver al inicio →
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  );
}
