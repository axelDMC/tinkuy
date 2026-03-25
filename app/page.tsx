'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Users, MapPin, CreditCard, Share2, Clock } from 'lucide-react'

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
        <span className="text-xl font-bold text-green-400">Tinkuy</span>
        <Link href="/auth">
          <Button className="bg-zinc-800 text-white hover:bg-zinc-700 border border-zinc-700">
            Entrar
          </Button>
        </Link>
      </nav>

      {/* Hero */}
      <section className="flex flex-col items-center justify-center text-center px-6 py-24 gap-6">
        <div className="flex gap-2 text-3xl">⚽ 🏐 🏄 🏀</div>
        <h1 className="text-4xl md:text-5xl font-bold leading-tight max-w-2xl">
          Organiza tu deporte<br />
          <span className="text-green-400">sin el caos de WhatsApp</span>
        </h1>
        <p className="text-zinc-400 text-lg max-w-md">
          Crea el evento en segundos, comparte el link y los jugadores se apuntan y confirman su pago con Yape o Plin. Tú solo apareces a jugar.
        </p>
        <Link href="/auth">
          <Button className="bg-green-500 hover:bg-green-400 text-black font-bold px-8 py-6 text-lg rounded-xl">
            Crear mi evento gratis →
          </Button>
        </Link>
        <p className="text-zinc-600 text-sm">Gratis para siempre · Sin descargar nada</p>
      </section>

      {/* Cómo funciona */}
      <section className="max-w-lg mx-auto px-6 pb-16">
        <h2 className="text-center text-zinc-500 text-sm uppercase tracking-widest mb-8">Cómo funciona</h2>
        <div className="flex flex-col gap-4">
          {[
            { n: '1', text: 'Crea el evento — deporte, fecha, hora, lugar y cupo máximo' },
            { n: '2', text: 'Comparte el link por WhatsApp — los jugadores lo abren sin registrarse' },
            { n: '3', text: 'Cada jugador se anota, yapea y sube su captura de pago' },
            { n: '4', text: 'Tú ves en tiempo real quién va y quién pagó' },
          ].map((s) => (
            <div key={s.n} className="flex items-start gap-4">
              <span className="bg-green-500 text-black font-bold rounded-full w-7 h-7 flex items-center justify-center text-sm shrink-0">
                {s.n}
              </span>
              <p className="text-zinc-300 text-sm pt-0.5">{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-4xl mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          {
            icon: <Share2 className="text-green-400" size={22} />,
            title: 'Un link, todo resuelto',
            desc: 'Los jugadores lo abren desde WhatsApp sin descargar ninguna app.',
          },
          {
            icon: <Clock className="text-green-400" size={22} />,
            title: 'Tiempo real',
            desc: 'La lista se actualiza automáticamente. Sabes al instante cuántos van.',
          },
          {
            icon: <CreditCard className="text-green-400" size={22} />,
            title: 'Pagos con Yape / Plin',
            desc: 'Los jugadores suben su captura. Tú ves quién pagó y quién está pendiente.',
          },
          {
            icon: <MapPin className="text-green-400" size={22} />,
            title: 'Cualquier deporte',
            desc: 'Fútbol, vóley, surf, básquet — cualquier actividad grupal que necesite organización.',
          },
        ].map((f) => (
          <div key={f.title} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex gap-4">
            <div className="mt-0.5 shrink-0">{f.icon}</div>
            <div>
              <h3 className="font-semibold text-white mb-1">{f.title}</h3>
              <p className="text-zinc-400 text-sm">{f.desc}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Precios */}
      <section className="max-w-2xl mx-auto px-6 py-16">
        <h2 className="text-center text-zinc-500 text-sm uppercase tracking-widest mb-8">Planes</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              name: 'Gratis',
              price: 'S/ 0',
              sub: 'para siempre',
              features: ['2 eventos', 'Jugadores ilimitados', 'Confirmación de pagos'],
              highlight: false,
            },
            {
              name: 'Pro',
              price: 'S/ 9',
              sub: 'por mes',
              features: ['20 eventos', 'Jugadores ilimitados', 'Confirmación de pagos'],
              highlight: true,
            },
            {
              name: 'Club',
              price: 'S/ 19',
              sub: 'por mes',
              features: ['50 eventos', 'Jugadores ilimitados', 'Ideal para ligas'],
              highlight: false,
            },
          ].map((p) => (
            <div
              key={p.name}
              className={`rounded-2xl p-5 flex flex-col gap-3 ${
                p.highlight
                  ? 'bg-zinc-900 border border-green-500'
                  : 'bg-zinc-900 border border-zinc-800'
              }`}
            >
              {p.highlight && (
                <span className="text-xs font-bold text-green-400 uppercase tracking-widest">Popular</span>
              )}
              <div>
                <p className="text-lg font-bold">{p.name}</p>
                <p className="text-2xl font-bold mt-1">{p.price} <span className="text-zinc-500 text-sm font-normal">{p.sub}</span></p>
              </div>
              <ul className="flex flex-col gap-1.5">
                {p.features.map(f => (
                  <li key={f} className="text-zinc-400 text-sm flex items-center gap-2">
                    <span className="text-green-400">✓</span> {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="text-center text-zinc-600 text-xs mt-4">
          Plan Pro y Club vía WhatsApp · Activación en menos de 24h
        </p>
      </section>

      {/* CTA */}
      <section className="text-center px-6 py-16 border-t border-zinc-800">
        <h2 className="text-2xl font-bold mb-2">¿Listo para el próximo partido?</h2>
        <p className="text-zinc-500 text-sm mb-6">Únete gratis. Sin tarjeta. Sin descargas.</p>
        <Link href="/auth">
          <Button className="bg-green-500 hover:bg-green-400 text-black font-bold px-8 py-4 rounded-xl text-base">
            Empezar gratis →
          </Button>
        </Link>
      </section>

      <footer className="text-center text-zinc-600 text-sm py-8 border-t border-zinc-800">
        Tinkuy © 2026 — Hecho con ⚽ en Perú
      </footer>
    </main>
  )
}
