import React from 'react'

export default function TimelineRuler({ duration, zoom, scrollLeft, onSeek }) {
  const totalWidth = duration * zoom
  const step = zoom >= 80 ? 1 : zoom >= 40 ? 2 : 5
  const ticks = []

  for (let t = 0; t <= duration; t += step) {
    const x = t * zoom
    const m = Math.floor(t / 60)
    const s = t % 60
    const label = `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`
    ticks.push({ t, x, label, major: true })
    if (step >= 2) {
      for (let sub = t + step / 2; sub < t + step && sub <= duration; sub += step / 2) {
        ticks.push({ t: sub, x: sub * zoom, label: null, major: false })
      }
    }
  }

  return (
    <div
      style={{ height: 28, background: '#0c0c0c', borderBottom: '1px solid #1e1e1e', position: 'relative', overflow: 'hidden', cursor: 'crosshair', flexShrink: 0 }}
      onClick={(e) => {
        const rect = e.currentTarget.getBoundingClientRect()
        const x = e.clientX - rect.left + scrollLeft
        onSeek(x / zoom)
      }}
    >
      <div style={{ position: 'absolute', top: 0, left: 0, width: totalWidth + 200, height: '100%' }}>
        {ticks.map(({ t, x, label, major }) => (
          <div key={t} style={{ position: 'absolute', left: x, top: 0, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <div style={{ width: 1, height: major ? 10 : 5, background: major ? '#3a3a3a' : '#252525', marginTop: 'auto' }} />
            {label && (
              <div style={{ position: 'absolute', top: 4, left: 4, fontSize: 9, fontFamily: 'DM Mono, monospace', color: '#444', whiteSpace: 'nowrap' }}>
                {label}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
