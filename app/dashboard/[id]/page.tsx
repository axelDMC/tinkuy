'use client'

export const runtime = 'edge'

import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import type { Evento, Jugador } from '@/lib/types'
import { MapPin, Clock, Users, DollarSign, CheckCircle, Copy, ExternalLink, Trash2, LogOut, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
  const { id } = useParams()
  const router = useRouter()
  const supabase = createClient()

  const [evento, setEvento] = useState<Evento | null>(null)
  const [jugadores, setJugadores] = useState<Jugador[]>([])
  const [loading, setLoading] = useState(true)
  const [capturaAbierta, setCapturaAbierta] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/auth'); return }

    const [{ data: ev }, { data: jugs }] = await Promise.all([
      supabase.from('eventos').select('*').eq('id', id).single(),
      supabase.from('jugadores').select('*').eq('evento_id', id).order('created_at'),
    ])

    if (!ev || ev.organizador_id !== user.id) {
      router.push('/')
      return
    }

    setEvento(ev)
    setJugadores(jugs || [])
    setLoading(false)
  }, [id])

  useEffect(() => { fetchData() }, [fetchData])

  useEffect(() => {
    const interval = setInterval(fetchData, 5000)
    return () => clearInterval(interval)
  }, [fetchData])

  async function eliminarCapturas(jugs: Jugador[]) {
    const paths = jugs.filter(j => j.captura_url).map(j => {
      const url = j.captura_url!
      return url.split('/capturas/')[1]
    }).filter(Boolean)
    if (paths.length > 0) {
      await supabase.storage.from('capturas').remove(paths)
    }
  }

  async function handleEliminarJugador(jugadorId: string) {
    const jugador = jugadores.find(j => j.id === jugadorId)
    const { error } = await supabase.from('jugadores').delete().eq('id', jugadorId)
    if (error) {
      toast.error(`Error: ${error.message}`)
    } else {
      if (jugador) await eliminarCapturas([jugador])
      setJugadores(prev => prev.filter(j => j.id !== jugadorId))
      toast.success('Jugador eliminado')
    }
  }

  async function handleLimpiarJugadores() {
    if (!confirm('¿Eliminar todos los jugadores? El evento quedará listo para usarse de nuevo.')) return
    await eliminarCapturas(jugadores)
    await supabase.from('jugadores').delete().eq('evento_id', id)
    setJugadores([])
    toast.success('Lista limpia')
  }

  async function handleMarcarPagado(jugador: Jugador) {
    const { error } = await supabase
      .from('jugadores')
      .update({ pagado: !jugador.pagado })
      .eq('id', jugador.id)

    if (error) {
      toast.error('Error al actualizar')
    } else {
      setJugadores(prev =>
        prev.map(j => j.id === jugador.id ? { ...j, pagado: !j.pagado } : j)
      )
      toast.success(jugador.pagado ? 'Marcado como pendiente' : 'Marcado como pagado')
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/')
  }

  function copyLink() {
    const url = `${window.location.origin}/evento/${id}`
    navigator.clipboard.writeText(url)
    toast.success('¡Link copiado!')
  }

  if (loading) return (
    <main className="min-h-screen bg-black flex items-center justify-center">
      <p className="text-zinc-400">Cargando...</p>
    </main>
  )

  if (!evento) return null

  const confirmados = jugadores.length
  const pagados = jugadores.filter(j => j.pagado).length
  const pendientes = confirmados - pagados
  const lleno = confirmados >= evento.cupo_maximo
  const totalRecaudado = pagados * evento.costo_por_persona

  const fechaFormateada = new Date(evento.fecha + 'T12:00:00').toLocaleDateString('es-PE', {
    weekday: 'long', day: 'numeric', month: 'long'
  })

  return (
    <main className="min-h-screen bg-black px-4 py-8">
      <div className="max-w-2xl mx-auto flex flex-col gap-5">

        {/* Nav */}
        <div className="flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-1.5 text-zinc-400 hover:text-white transition-colors text-sm">
            <ArrowLeft size={16} />
            Mis eventos
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/crear">
              <Button className="bg-zinc-800 text-white hover:bg-zinc-700 border border-zinc-700 text-sm py-1 h-8">
                + Nuevo
              </Button>
            </Link>
            <button onClick={handleLogout} className="text-zinc-500 hover:text-zinc-300">
              <LogOut size={18} />
            </button>
          </div>
        </div>

        {/* Header del evento */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl">
                  {evento.deporte === 'Fútbol' ? '⚽' :
                   evento.deporte === 'Vóley' ? '🏐' :
                   evento.deporte === 'Surf' ? '🏄' :
                   evento.deporte === 'Básquet' ? '🏀' : '🏅'}
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-xl font-bold">{evento.nombre || evento.deporte}</h1>
                    {lleno && <Badge className="bg-yellow-500 text-black text-xs">Lleno</Badge>}
                  </div>
                  {evento.nombre && <p className="text-zinc-500 text-xs">{evento.deporte}</p>}
                </div>
              </div>
              <div className="flex flex-col gap-1 mt-2">
                <div className="flex items-center gap-2 text-zinc-400 text-sm">
                  <Clock size={13} className="text-green-400" />
                  <span className="capitalize">{fechaFormateada} — {evento.hora.slice(0, 5)}</span>
                </div>
                <div className="flex items-center gap-2 text-zinc-400 text-sm">
                  <MapPin size={13} className="text-green-400" />
                  <span>{evento.lugar}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Link para compartir */}
          <div className="mt-4 flex gap-2">
            <button
              onClick={copyLink}
              className="flex-1 flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-zinc-300 transition-colors"
            >
              <Copy size={14} />
              Copiar link para jugadores
            </button>
            <a
              href={`/evento/${id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-xl px-3 py-2.5 text-zinc-400"
            >
              <ExternalLink size={14} />
            </a>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-center">
            <div className="flex items-center justify-center gap-1 text-green-400 mb-1">
              <Users size={16} />
            </div>
            <p className="text-2xl font-bold">{confirmados}/{evento.cupo_maximo}</p>
            <p className="text-zinc-500 text-xs mt-1">Confirmados</p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-center">
            <div className="flex items-center justify-center gap-1 text-green-400 mb-1">
              <CheckCircle size={16} />
            </div>
            <p className="text-2xl font-bold">{pagados}</p>
            <p className="text-zinc-500 text-xs mt-1">Pagaron</p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-center">
            <div className="flex items-center justify-center gap-1 text-green-400 mb-1">
              <DollarSign size={16} />
            </div>
            <p className="text-2xl font-bold">S/ {totalRecaudado}</p>
            <p className="text-zinc-500 text-xs mt-1">Recaudado</p>
          </div>
        </div>

        {/* Lista de jugadores */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-zinc-300">
              Jugadores
              {pendientes > 0 && (
                <span className="ml-2 text-yellow-400 text-sm font-normal">· {pendientes} pendiente{pendientes > 1 ? 's' : ''}</span>
              )}
            </h2>
            {jugadores.length > 0 && (
              <button
                onClick={handleLimpiarJugadores}
                className="text-xs text-zinc-600 hover:text-red-400 transition-colors"
              >
                Limpiar lista
              </button>
            )}
          </div>

          {jugadores.length === 0 ? (
            <p className="text-zinc-600 text-sm">Nadie se ha anotado aún. Comparte el link.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {jugadores.map((j, i) => (
                <div key={j.id} className="flex items-center justify-between gap-3 py-2 border-b border-zinc-800 last:border-0">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-zinc-500 text-sm w-5 shrink-0">{i + 1}.</span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-white truncate">{j.nombre}</p>
                      <p className="text-xs text-zinc-500">{j.whatsapp}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {j.captura_url && (
                      <button
                        onClick={() => setCapturaAbierta(j.captura_url!)}
                        className="text-xs text-blue-400 hover:text-blue-300 underline"
                      >
                        Ver pago
                      </button>
                    )}
                    <button
                      onClick={() => handleMarcarPagado(j)}
                      className="shrink-0"
                    >
                      {j.pagado ? (
                        <Badge className="bg-green-600 text-white text-xs cursor-pointer hover:bg-green-700">
                          ✓ Pagó
                        </Badge>
                      ) : evento.costo_por_persona === 0 ? (
                        <Badge className="bg-green-600 text-white text-xs cursor-pointer hover:bg-green-700">
                          ✓ Anotado
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-zinc-500 border-zinc-600 text-xs cursor-pointer hover:border-green-500 hover:text-green-400">
                          Pendiente
                        </Badge>
                      )}
                    </button>
                    <button
                      onClick={() => handleEliminarJugador(j.id)}
                      className="text-zinc-600 hover:text-red-400 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Modal captura */}
      {capturaAbierta && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={() => setCapturaAbierta(null)}
        >
          <div className="max-w-sm w-full" onClick={e => e.stopPropagation()}>
            <img
              src={capturaAbierta}
              alt="Captura de pago"
              className="w-full rounded-2xl"
            />
            <button
              onClick={() => setCapturaAbierta(null)}
              className="w-full mt-3 text-zinc-400 hover:text-white text-sm"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </main>
  )
}
