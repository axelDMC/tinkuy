'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import Link from 'next/link'

const DEPORTES = ['Fútbol', 'Vóley', 'Básquet', 'Tenis', 'Pádel', 'Surf', 'Natación', 'Otro']

export default function CrearPage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [limiteAlcanzado, setLimiteAlcanzado] = useState(false)

  const LIMITE_POR_PLAN: Record<string, number> = { free: 2, pro: 20, club: 50 }
  const fechaRef = useRef<HTMLInputElement>(null)
  const horaRef = useRef<HTMLInputElement>(null)

  const [form, setForm] = useState({
    nombre: '',
    deporte: 'Fútbol',
    fecha: '',
    hora: '',
    lugar: '',
    costo_por_persona: '',
    cupo_maximo: '10',
    yape_numero: '',
    cuenta_bancaria: '',
  })

  useEffect(() => {
    supabase.auth.refreshSession().then(async ({ data }) => {
      if (!data.user) { router.push('/auth'); return }
      setUserId(data.user.id)

      const { count } = await supabase
        .from('eventos').select('*', { count: 'exact', head: true }).eq('organizador_id', data.user.id)

      const plan = (data.user.user_metadata?.plan as string) ?? 'free'
      const limite = LIMITE_POR_PLAN[plan] ?? 2
      if ((count ?? 0) >= limite) setLimiteAlcanzado(true)
    })
  }, [])

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!userId) return
    setLoading(true)

    const { data, error } = await supabase
      .from('eventos')
      .insert({
        organizador_id: userId,
        nombre: form.nombre || null,
        deporte: form.deporte,
        fecha: form.fecha,
        hora: form.hora,
        lugar: form.lugar,
        costo_por_persona: parseFloat(form.costo_por_persona) || 0,
        cupo_maximo: parseInt(form.cupo_maximo) || 10,
        yape_numero: form.yape_numero || null,
        cuenta_bancaria: form.cuenta_bancaria || null,
      })
      .select()
      .single()

    if (error) {
      toast.error('Error al crear el evento')
      console.error(error)
    } else {
      toast.success('¡Evento creado!')
      router.push(`/dashboard/${data.id}`)
    }
    setLoading(false)
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <main className="min-h-screen bg-black px-4 py-8">
      <div className="max-w-lg mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Link href="/dashboard" className="flex items-center gap-1.5 text-zinc-400 hover:text-white text-sm transition-colors">
            ← Mis eventos
          </Link>
          <button onClick={handleLogout} className="text-zinc-500 text-sm hover:text-zinc-300">
            Salir
          </button>
        </div>

        {limiteAlcanzado ? (
          <div className="flex flex-col gap-4">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 text-center">
              <span className="text-3xl">🔒</span>
              <h2 className="text-lg font-bold mt-2">Alcanzaste el límite gratis</h2>
              <p className="text-zinc-500 text-sm mt-1">Elige un plan para seguir creando eventos</p>
            </div>

            {/* Plan Pro */}
            <div className="bg-zinc-900 border border-green-500/40 rounded-2xl p-5 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-white">Pro</p>
                  <p className="text-zinc-500 text-xs">Hasta 20 eventos</p>
                </div>
                <div className="text-right">
                  <p className="text-green-400 font-bold text-lg">S/ 9</p>
                  <p className="text-zinc-500 text-xs">por mes</p>
                </div>
              </div>
              <ul className="text-zinc-400 text-sm flex flex-col gap-1">
                <li>✓ 20 eventos activos</li>
                <li>✓ Lista de jugadores en tiempo real</li>
                <li>✓ Confirmación de pagos con captura</li>
              </ul>
              <a
                href="https://wa.me/51923089261?text=Hola%2C%20quiero%20el%20plan%20Pro%20de%20Tinkuy%20(S%2F%209%2Fmes)"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-green-500 hover:bg-green-400 text-black font-bold rounded-xl py-2.5 text-sm text-center transition-colors"
              >
                Escribir por WhatsApp →
              </a>
            </div>

            {/* Plan Club */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-white">Club</p>
                  <p className="text-zinc-500 text-xs">Hasta 50 eventos</p>
                </div>
                <div className="text-right">
                  <p className="text-white font-bold text-lg">S/ 19</p>
                  <p className="text-zinc-500 text-xs">por mes</p>
                </div>
              </div>
              <ul className="text-zinc-400 text-sm flex flex-col gap-1">
                <li>✓ 50 eventos activos</li>
                <li>✓ Todo lo del plan Pro</li>
                <li>✓ Ideal para ligas y clubes</li>
              </ul>
              <a
                href="https://wa.me/51923089261?text=Hola%2C%20quiero%20el%20plan%20Club%20de%20Tinkuy%20(S%2F%2019%2Fmes)"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-zinc-700 hover:bg-zinc-600 text-white font-bold rounded-xl py-2.5 text-sm text-center transition-colors"
              >
                Escribir por WhatsApp →
              </a>
            </div>

            <Link href="/dashboard">
              <Button className="w-full bg-transparent text-zinc-500 hover:text-zinc-300 border border-zinc-800 text-sm">
                ← Volver a mis eventos
              </Button>
            </Link>
          </div>
        ) : (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <h1 className="text-xl font-bold mb-6">Nuevo evento</h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Nombre */}
            <div>
              <Label className="text-zinc-400 text-sm mb-1 block">Nombre del evento</Label>
              <Input
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                placeholder="Pichanga del sábado, Vóley playa, etc."
                className="bg-zinc-800 border-zinc-700 text-white"
              />
            </div>

            {/* Deporte */}
            <div>
              <Label className="text-zinc-400 text-sm mb-1 block">Deporte</Label>
              <select
                name="deporte"
                value={form.deporte}
                onChange={handleChange}
                className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-md px-3 py-2 text-sm"
              >
                {DEPORTES.map(d => <option key={d}>{d}</option>)}
              </select>
            </div>

            {/* Fecha y hora */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-zinc-400 text-sm mb-1 block">Fecha</Label>
                <div className="relative">
                  <div
                    onClick={() => fechaRef.current?.showPicker()}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-md px-3 py-2 text-sm cursor-pointer flex items-center justify-between"
                  >
                    <span className={form.fecha ? 'text-white' : 'text-zinc-500'}>
                      {form.fecha
                        ? new Date(form.fecha + 'T12:00:00').toLocaleDateString('es-PE', { day: 'numeric', month: 'short', year: 'numeric' })
                        : 'dd/mm/aaaa'}
                    </span>
                    <span className="text-zinc-500">📅</span>
                  </div>
                  <input
                    ref={fechaRef}
                    type="date"
                    name="fecha"
                    value={form.fecha}
                    onChange={handleChange}
                    required
                    className="absolute bottom-0 left-0 w-full h-0 opacity-0 [color-scheme:dark]"
                  />
                </div>
              </div>
              <div>
                <Label className="text-zinc-400 text-sm mb-1 block">Hora</Label>
                <div className="relative">
                  <div
                    onClick={() => horaRef.current?.showPicker()}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-md px-3 py-2 text-sm cursor-pointer flex items-center justify-between"
                  >
                    <span className={form.hora ? 'text-white' : 'text-zinc-500'}>
                      {form.hora || 'hh:mm'}
                    </span>
                    <span className="text-zinc-500">🕐</span>
                  </div>
                  <input
                    ref={horaRef}
                    type="time"
                    name="hora"
                    value={form.hora}
                    onChange={handleChange}
                    required
                    className="absolute bottom-0 left-0 w-full h-0 opacity-0 [color-scheme:dark]"
                  />
                </div>
              </div>
            </div>

            {/* Lugar */}
            <div>
              <Label className="text-zinc-400 text-sm mb-1 block">Lugar</Label>
              <Input
                name="lugar"
                value={form.lugar}
                onChange={handleChange}
                placeholder="Cancha Los Primos, Miraflores"
                required
                className="bg-zinc-800 border-zinc-700 text-white"
              />
            </div>

            {/* Costo y cupo */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-zinc-400 text-sm mb-1 block">Costo por persona (S/)</Label>
                <Input
                  type="number"
                  name="costo_por_persona"
                  value={form.costo_por_persona}
                  onChange={handleChange}
                  placeholder="15"
                  min="0"
                  className="bg-zinc-800 border-zinc-700 text-white"
                />
              </div>
              <div>
                <Label className="text-zinc-400 text-sm mb-1 block">Cupo máximo</Label>
                <Input
                  type="number"
                  name="cupo_maximo"
                  value={form.cupo_maximo}
                  onChange={handleChange}
                  placeholder="10"
                  min="2"
                  required
                  className="bg-zinc-800 border-zinc-700 text-white"
                />
              </div>
            </div>

            {/* Pago — solo si hay costo */}
            {parseFloat(form.costo_por_persona) > 0 && (
            <div className="border-t border-zinc-700 pt-4 mt-2">
              <p className="text-zinc-400 text-sm mb-3">¿A dónde te yapean? (para que los jugadores confirmen su pago)</p>
              <div className="flex flex-col gap-3">
                <div>
                  <Label className="text-zinc-400 text-sm mb-1 block">Número de Yape / Plin</Label>
                  <Input
                    name="yape_numero"
                    value={form.yape_numero}
                    onChange={handleChange}
                    placeholder="987654321"
                    className="bg-zinc-800 border-zinc-700 text-white"
                  />
                </div>
                <div>
                  <Label className="text-zinc-400 text-sm mb-1 block">Número de cuenta (opcional)</Label>
                  <Input
                    name="cuenta_bancaria"
                    value={form.cuenta_bancaria}
                    onChange={handleChange}
                    placeholder="BCP 123-456789-0-12"
                    className="bg-zinc-800 border-zinc-700 text-white"
                  />
                </div>
              </div>
            </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="bg-green-500 hover:bg-green-400 text-black font-bold mt-2 py-5"
            >
              {loading ? 'Creando...' : 'Crear evento y obtener link →'}
            </Button>
          </form>
        </div>
        )}
      </div>
    </main>
  )
}
