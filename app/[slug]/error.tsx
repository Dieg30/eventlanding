'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';

export default function EventError() {
  return (
    <main className="min-h-screen bg-[#F8F8F6] text-[#0A0A0A]">
      <Navbar />
      <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
        <motion.div
          initial={{ y: 20 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="text-black/20 text-[10px] uppercase tracking-[0.45em] mb-4">Error</p>
          <h1
            className="font-[family-name:var(--font-bebas-neue)] text-[#0A0A0A] leading-none mb-4"
            style={{ fontSize: 'clamp(42px, 8vw, 80px)', letterSpacing: '-0.015em' }}
          >
            Algo salió mal
          </h1>
          <p className="text-black/40 text-sm leading-relaxed mb-10 max-w-xs mx-auto">
            No pudimos cargar la información del evento. Intenta de nuevo o vuelve al inicio.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => window.location.reload()}
              className="bg-[#0A0A0A] text-white font-bold px-8 py-3.5 rounded-full text-xs uppercase tracking-widest hover:bg-black/80 transition-colors"
            >
              Intentar de nuevo
            </button>
            <Link
              href="/"
              className="border border-black/12 text-black/40 px-8 py-3.5 rounded-full text-xs uppercase tracking-widest hover:border-black/25 hover:text-black/60 transition-all"
            >
              Ir al inicio
            </Link>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
