'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { Evento } from '@/lib/types'
import { Plus, LogOut, Clock, MapPin, Trash2 } from 'lucide-react'
import Link from 'next/link'

export default function DashboardListPage() {
  const router = useRouter()
  const supabase = createClient()
  const [eventos, setEventos] = useState<Evento[]>([])
  const [loading, setLoading] = useState(true)
  const [eliminando, setEliminando] = useState<string | null>(null)
  const [limite, setLimite] = useState(2)

  const LIMITE_POR_PLAN: Record<string, number> = { free: 2, pro: 20, club: 50 }

  async function handleEliminar(e: React.MouseEvent, eventoId: string) {
    e.preventDefault()
    if (!confirm('¿Eliminar este evento? Se borrarán todos los jugadores.')) return
    setEliminando(eventoId)
    // Eliminar capturas del storage
    const { data: jugs } = await supabase.from('jugadores').select('captura_url').eq('evento_id', eventoId)
    const paths = (jugs || []).filter(j => j.captura_url).map(j => j.captura_url!.split('/capturas/')[1]).filter(Boolean)
    if (paths.length > 0) await supabase.storage.from('capturas').remove(paths)
    await supabase.from('eventos').delete().eq('id', eventoId)
    setEventos(prev => prev.filter(ev => ev.id !== eventoId))
    setEliminando(null)
  }

  useEffect(() => {
    supabase.auth.refreshSession().then(async ({ data }) => {
      if (!data.user) { router.push('/auth'); return }

      const { data: evs } = await supabase
        .from('eventos').select('*').eq('organizador_id', data.user.id).order('fecha', { ascending: false })

      const plan = (data.user.user_metadata?.plan as string) ?? 'free'
      setLimite(LIMITE_POR_PLAN[plan] ?? 2)
      setEventos(evs || [])
      setLoading(false)
    })
  }, [])

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) return (
    <main className="min-h-screen bg-black flex items-center justify-center">
      <p className="text-zinc-400">Cargando...</p>
    </main>
  )

  return (
    <main className="min-h-screen bg-black px-4 py-8">
      <div className="max-w-lg mx-auto flex flex-col gap-5">

        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-green-400">Tinkuy</span>
          <div className="flex items-center gap-3">
            {eventos.length >= limite ? (
              <Link href="/upgrade">
                <button className="text-sm h-8 px-3 font-bold rounded-lg bg-yellow-500 text-black hover:bg-yellow-400 transition-colors">
                  ⚡ Mejorar plan
                </button>
              </Link>
            ) : (
              <Link href="/crear">
                <button className="text-sm h-8 px-3 font-bold rounded-lg bg-green-500 text-black hover:bg-green-400 transition-colors flex items-center gap-1">
                  <Plus size={14} /> Nuevo evento
                </button>
              </Link>
            )}
            <button onClick={handleLogout} className="text-zinc-500 hover:text-zinc-300">
              <LogOut size={18} />
            </button>
          </div>
        </div>

        <h1 className="text-lg font-semibold text-zinc-300">Mis eventos</h1>

        {eventos.length === 0 ? (
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-10 text-center">
            <p className="text-zinc-500 mb-4">No tienes eventos aún</p>
            <Link href="/crear">
              <Button className="bg-green-500 hover:bg-green-400 text-black font-bold">
                Crear mi primer evento
              </Button>
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {eventos.map(ev => {
              const fecha = new Date(ev.fecha + 'T12:00:00').toLocaleDateString('es-PE', {
                weekday: 'short', day: 'numeric', month: 'short'
              })
              const pasado = new Date(ev.fecha) < new Date(new Date().toDateString())

              return (
                <Link key={ev.id} href={`/dashboard/${ev.id}`}>
                  <div className="bg-zinc-900 border border-zinc-800 hover:border-zinc-600 rounded-2xl p-4 flex items-center justify-between transition-colors cursor-pointer">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">
                        {ev.deporte === 'Fútbol' ? '⚽' :
                         ev.deporte === 'Vóley' ? '🏐' :
                         ev.deporte === 'Surf' ? '🏄' :
                         ev.deporte === 'Básquet' ? '🏀' : '🏅'}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-white">{ev.nombre || ev.deporte}</p>
                          {pasado && <Badge className="bg-zinc-700 text-zinc-400 text-xs">Pasado</Badge>}
                        </div>
                        {ev.nombre && <p className="text-zinc-600 text-xs">{ev.deporte}</p>}
                        <div className="flex items-center gap-3 mt-0.5">
                          <span className="text-zinc-500 text-xs flex items-center gap-1">
                            <Clock size={10} /> <span className="capitalize">{fecha}</span>
                          </span>
                          <span className="text-zinc-500 text-xs flex items-center gap-1">
                            <MapPin size={10} /> {ev.lugar.split(',')[0]}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={(e) => handleEliminar(e, ev.id)}
                      disabled={eliminando === ev.id}
                      className="p-2 text-zinc-600 hover:text-red-400 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </Link>
              )
            })}
          </div>
        )}

      </div>
    </main>
  )
}
