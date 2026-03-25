export type Evento = {
  id: string
  organizador_id: string
  nombre: string | null
  deporte: string
  fecha: string
  hora: string
  lugar: string
  costo_por_persona: number
  cupo_maximo: number
  yape_numero: string | null
  yape_qr_url: string | null
  cuenta_bancaria: string | null
  activo: boolean
  created_at: string
}

export type Jugador = {
  id: string
  evento_id: string
  nombre: string
  whatsapp: string
  pagado: boolean
  captura_url: string | null
  created_at: string
}
