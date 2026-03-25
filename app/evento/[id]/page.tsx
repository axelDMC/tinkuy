'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import type { Evento, Jugador } from '@/lib/types'
import { MapPin, Clock, Users, DollarSign, CheckCircle, Upload, X } from 'lucide-react'

export default function EventoPage() {
  const { id } = useParams()
  const supabase = createClient()

  const [evento, setEvento] = useState<Evento | null>(null)
  const [jugadores, setJugadores] = useState<Jugador[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [inscrito, setInscrito] = useState<Jugador | null>(null)

  const [form, setForm] = useState({ nombre: '', whatsapp: '' })
  const [archivo, setArchivo] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    const [{ data: ev }, { data: jugs }] = await Promise.all([
      supabase.from('eventos').select('*').eq('id', id).single(),
      supabase.from('jugadores').select('*').eq('evento_id', id).order('created_at'),
    ])
    setEvento(ev)
    setJugadores(jugs || [])
    setLoading(false)
  }, [id])

  useEffect(() => { fetchData() }, [fetchData])

  useEffect(() => {
    const interval = setInterval(fetchData, 5000)
    return () => clearInterval(interval)
  }, [fetchData])

  async function handleInscribirse(e: React.FormEvent) {
    e.preventDefault()
    const requiereCaptura = evento && evento.costo_por_persona > 0
    if (requiereCaptura && !archivo) {
      toast.error('Debes subir tu captura de pago para anotarte')
      return
    }
    setSubmitting(true)

    // 1. Insertar jugador
    const { data: jugador, error } = await supabase
      .from('jugadores')
      .insert({ evento_id: id, nombre: form.nombre, whatsapp: form.whatsapp })
      .select()
      .single()

    if (error || !jugador) {
      toast.error('Error al inscribirse')
      setSubmitting(false)
      return
    }

    // 2. Si no hay costo, listo — inscripción sin captura
    if (!requiereCaptura || !archivo) {
      setInscrito(jugador)
      setJugadores(prev => [...prev, jugador])
      toast.success('¡Anotado! Ya estás en la lista ✅')
      setSubmitting(false)
      return
    }

    // 3. Subir captura
    const ext = archivo.name.split('.').pop()
    const path = `${id}/${jugador.id}.${ext}`

    const { error: uploadError } = await supabase.storage
      .from('capturas')
      .upload(path, archivo, { upsert: true })

    if (uploadError) {
      await supabase.from('jugadores').delete().eq('id', jugador.id)
      toast.error(`Error: ${uploadError.message}`)
      setSubmitting(false)
      return
    }

    const { data: urlData } = supabase.storage.from('capturas').getPublicUrl(path)

    // 4. Marcar como pagado con la URL de la captura
    await supabase
      .from('jugadores')
      .update({ pagado: true, captura_url: urlData.publicUrl })
      .eq('id', jugador.id)

    const jugadorFinal = { ...jugador, pagado: true, captura_url: urlData.publicUrl }
    setInscrito(jugadorFinal)
    setJugadores(prev => [...prev, jugadorFinal])
    toast.success('¡Anotado y pago confirmado! Ya estás en la lista ✅')
    setSubmitting(false)
  }

  if (loading) return (
    <main className="min-h-screen bg-black flex items-center justify-center">
      <p className="text-zinc-400">Cargando...</p>
    </main>
  )

  if (!evento) return (
    <main className="min-h-screen bg-black flex items-center justify-center">
      <p className="text-zinc-400">Evento no encontrado</p>
    </main>
  )

  const confirmados = jugadores.length
  const pagados = jugadores.filter(j => j.pagado).length
  const lleno = confirmados >= evento.cupo_maximo

  const fechaFormateada = new Date(evento.fecha + 'T12:00:00').toLocaleDateString('es-PE', {
    weekday: 'long', day: 'numeric', month: 'long'
  })

  return (
    <main className="min-h-screen bg-black px-4 py-8">
      <div className="max-w-lg mx-auto flex flex-col gap-5">

        {/* Header */}
        <div className="text-center">
          <span className="text-3xl">
            {evento.deporte === 'Fútbol' ? '⚽' :
             evento.deporte === 'Vóley' ? '🏐' :
             evento.deporte === 'Surf' ? '🏄' :
             evento.deporte === 'Básquet' ? '🏀' : '🏅'}
          </span>
          <h1 className="text-2xl font-bold mt-2">{evento.nombre || evento.deporte}</h1>
          {evento.nombre && <p className="text-zinc-500 text-sm mt-0.5">{evento.deporte}</p>}
        </div>

        {/* Info card */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex flex-col gap-3">
          <div className="flex items-center gap-3 text-zinc-300">
            <Clock size={16} className="text-green-400 shrink-0" />
            <span className="capitalize">{fechaFormateada} — {evento.hora.slice(0,5)}</span>
          </div>
          <div className="flex items-center gap-3 text-zinc-300">
            <MapPin size={16} className="text-green-400 shrink-0" />
            <span>{evento.lugar}</span>
          </div>
          <div className="flex items-center gap-3 text-zinc-300">
            <Users size={16} className="text-green-400 shrink-0" />
            <span>{confirmados}/{evento.cupo_maximo} confirmados</span>
            {lleno && <Badge className="bg-yellow-500 text-black text-xs">¡Lleno!</Badge>}
          </div>
          {evento.costo_por_persona > 0 && (
            <div className="flex items-center gap-3 text-zinc-300">
              <DollarSign size={16} className="text-green-400 shrink-0" />
              <span>S/ {evento.costo_por_persona} por persona</span>
            </div>
          )}
        </div>

        {/* Jugadores */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
          <h2 className="font-semibold mb-3 text-zinc-300">
            Confirmados ({confirmados}/{evento.cupo_maximo})
          </h2>
          {jugadores.length === 0 ? (
            <p className="text-zinc-600 text-sm">Nadie se ha anotado aún. ¡Sé el primero!</p>
          ) : (
            <div className="flex flex-col gap-2">
              {jugadores.map((j, i) => (
                <div key={j.id} className="flex items-center justify-between">
                  <span className="text-sm text-zinc-300">
                    {i + 1}. {j.nombre}
                  </span>
                  {j.pagado ? (
                    <Badge className="bg-green-600 text-white text-xs flex items-center gap-1">
                      <CheckCircle size={10} /> Pagó
                    </Badge>
                  ) : evento.costo_por_persona === 0 ? (
                    <Badge className="bg-green-600 text-white text-xs flex items-center gap-1">
                      <CheckCircle size={10} /> Anotado
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-zinc-500 border-zinc-700 text-xs">
                      Pendiente
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Inscripción o pago */}
        {!inscrito ? (
          !lleno ? (
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
              <h2 className="font-semibold mb-4">¿Vas? Anótate aquí</h2>
              <form onSubmit={handleInscribirse} className="flex flex-col gap-3">
                <div>
                  <Label className="text-zinc-400 text-sm mb-1 block">Tu nombre</Label>
                  <Input
                    value={form.nombre}
                    onChange={e => setForm({ ...form, nombre: e.target.value })}
                    placeholder="Carlos Ramos"
                    required
                    className="bg-zinc-800 border-zinc-700 text-white"
                  />
                </div>
                <div>
                  <Label className="text-zinc-400 text-sm mb-1 block">Tu WhatsApp</Label>
                  <Input
                    value={form.whatsapp}
                    onChange={e => setForm({ ...form, whatsapp: e.target.value.replace(/\D/g, '').slice(0, 9) })}
                    placeholder="987654321"
                    inputMode="numeric"
                    required
                    className="bg-zinc-800 border-zinc-700 text-white"
                  />
                  {form.whatsapp.length > 0 && form.whatsapp.length < 9 && (
                    <p className="text-red-400 text-xs mt-1">Debe tener 9 dígitos</p>
                  )}
                </div>
                {evento.costo_por_persona > 0 && (
                  <>
                    <div className="bg-zinc-800 rounded-xl p-4 text-sm text-zinc-300">
                      <p className="font-semibold text-white mb-2">Yapea / Plinea S/ {evento.costo_por_persona} a:</p>
                      {evento.yape_numero && <p>📱 {evento.yape_numero}</p>}
                      {evento.cuenta_bancaria && <p>🏦 {evento.cuenta_bancaria}</p>}
                    </div>
                    <div>
                      <Label className="text-zinc-400 text-sm mb-2 block">
                        <Upload size={14} className="inline mr-1" />
                        Captura de Yape / Plin
                      </Label>
                      {!preview ? (
                        <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-zinc-700 rounded-xl cursor-pointer hover:border-green-500 transition-colors bg-zinc-800/50">
                          <Upload size={20} className="text-zinc-500 mb-1" />
                          <span className="text-zinc-500 text-xs">Toca para seleccionar imagen</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={e => {
                              const file = e.target.files?.[0] || null
                              setArchivo(file)
                              if (file) setPreview(URL.createObjectURL(file))
                            }}
                          />
                        </label>
                      ) : (
                        <div className="relative w-full">
                          <img
                            src={preview}
                            alt="Vista previa"
                            className="w-full max-h-48 object-contain rounded-xl border border-zinc-700"
                          />
                          <button
                            type="button"
                            onClick={() => { setArchivo(null); setPreview(null) }}
                            className="absolute top-2 right-2 bg-black/70 hover:bg-red-600 rounded-full p-1 transition-colors"
                          >
                            <X size={14} className="text-white" />
                          </button>
                        </div>
                      )}
                    </div>
                  </>
                )}
                <Button
                  type="submit"
                  disabled={submitting || !form.nombre || form.whatsapp.length < 9 || (evento.costo_por_persona > 0 && !archivo)}
                  className="bg-green-500 hover:bg-green-400 text-black font-bold disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Subiendo...' : '¡Me apunto!'}
                </Button>
              </form>
            </div>
          ) : (
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 text-center">
              <p className="text-yellow-400 font-semibold">El evento está lleno</p>
            </div>
          )
        ) : (
          <>
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
              <div className="text-center">
                <CheckCircle size={40} className="text-green-400 mx-auto mb-3" />
                <p className="font-bold text-green-400 text-lg">¡Estás anotado!</p>
                <p className="text-zinc-400 text-sm mt-1">Tu pago fue confirmado. ¡Nos vemos en la cancha!</p>
              </div>
            </div>
            <p className="text-center text-zinc-600 text-xs px-4">
              ¿No puedes ir? Avísale al organizador del evento para que pueda liberar tu lugar.
            </p>
          </>
        )}

        <p className="text-center text-zinc-600 text-xs">
          Organizado con <span className="text-green-500">Tinkuy</span>
        </p>
      </div>
    </main>
  )
}
