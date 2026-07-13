'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [scrolled,  setScrolled]  = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const close = () => setMenuOpen(false);

  return (
    <>
      <motion.header
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled || menuOpen ? 'bg-white/95 backdrop-blur-xl border-b border-black/[0.06]' : ''
        }`}
      >
        <div className="px-5 md:px-10 h-16 flex items-center justify-between">
          <Link href="/" onClick={close}>
            <Image src="/logo.svg" alt="UPPASS" width={80} height={46}
              className="h-9 w-auto" style={{ filter: 'brightness(0)' }} />
          </Link>

          <nav className="flex items-center gap-5 text-xs font-medium uppercase tracking-widest">
            <a href="#eventos"       className="text-black/35 hover:text-black transition-colors hidden md:block">Eventos</a>
            <a href="#como-funciona" className="text-black/35 hover:text-black transition-colors hidden md:block">Info</a>
<a href="#eventos"
              className="bg-[#0A0A0A] text-white font-bold px-5 py-2 rounded-full text-[11px] hover:bg-black/80 transition-colors hidden md:block">
              Entradas
            </a>
            {/* Mobile: botón entradas + hamburguesa */}
            <a href="#eventos" onClick={close}
              className="bg-[#0A0A0A] text-white font-bold px-4 py-2 rounded-full text-[11px] hover:bg-black/80 transition-colors md:hidden">
              Entradas
            </a>
            <button
              onClick={() => setMenuOpen(o => !o)}
              className="md:hidden p-1.5 -mr-1 text-black/40 hover:text-black transition-colors"
              aria-label="Menú"
            >
              {menuOpen
                ? <X className="w-5 h-5" />
                : <Menu className="w-5 h-5" />
              }
            </button>
          </nav>
        </div>
      </motion.header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
            className="fixed top-16 left-0 right-0 z-40 bg-white/98 backdrop-blur-xl border-b border-black/[0.07] md:hidden"
          >
            <div className="px-6 py-4 flex flex-col">
              <a href="#eventos" onClick={close}
                className="flex items-center justify-between text-[#0A0A0A] font-semibold text-sm py-4 border-b border-black/[0.05] uppercase tracking-widest">
                Eventos <span className="text-black/20">→</span>
              </a>
              <a href="#como-funciona" onClick={close}
                className="flex items-center justify-between text-[#0A0A0A] font-semibold text-sm py-4 border-b border-black/[0.05] uppercase tracking-widest">
                Cómo funciona <span className="text-black/20">→</span>
              </a>
              <Link href="/terminos" onClick={close}
                className="flex items-center justify-between text-black/40 text-xs py-3 border-b border-black/[0.04] uppercase tracking-widest">
                Términos y condiciones <span className="text-black/15">↗</span>
              </Link>
              <Link href="/privacidad" onClick={close}
                className="flex items-center justify-between text-black/40 text-xs py-3 border-b border-black/[0.04] uppercase tracking-widest">
                Política de privacidad <span className="text-black/15">↗</span>
              </Link>
              <Link href="/soporte" onClick={close}
                className="flex items-center justify-between text-black/40 text-xs py-3 uppercase tracking-widest">
                Soporte <span className="text-black/15">↗</span>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
