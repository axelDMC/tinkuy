'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { toast } from 'sonner'
import Link from 'next/link'

export default function AuthPage() {
  const supabase = createClient()
  const [loading, setLoading] = useState(false)

  async function handleGoogle() {
    setLoading(true)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    })
    if (error) {
      toast.error(error.message)
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-black flex flex-col items-center justify-center px-4">

      <div className="w-full max-w-sm flex flex-col items-center gap-8">

        {/* Logo */}
        <div className="text-center">
          <div className="flex justify-center gap-1 text-2xl mb-3">⚽ 🏐 🏄 🏀</div>
          <Link href="/" className="text-3xl font-bold text-green-400">Tinkuy</Link>
          <p className="text-zinc-500 text-sm mt-2">Organiza tu deporte sin el caos</p>
        </div>

        {/* Card */}
        <div className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-8 flex flex-col gap-5">
          <div className="text-center">
            <h1 className="text-lg font-bold text-white">Bienvenido</h1>
            <p className="text-zinc-500 text-sm mt-1">Entra con tu cuenta de Google para continuar</p>
          </div>

          <button
            onClick={handleGoogle}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 bg-white hover:bg-zinc-100 active:bg-zinc-200 text-black font-semibold rounded-xl py-3.5 text-sm transition-colors disabled:opacity-50 shadow-lg shadow-white/5"
          >
            <svg width="20" height="20" viewBox="0 0 18 18">
              <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/>
              <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"/>
              <path fill="#FBBC05" d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.961H.957C.347 6.175 0 7.55 0 9s.348 2.826.957 4.039l3.007-2.332z"/>
              <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.961L3.964 7.293C4.672 5.166 6.656 3.58 9 3.58z"/>
            </svg>
            {loading ? 'Redirigiendo...' : 'Continuar con Google'}
          </button>

          <p className="text-zinc-600 text-xs text-center">
            Gratis · Sin tarjeta · Sin descargas
          </p>
        </div>

        <Link href="/" className="text-zinc-600 hover:text-zinc-400 text-sm transition-colors">
          ← Volver al inicio
        </Link>

      </div>
    </main>
  )
}
