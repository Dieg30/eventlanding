'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Upload, CheckCircle, Loader2, X, Copy, AlertCircle, Check, Tag, ChevronDown } from 'lucide-react';
import type { Event } from '@/lib/events';
import type { BankInfo } from '@/lib/bank-info';
import Navbar from '@/components/Navbar';

type FormState = 'idle' | 'loading' | 'success' | 'error';

// ── Validators (pure, outside component) ──────────────────────────────────
const EC_CEDULA_RE = /^\d{10}$/;
const EC_PHONE_RE  = /^0\d{8,9}$/;
const EC_EMAIL_RE  = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const EC_NAME_RE   = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s'\-]+$/;

function vCedula(v: string): string | null {
  const s = v.trim();
  if (!s) return 'La cédula es obligatoria';
  if (!EC_CEDULA_RE.test(s)) return 'Debe tener exactamente 10 dígitos';
  const prov = parseInt(s.slice(0, 2), 10);
  if (prov < 1 || (prov > 24 && prov !== 30)) return 'Código de provincia inválido';
  if (parseInt(s[2], 10) > 5) return 'No corresponde a persona natural';
  const coefs = [2, 1, 2, 1, 2, 1, 2, 1, 2];
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    let n = parseInt(s[i], 10) * coefs[i];
    if (n >= 10) n -= 9;
    sum += n;
  }
  return (10 - (sum % 10)) % 10 === parseInt(s[9], 10) ? null : 'Cédula ecuatoriana inválida';
}

function vPhone(v: string): string | null {
  const s = v.trim();
  if (!s) return 'El teléfono es obligatorio';
  return EC_PHONE_RE.test(s) ? null : 'Formato inválido (ej: 0991234567)';
}

function vEmail(v: string): string | null {
  const s = v.trim();
  if (!s) return 'El correo es obligatorio';
  return EC_EMAIL_RE.test(s) ? null : 'Correo electrónico inválido';
}

function vName(v: string, label: string): string | null {
  const s = v.trim();
  if (!s) return `${label} es obligatorio`;
  if (s.length < 2) return 'Mínimo 2 caracteres';
  return EC_NAME_RE.test(s) ? null : 'Solo se permiten letras';
}

interface Props {
  event:    Event;
  bankInfo: BankInfo;
}

export default function BuyForm({ event, bankInfo }: Props) {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    document: '',
    quantity: '1',
    ticketType: event.ticketTypes[0]?.name ?? '',
  });
  const [file, setFile]         = useState<File | null>(null);
  const [preview, setPreview]   = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [state, setState]       = useState<FormState>('idle');
  const [showErrors, setShowErrors] = useState(false);
  const [touched, setTouched]       = useState<Set<string>>(new Set());
  const [copiedKey, setCopiedKey]     = useState<string | null>(null);
  const [agreed, setAgreed]           = useState(false);
  const [errorMsg, setErrorMsg]       = useState('');
  const [promoOpen, setPromoOpen]     = useState(false);
  const [promoInput, setPromoInput]   = useState('');
  const [promoState, setPromoState]   = useState<'idle' | 'loading' | 'ok' | 'error'>('idle');
  const [promoLabel, setPromoLabel]   = useState('');
  const [discount, setDiscount]       = useState(0);

  const selectedType = event.ticketTypes.find((t) => t.name === form.ticketType);
  const unitPrice = selectedType?.price ?? 0;
  const subtotal  = unitPrice * Number(form.quantity);
  const total     = Math.max(0, subtotal - discount);

  const handleFile = (f: File) => {
    if (f.size > 10 * 1024 * 1024) {
      alert('El archivo supera los 10 MB.');
      return;
    }
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    if (!allowed.includes(f.type)) {
      alert('Solo se permiten imágenes (JPG, PNG, WEBP) o PDF.');
      return;
    }
    setFile(f);
    if (f.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target?.result as string);
      reader.readAsDataURL(f);
    } else {
      setPreview(null);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  const applyPromo = async () => {
    if (!promoInput.trim()) return;
    setPromoState('loading');
    const res = await fetch('/api/validate-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: promoInput, subtotal }),
    });
    const data = await res.json();
    if (res.ok && data.valid) {
      setDiscount(data.discount);
      setPromoLabel(data.label);
      setPromoState('ok');
    } else {
      setDiscount(0);
      setPromoLabel('');
      setPromoState('error');
    }
  };

  const removePromo = () => {
    setPromoInput('');
    setDiscount(0);
    setPromoLabel('');
    setPromoState('idle');
  };

  const touch = (k: string) =>
    setTouched(p => { const s = new Set(p); s.add(k); return s; });

  const getFieldError = (k: string): string | null => {
    const v = (form as Record<string, string>)[k] ?? '';
    if (k === 'firstName') return vName(v, 'El nombre');
    if (k === 'lastName')  return vName(v, 'El apellido');
    if (k === 'document')  return vCedula(v);
    if (k === 'phone')     return vPhone(v);
    if (k === 'email')     return vEmail(v);
    return null;
  };

  const active   = (k: string) => showErrors || touched.has(k);
  const fieldErr = (k: string) => active(k) ? getFieldError(k) : null;
  const fieldCls = (k: string): string => {
    if (!active(k)) return 'border-black/[0.08] focus:border-black/25 bg-white';
    return getFieldError(k)
      ? 'border-red-300 focus:border-red-400 bg-red-50/30'
      : 'border-emerald-300 focus:border-emerald-400 bg-white';
  };

  const FORM_KEYS = ['firstName', 'lastName', 'document', 'phone', 'email'];
  const isFormComplete =
    FORM_KEYS.every(k => getFieldError(k) === null) && file !== null && agreed;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormComplete) {
      setShowErrors(true);
      setTouched(new Set(FORM_KEYS));
      return;
    }

    setState('loading');
    setErrorMsg('');

    try {
      const fd = new FormData();
      fd.append('slug',        event.slug);
      fd.append('ticketType',  form.ticketType);
      fd.append('quantity',    String(form.quantity));
      fd.append('promoCode',   promoInput.trim().toUpperCase());
      fd.append('nombre',     form.firstName.trim());
      fd.append('apellido',   form.lastName.trim());
      fd.append('cedula',     form.document.trim());
      fd.append('telefono',   form.phone.trim());
      fd.append('email',      form.email.trim());
      fd.append('file',       file!);

      const res  = await fetch('/api/submit-order', { method: 'POST', body: fd });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error ?? 'Error inesperado');

      setState('success');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error inesperado';
      setErrorMsg(msg);
      setState('error');
    }
  };

  const copyField = (key: string, value: string) => {
    navigator.clipboard.writeText(value);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  if (state === 'success') {
    return (
      <main className="bg-[#F8F8F6] min-h-screen flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-sm"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.15, type: 'spring', stiffness: 200, damping: 16 }}
            className="w-20 h-20 rounded-full bg-[#0A0A0A] mx-auto mb-7 flex items-center justify-center"
          >
            <CheckCircle className="w-9 h-9 text-white" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="font-[family-name:var(--font-bebas-neue)] text-[#0A0A0A] leading-none mb-3"
            style={{ fontSize: 'clamp(42px, 8vw, 68px)' }}
          >
            ¡Solicitud enviada!
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45 }}
            className="text-black/40 text-sm leading-relaxed mb-8"
          >
            Recibimos tu comprobante para{' '}
            <span className="text-[#0A0A0A] font-semibold">{event.name}</span>.
            En máx. 24 h validamos el pago y te enviamos tu entrada por WhatsApp al{' '}
            <span className="text-[#0A0A0A] font-semibold">{form.phone}</span>{' '}
            y por correo a{' '}
            <span className="text-[#0A0A0A] font-semibold">{form.email}</span>.
          </motion.p>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-[#0A0A0A] text-white font-bold px-8 py-3.5 rounded-full text-xs uppercase tracking-widest hover:bg-black/80 transition-colors"
            >
              Ver más eventos →
            </Link>
          </motion.div>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="bg-[#F8F8F6] text-[#0A0A0A] min-h-screen">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-10 pt-28 pb-20">

        {/* Back */}
        <motion.div initial={{ x: -8 }} animate={{ x: 0 }} className="mb-8">
          <Link
            href={`/${event.slug}`}
            className="inline-flex items-center gap-2 text-black/40 hover:text-black/70 transition-colors text-xs uppercase tracking-widest"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Volver al evento
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div initial={{ y: 16 }} animate={{ y: 0 }} className="mb-8 lg:mb-10">
          <p className="text-black/35 text-[10px] uppercase tracking-[0.45em] mb-2">Compra tu entrada</p>
          <h1
            className="font-[family-name:var(--font-bebas-neue)] text-[#0A0A0A] leading-none"
            style={{ fontSize: 'clamp(38px, 6vw, 72px)', letterSpacing: '-0.015em' }}
          >
            {event.name}
          </h1>
          <p className="text-black/45 text-sm mt-2">{event.date} · {event.time} · {event.location}, {event.city}</p>
        </motion.div>

        <form onSubmit={handleSubmit} className="lg:grid lg:grid-cols-2 lg:gap-10 lg:items-start">

          {/* ── COLUMNA IZQUIERDA: entrada + datos ── */}
          <div className="space-y-6">

          {/* Tipo + Cantidad */}
          <motion.div initial={{ y: 14 }} animate={{ y: 0 }} transition={{ delay: 0.08 }}>
            <p className="text-black/40 text-[10px] uppercase tracking-[0.42em] mb-4">Tu entrada</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-black/45 text-xs mb-1.5">Tipo</label>
                <select
                  value={form.ticketType}
                  onChange={(e) => { setForm((p) => ({ ...p, ticketType: e.target.value })); removePromo(); }}
                  className="w-full border border-black/[0.08] bg-white rounded-xl px-4 py-3 text-sm text-[#0A0A0A] focus:outline-none focus:border-black/25 transition-colors appearance-none"
                >
                  {event.ticketTypes.map((t) => (
                    <option key={t.name} value={t.name}>{t.name} — ${t.price}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-black/45 text-xs mb-1.5">Cantidad</label>
                <select
                  value={form.quantity}
                  onChange={(e) => { setForm((p) => ({ ...p, quantity: e.target.value })); removePromo(); }}
                  className="w-full border border-black/[0.08] bg-white rounded-xl px-4 py-3 text-sm text-[#0A0A0A] focus:outline-none focus:border-black/25 transition-colors appearance-none"
                >
                  {[1, 2, 3, 4, 5].map((n) => (
                    <option key={n} value={n}>{n} entrada{n > 1 ? 's' : ''}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Desglose + total */}
            <div className="mt-3 border border-black/[0.07] bg-white rounded-xl overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3 border-b border-black/[0.05]">
                <span className="text-black/40 text-xs">{Number(form.quantity)}× {form.ticketType}</span>
                <span className="text-[#0A0A0A] text-sm font-medium">${subtotal}</span>
              </div>
              {discount > 0 && (
                <div className="flex items-center justify-between px-5 py-2.5 border-b border-black/[0.05] bg-emerald-50/60">
                  <span className="text-emerald-600 text-xs flex items-center gap-1.5">
                    <Tag className="w-3 h-3" />{promoLabel}
                  </span>
                  <span className="text-emerald-600 text-sm font-medium">−${discount}</span>
                </div>
              )}
              <div className="flex items-center justify-between px-5 py-3.5">
                <span className="text-black/40 text-xs uppercase tracking-widest">Total a transferir</span>
                <span className="font-[family-name:var(--font-bebas-neue)] text-[#0A0A0A] text-3xl leading-none">${total}</span>
              </div>
            </div>

            {/* Código de descuento */}
            <div className="mt-2">
              {promoState !== 'ok' ? (
                <button
                  type="button"
                  onClick={() => setPromoOpen(o => !o)}
                  className="flex items-center gap-1.5 text-black/35 hover:text-black/60 text-xs transition-colors"
                >
                  <Tag className="w-3 h-3" />
                  ¿Tienes un código de descuento?
                  <ChevronDown className={`w-3 h-3 transition-transform ${promoOpen ? 'rotate-180' : ''}`} />
                </button>
              ) : null}

              <AnimatePresence>
                {(promoOpen && promoState !== 'ok') && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="flex gap-2 mt-2">
                      <input
                        type="text"
                        placeholder="CÓDIGO"
                        value={promoInput}
                        maxLength={64}
                        onChange={(e) => { setPromoInput(e.target.value.toUpperCase()); setPromoState('idle'); }}
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), applyPromo())}
                        className="flex-1 border border-black/[0.08] bg-white rounded-xl px-4 py-2.5 text-sm font-mono placeholder-black/20 focus:outline-none focus:border-black/25 transition-colors uppercase tracking-widest"
                      />
                      <button
                        type="button"
                        onClick={applyPromo}
                        disabled={promoState === 'loading' || !promoInput.trim()}
                        className="px-4 py-2.5 bg-[#0A0A0A] text-white text-xs font-bold rounded-xl uppercase tracking-widest hover:bg-black/80 transition-colors disabled:opacity-40"
                      >
                        {promoState === 'loading' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Aplicar'}
                      </button>
                    </div>
                    {promoState === 'error' && (
                      <p className="text-red-400 text-[11px] mt-1.5 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 shrink-0" />Código inválido o expirado
                      </p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {promoState === 'ok' && (
                <div className="flex items-center gap-2 mt-1.5">
                  <div className="flex items-center gap-1.5 text-emerald-600 text-xs">
                    <Check className="w-3.5 h-3.5" />
                    Código <span className="font-mono font-bold">{promoInput}</span> aplicado — {promoLabel}
                  </div>
                  <button type="button" onClick={removePromo} className="text-black/25 hover:text-black/50 transition-colors ml-auto">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </motion.div>

          {/* Datos personales */}
          <motion.div initial={{ y: 14 }} animate={{ y: 0 }} transition={{ delay: 0.14 }}>
            <div className="flex items-baseline justify-between mb-4">
              <p className="text-black/40 text-[10px] uppercase tracking-[0.42em]">Tus datos</p>
              <p className="text-black/25 text-[10px]"><span className="text-red-400">*</span> Todos los campos son obligatorios</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {([
                { label: 'Nombre',   key: 'firstName', placeholder: 'Juan',       type: 'text',  maxLength: 80  },
                { label: 'Apellido', key: 'lastName',  placeholder: 'Pérez',      type: 'text',  maxLength: 80  },
                { label: 'Cédula',   key: 'document',  placeholder: '1712345678', type: 'text',  maxLength: 10  },
                { label: 'Teléfono', key: 'phone',     placeholder: '0991234567', type: 'tel',   maxLength: 10  },
              ] as const).map(({ label, key, placeholder, type, maxLength }) => (
                <div key={key}>
                  <label className="block text-black/45 text-xs mb-1.5">{label} <span className="text-red-400">*</span></label>
                  <input
                    type={type} placeholder={placeholder} value={form[key]} maxLength={maxLength}
                    onBlur={() => touch(key)}
                    onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))}
                    className={`w-full border rounded-xl px-4 py-3 text-sm placeholder-black/20 focus:outline-none transition-colors ${fieldCls(key)}`}
                  />
                  {fieldErr(key)
                    ? <p className="text-red-400 text-[11px] mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 shrink-0" />{fieldErr(key)}
                      </p>
                    : key === 'phone' && <p className="text-black/30 text-[11px] mt-1">Usaremos este WhatsApp para enviarte tu entrada</p>
                  }
                </div>
              ))}
              <div className="col-span-2">
                <label className="block text-black/45 text-xs mb-1.5">Correo electrónico <span className="text-red-400">*</span></label>
                <input
                  type="email" placeholder="juan@correo.com" value={form.email} maxLength={254}
                  onBlur={() => touch('email')}
                  onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                  className={`w-full border rounded-xl px-4 py-3 text-sm placeholder-black/20 focus:outline-none transition-colors ${fieldCls('email')}`}
                />
                {fieldErr('email')
                  ? <p className="text-red-400 text-[11px] mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3 shrink-0" />{fieldErr('email')}</p>
                  : <p className="text-black/35 text-xs mt-1.5">Tu entrada llegará a este correo y por WhatsApp</p>
                }
              </div>
            </div>
          </motion.div>

          </div>{/* fin columna izquierda */}

          {/* ── COLUMNA DERECHA: banco + comprobante + envío ── */}
          <div className="space-y-6 mt-6 lg:mt-0">

          {/* Datos bancarios + upload */}
          <motion.div initial={{ y: 14 }} animate={{ y: 0 }} transition={{ delay: 0.2 }}>
            <p className="text-black/40 text-[10px] uppercase tracking-[0.42em] mb-4">Comprobante de pago</p>

            {/* Bloque de datos bancarios */}
            <div className="border border-black/[0.09] bg-white rounded-2xl overflow-hidden mb-4">
              {/* Header Banco Pichincha */}
              <div className="bg-[#00A44F] px-5 py-4 flex items-center gap-3">
                <div className="bg-white rounded-lg px-2.5 py-1.5 shrink-0 shadow-sm">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/banco-pichincha.svg" alt="Banco Pichincha" width={90} height={19} />
                </div>
                <div>
                  <p className="text-white/65 text-[11px]">{bankInfo.accountType}</p>
                </div>
                <div className="ml-auto text-right">
                  <p className="text-white/65 text-[10px] uppercase tracking-widest">Transferir</p>
                  <p className="text-white font-black text-xl leading-tight">${total}{discount > 0 && <span className="text-white/50 text-sm font-normal ml-1 line-through">${subtotal}</span>}</p>
                </div>
              </div>

              {/* Titular */}
              <div className="px-5 pt-4 pb-3 border-b border-black/[0.06]">
                <p className="text-black/30 text-[9px] uppercase tracking-[0.4em] mb-0.5">Titular</p>
                <p className="text-[#0A0A0A] font-semibold text-sm">{bankInfo.holder}</p>
              </div>

              {/* Campos copiables — vienen del servidor, no modificables en cliente */}
              <div className="divide-y divide-black/[0.05]">
                {bankInfo.fields.map(({ key, label, value }) => (
                  <div key={key} className="flex items-center justify-between px-5 py-3.5 group gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-black/30 text-[9px] uppercase tracking-[0.4em] mb-0.5">{label}</p>
                      <p className="text-[#0A0A0A] font-mono text-sm font-medium break-all">{value}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => copyField(key, value)}
                      className={`ml-4 flex items-center gap-1.5 text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-full border transition-all ${
                        copiedKey === key
                          ? 'border-[#00A44F]/30 bg-[#00A44F]/8 text-[#00A44F]'
                          : 'border-black/[0.08] text-black/30 hover:text-black/60 hover:border-black/20 hover:bg-black/[0.03]'
                      }`}
                    >
                      {copiedKey === key
                        ? <><Check className="w-3 h-3" /> Copiado</>
                        : <><Copy className="w-3 h-3" /> Copiar</>
                      }
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Upload */}
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => document.getElementById('file-input')?.click()}
              className={`relative border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-200 overflow-hidden ${
                dragOver
                  ? 'border-black/40 bg-black/[0.03]'
                  : showErrors && !file
                  ? 'border-red-300 bg-red-50/30'
                  : 'border-black/[0.08] hover:border-black/20 hover:bg-black/[0.02]'
              }`}
            >
              <input
                id="file-input" type="file" accept="image/*,.pdf"
                className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
              />
              <AnimatePresence mode="wait">
                {file && preview ? (
                  <motion.div key="preview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative h-52">
                    <Image src={preview} alt="Comprobante" fill className="object-contain p-2" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      <span className="text-white text-xs font-medium">Cambiar imagen</span>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setFile(null); setPreview(null); }}
                        className="bg-white/20 hover:bg-white/30 rounded-full p-1.5 transition-colors"
                      >
                        <X className="w-3.5 h-3.5 text-white" />
                      </button>
                    </div>
                  </motion.div>
                ) : file ? (
                  <motion.div key="file" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-between p-5">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-black/50 shrink-0" />
                      <span className="text-[#0A0A0A] text-sm font-medium truncate max-w-[220px]">{file.name}</span>
                    </div>
                    <button type="button" onClick={(e) => { e.stopPropagation(); setFile(null); setPreview(null); }}
                      className="text-black/25 hover:text-black/60 transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  </motion.div>
                ) : (
                  <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8 text-center">
                    <Upload className="w-7 h-7 text-black/18 mx-auto mb-3" />
                    <p className="text-black/35 text-sm">
                      <span className="hidden sm:inline">Arrastra tu comprobante o </span>
                      <span className="sm:hidden">Toca para </span>
                      <span className="text-[#0A0A0A] underline underline-offset-2">seleccionar el archivo</span>
                    </p>
                    <p className="text-black/20 text-xs mt-1.5">JPG, PNG o PDF · Máx. 10 MB</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {showErrors && !file && (
              <p className="text-red-400 text-[11px] mt-2 flex items-center gap-1">
                <AlertCircle className="w-3 h-3 shrink-0" />Debes adjuntar el comprobante de pago
              </p>
            )}
          </motion.div>

          {/* Checkbox legal */}
          <motion.div initial={{ y: 6 }} animate={{ y: 0 }} transition={{ delay: 0.25 }}>
            <label className={`flex items-start gap-3 cursor-pointer group ${showErrors && !agreed ? 'opacity-100' : ''}`}>
              <div className="relative mt-0.5 shrink-0">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="sr-only"
                />
                <div className={`w-4 h-4 rounded border transition-all ${
                  agreed
                    ? 'bg-[#0A0A0A] border-[#0A0A0A]'
                    : showErrors && !agreed
                    ? 'border-red-300 bg-red-50/40'
                    : 'border-black/20 bg-white group-hover:border-black/40'
                }`}>
                  {agreed && (
                    <svg className="w-4 h-4 text-white p-0.5" viewBox="0 0 16 16" fill="none">
                      <path d="M3 8l3.5 3.5L13 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
              </div>
              <span className="text-black/40 text-xs leading-relaxed">
                He leído y acepto los{' '}
                <Link href="/terminos" target="_blank" className="text-[#0A0A0A] underline underline-offset-2 hover:text-black/60 transition-colors">
                  Términos y Condiciones
                </Link>{' '}
                y la{' '}
                <Link href="/privacidad" target="_blank" className="text-[#0A0A0A] underline underline-offset-2 hover:text-black/60 transition-colors">
                  Política de Privacidad
                </Link>{' '}
                de UP.
              </span>
            </label>
          </motion.div>

          {/* Submit */}
          <motion.div initial={{ y: 6 }} animate={{ y: 0 }} transition={{ delay: 0.28 }}>
            <motion.button
              type="submit"
              disabled={state === 'loading'}
              whileHover={{ scale: state === 'loading' ? 1 : 1.02, backgroundColor: '#222' }}
              whileTap={{ scale: state === 'loading' ? 1 : 0.98 }}
              className="w-full bg-[#0A0A0A] text-white font-bold py-4 rounded-full text-sm uppercase tracking-widest transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {state === 'loading' ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Enviando...</>
              ) : (
                `Enviar solicitud · $${total}`
              )}
            </motion.button>

            {showErrors && !isFormComplete && (
              <motion.p initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
                className="text-red-400 text-xs text-center mt-3">
                Revisa los campos marcados en rojo
              </motion.p>
            )}

            {state === 'error' && errorMsg && (
              <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 justify-center mt-3">
                <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />
                <p className="text-red-400 text-xs">{errorMsg}</p>
              </motion.div>
            )}

            <p className="text-black/18 text-xs text-center mt-4">
              Verificamos tu pago en máx. 24 h y te enviamos tu entrada por WhatsApp y correo
            </p>
          </motion.div>

          </div>{/* fin columna derecha */}
        </form>
      </div>
    </main>
  );
}
