'use client'

import Link from 'next/link'
import { Share2, Clock, CreditCard, MapPin, Zap, CalendarPlus, Send, Banknote, Users } from 'lucide-react'
import { motion } from 'motion/react'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay },
  }),
}

function SectionHeader({ label, title }: { label: string; title: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="text-center mb-10"
    >
      <p className="text-zinc-500 text-xs uppercase tracking-widest mb-2">{label}</p>
      <h2 className="text-xl md:text-2xl font-bold tracking-tight">{title}</h2>
    </motion.div>
  )
}

function GlassButton({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <div className="p-[1px] rounded-2xl bg-gradient-to-r from-green-400/40 via-emerald-400/15 to-green-400/40">
      <Link href={href}>
        <button className="flex items-center gap-3 bg-black hover:bg-zinc-950 text-white font-semibold px-6 py-3.5 rounded-2xl text-base transition-all duration-200 group">
          <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-br from-green-400 to-emerald-500 text-black shadow-lg shadow-green-500/30 group-hover:scale-110 transition-transform duration-200">
            <Zap size={15} />
          </span>
          {children}
        </button>
      </Link>
    </div>
  )
}

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white overflow-hidden">

      {/* Nav */}
      <nav className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 border-b border-white/8 bg-black/70 backdrop-blur-md">
        <span className="text-xl font-bold text-green-400 tracking-tight">Tinkuy</span>
        <Link href="/auth">
          <button className="text-sm text-white/70 hover:text-white border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/8 px-4 py-2 rounded-xl transition-all duration-200">
            Entrar
          </button>
        </Link>
      </nav>

      {/* ── HERO ── */}
      <section className="relative flex flex-col items-center text-center px-6 pt-20 pb-16 gap-6">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full bg-green-500/10 blur-[150px] pointer-events-none" />

        {/* Emojis individuales con float escalonado */}
        <motion.div
          initial="hidden" animate="show" custom={0} variants={fadeUp}
          className="flex gap-4 select-none"
        >
          {['⚽', '🏐', '🏄', '🏀'].map((emoji, i) => (
            <motion.span
              key={emoji}
              className="text-5xl"
              animate={{ y: [0, -12, 0] }}
              transition={{
                duration: 2.8,
                repeat: Infinity,
                delay: i * 0.35,
                ease: 'easeInOut',
              }}
            >
              {emoji}
            </motion.span>
          ))}
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial="hidden" animate="show" custom={0.1} variants={fadeUp}
          className="text-5xl md:text-7xl font-bold leading-[1.07] tracking-tight max-w-3xl"
        >
          <span className="bg-gradient-to-b from-white to-white/65 bg-clip-text text-transparent">
            Organiza tu deporte
          </span>
          <br />
          <span className="bg-gradient-to-r from-green-300 via-green-400 to-emerald-400 bg-clip-text text-transparent">
            sin el caos de WhatsApp
          </span>
        </motion.h1>

        {/* Sub */}
        <motion.p
          initial="hidden" animate="show" custom={0.2} variants={fadeUp}
          className="text-white/50 text-base md:text-lg max-w-md leading-relaxed"
        >
          Crea el evento en segundos, comparte el link y los jugadores se apuntan
          y confirman su pago con Yape o Plin. Tú solo apareces a jugar.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial="hidden" animate="show" custom={0.3} variants={fadeUp}
          className="flex flex-col items-center gap-2.5"
        >
          <GlassButton href="/auth">Crear mi evento gratis</GlassButton>
          <p className="text-zinc-600 text-xs">Gratis para siempre · Sin descargar nada</p>
        </motion.div>
      </section>

      {/* ── CÓMO FUNCIONA ── */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <SectionHeader
          label="Cómo funciona"
          title={<>Del caos al partido en <span className="text-green-400">4 pasos</span></>}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            {
              icon: <CalendarPlus size={20} className="text-green-400" />,
              n: '01',
              title: 'Crea el evento',
              text: 'Elige deporte, fecha, hora, lugar y cupo máximo en segundos.',
            },
            {
              icon: <Send size={20} className="text-green-400" />,
              n: '02',
              title: 'Comparte el link',
              text: 'Manda el link por WhatsApp. Los jugadores entran sin registrarse.',
            },
            {
              icon: <Banknote size={20} className="text-green-400" />,
              n: '03',
              title: 'Cobras sin drama',
              text: 'Cada jugador yapea y sube su captura. Sin cobrar en efectivo.',
            },
            {
              icon: <Users size={20} className="text-green-400" />,
              n: '04',
              title: 'Solo aparece a jugar',
              text: 'Ves en tiempo real quién va y quién pagó. Solo te preocupas por ganar.',
            },
          ].map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.09 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="relative group flex flex-col gap-4 p-5 rounded-2xl border border-white/8 bg-white/3 hover:bg-white/5 hover:border-white/14 backdrop-blur-sm transition-colors duration-200 cursor-default"
            >
              <span className="absolute top-4 right-4 text-xs font-bold text-zinc-800 group-hover:text-zinc-700 transition-colors">
                {s.n}
              </span>
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-green-500/10 border border-green-500/20 group-hover:bg-green-500/15 transition-colors duration-200">
                {s.icon}
              </div>
              <div>
                <h3 className="font-semibold text-white text-sm mb-1.5">{s.title}</h3>
                <p className="text-zinc-500 text-xs leading-relaxed">{s.text}</p>
              </div>
              <div className="absolute bottom-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-green-500/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="max-w-5xl mx-auto px-6 py-16 border-t border-white/5">
        <SectionHeader
          label="Por qué Tinkuy"
          title={<>Todo lo que necesitas, <span className="text-green-400">nada de lo que no</span></>}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            {
              icon: <Share2 size={20} className="text-green-400" />,
              title: 'Un link, todo resuelto',
              desc: 'Los jugadores lo abren desde WhatsApp sin descargar ninguna app ni crear cuenta.',
            },
            {
              icon: <Clock size={20} className="text-green-400" />,
              title: 'Actualizaciones en tiempo real',
              desc: 'La lista se actualiza automáticamente. Sabes al instante cuántos van.',
            },
            {
              icon: <CreditCard size={20} className="text-green-400" />,
              title: 'Pagos con Yape / Plin',
              desc: 'Los jugadores suben su captura. Tú ves quién pagó y quién está pendiente.',
            },
            {
              icon: <MapPin size={20} className="text-green-400" />,
              title: 'Cualquier deporte',
              desc: 'Fútbol, vóley, surf, básquet — cualquier actividad grupal que necesite organización.',
            },
          ].map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.08 }}
              whileHover={{ scale: 1.015, transition: { duration: 0.15 } }}
              className="group flex gap-4 p-5 rounded-2xl border border-white/8 bg-white/3 hover:bg-white/5 hover:border-white/14 backdrop-blur-sm transition-colors duration-200 cursor-default"
            >
              <div className="shrink-0 flex items-center justify-center w-10 h-10 rounded-xl bg-green-500/10 border border-green-500/20 group-hover:bg-green-500/15 transition-colors duration-200 mt-0.5">
                {f.icon}
              </div>
              <div>
                <h3 className="font-semibold text-white text-sm mb-1.5">{f.title}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── PRECIOS ── */}
      <section className="max-w-2xl mx-auto px-6 py-16 border-t border-white/5">
        <SectionHeader
          label="Planes"
          title={<>Empieza gratis, <span className="text-green-400">crece cuando quieras</span></>}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          {[
            {
              name: 'Gratis',
              price: 'S/ 0',
              sub: 'para siempre',
              features: ['2 eventos activos', 'Jugadores ilimitados', 'Confirmación de pagos'],
              highlight: false,
            },
            {
              name: 'Pro',
              price: 'S/ 9',
              sub: '/ mes',
              features: ['20 eventos activos', 'Jugadores ilimitados', 'Confirmación de pagos'],
              highlight: true,
            },
            {
              name: 'Club',
              price: 'S/ 19',
              sub: '/ mes',
              features: ['50 eventos activos', 'Jugadores ilimitados', 'Ideal para ligas'],
              highlight: false,
            },
          ].map((p, i) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className={`relative rounded-2xl p-5 flex flex-col gap-4 transition-all duration-200 ${
                p.highlight
                  ? 'bg-white/5 border border-green-500/50 shadow-xl shadow-green-500/8 md:scale-[1.05]'
                  : 'bg-white/3 border border-white/8 hover:border-white/15'
              }`}
            >
              {p.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-green-500 text-black text-xs font-bold whitespace-nowrap">
                  Popular
                </div>
              )}
              <div>
                <p className="text-sm font-semibold text-white/70">{p.name}</p>
                <p className="text-3xl font-bold mt-1 tracking-tight">
                  {p.price}
                  <span className="text-zinc-500 text-sm font-normal ml-1">{p.sub}</span>
                </p>
              </div>
              <div className="h-px bg-white/6" />
              <ul className="flex flex-col gap-2">
                {p.features.map((f) => (
                  <li key={f} className="text-zinc-400 text-sm flex items-center gap-2.5">
                    <span className="text-green-400 leading-none">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <p className="text-center text-zinc-600 text-xs mt-5">
          Plan Pro y Club vía WhatsApp · Activación en menos de 24h
        </p>
      </section>

      {/* ── CTA FINAL ── */}
      <section className="relative text-center px-6 py-20 border-t border-white/5 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[600px] h-[300px] rounded-full bg-green-500/7 blur-[110px]" />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative flex flex-col items-center gap-4"
        >
          <p className="text-zinc-500 text-xs uppercase tracking-widest">Únete hoy</p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight max-w-xl leading-tight">
            ¿Listo para el{' '}
            <span className="text-green-400">próximo partido?</span>
          </h2>
          <p className="text-zinc-500 text-sm max-w-xs">
            Sin tarjeta de crédito. Sin descargas. Empieza en un minuto.
          </p>
          <div className="mt-1">
            <GlassButton href="/auth">Empezar gratis</GlassButton>
          </div>
        </motion.div>
      </section>

      <footer className="text-center text-zinc-700 text-sm py-8 border-t border-white/5">
        Tinkuy © 2026 — Hecho con ⚽ en Perú
      </footer>
    </main>
  )
}
