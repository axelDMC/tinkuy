'use client'

import { motion } from 'motion/react'

const items = [
  { label: '⚽ Fútbol' },
  { label: '🏐 Vóley' },
  { label: '🏄 Surf' },
  { label: '🏀 Básquet' },
  { label: '🎾 Tenis' },
  { label: '🏊 Natación' },
  { label: '🥊 Boxeo' },
  { label: '🏃 Running' },
]

export function InfiniteSlider() {
  const doubled = [...items, ...items]

  return (
    <div className="overflow-hidden w-full" aria-hidden>
      <motion.div
        className="flex gap-6 whitespace-nowrap"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 18, ease: 'linear', repeat: Infinity }}
      >
        {doubled.map((item, i) => (
          <span
            key={i}
            className="flex-shrink-0 text-sm font-medium text-zinc-400 px-4 py-2 rounded-full border border-zinc-800 bg-zinc-900/60"
          >
            {item.label}
          </span>
        ))}
      </motion.div>
    </div>
  )
}
