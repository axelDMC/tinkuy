'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'

export default function UpgradePage() {
  const router = useRouter()

  return (
    <main className="min-h-screen bg-black px-4 py-8">
      <div className="max-w-sm mx-auto flex flex-col gap-4">

        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-zinc-500 hover:text-white text-sm transition-colors w-fit"
        >
          <ArrowLeft size={15} /> Volver
        </button>

        <div className="text-center py-4">
          <p className="text-zinc-500 text-sm uppercase tracking-widest mb-1">Planes</p>
          <h1 className="text-2xl font-bold">Lleva tu juego al siguiente nivel</h1>
        </div>

        {/* Plan Pro */}
        <div className="relative bg-zinc-900 border border-green-500 rounded-2xl p-5 flex flex-col gap-4">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
            <span className="bg-green-500 text-black text-xs font-bold px-3 py-1 rounded-full">
              MÁS POPULAR
            </span>
          </div>
          <div className="flex items-end justify-between mt-1">
            <div>
              <p className="text-xl font-bold text-white">Pro</p>
              <p className="text-zinc-400 text-sm">Hasta 20 eventos</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-green-400">S/ 9</p>
              <p className="text-zinc-500 text-xs">por mes</p>
            </div>
          </div>
          <ul className="text-sm flex flex-col gap-2">
            <li className="flex items-center gap-2 text-zinc-300">
              <span className="text-green-400">✓</span> 20 eventos activos
            </li>
            <li className="flex items-center gap-2 text-zinc-300">
              <span className="text-green-400">✓</span> Lista en tiempo real
            </li>
            <li className="flex items-center gap-2 text-zinc-300">
              <span className="text-green-400">✓</span> Confirmación de pagos con captura
            </li>
          </ul>
          <a
            href="https://wa.me/51923089261?text=Hola%2C%20quiero%20el%20plan%20Pro%20de%20Tinkuy%20(S%2F%209%2Fmes)"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-green-500 hover:bg-green-400 active:bg-green-600 text-black font-bold rounded-xl py-3 text-sm text-center transition-colors"
          >
            Obtener Pro por WhatsApp
          </a>
        </div>

        {/* Plan Club */}
        <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-5 flex flex-col gap-4">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xl font-bold text-white">Club</p>
              <p className="text-zinc-400 text-sm">Hasta 50 eventos</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-white">S/ 19</p>
              <p className="text-zinc-500 text-xs">por mes</p>
            </div>
          </div>
          <ul className="text-sm flex flex-col gap-2">
            <li className="flex items-center gap-2 text-zinc-300">
              <span className="text-zinc-400">✓</span> 50 eventos activos
            </li>
            <li className="flex items-center gap-2 text-zinc-300">
              <span className="text-zinc-400">✓</span> Todo lo del plan Pro
            </li>
            <li className="flex items-center gap-2 text-zinc-300">
              <span className="text-zinc-400">✓</span> Ideal para ligas y clubes
            </li>
          </ul>
          <a
            href="https://wa.me/51923089261?text=Hola%2C%20quiero%20el%20plan%20Club%20de%20Tinkuy%20(S%2F%2019%2Fmes)"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-zinc-700 hover:bg-zinc-600 text-white font-bold rounded-xl py-3 text-sm text-center transition-colors"
          >
            Obtener Club por WhatsApp
          </a>
        </div>

        <p className="text-center text-zinc-600 text-xs pb-4">
          Pagos via Yape · Activación en menos de 24h
        </p>

      </div>
    </main>
  )
}
