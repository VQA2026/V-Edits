import React, { useEffect, useRef } from 'react'
import { Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react'
import { useStore } from '../store'

const fmt = (t) => {
  const m = Math.floor(t / 60)
  const s = Math.floor(t % 60)
  const f = Math.floor((t % 1) * 30)
  return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}:${String(f).padStart(2,'0')}`
}

export default function PreviewPanel() {
  const { isPlaying, currentTime, duration, playbackRate, togglePlay, setCurrentTime } = useStore()
  const rafRef = useRef(null)
  const lastRef = useRef(null)

  useEffect(() => {
    if (isPlaying) {
      lastRef.current = performance.now()
      const tick = (now) => {
        const dt = (now - lastRef.current) / 1000
        lastRef.current = now
        setCurrentTime(useStore.getState().currentTime + dt * useStore.getState().playbackRate)
        if (useStore.getState().currentTime >= useStore.getState().duration) {
          useStore.getState().togglePlay()
          useStore.getState().setCurrentTime(0)
          return
        }
        rafRef.current = requestAnimationFrame(tick)
      }
      rafRef.current = requestAnimationFrame(tick)
    } else {
      cancelAnimationFrame(rafRef.current)
    }
    return () => cancelAnimationFrame(rafRef.current)
  }, [isPlaying])

  const progress = duration > 0 ? currentTime / duration : 0

  const activeClips = useStore.getState().clips?.filter(c =>
    currentTime >= c.start && currentTime <= c.start + c.duration
  ) || []

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#0d0d0d' }}>
      {/* Screen */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{
          width: '85%', aspectRatio: '16/9', background: '#050505',
          border: '1px solid #222', borderRadius: 4, position: 'relative',
          display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
        }}>
          {/* Fake video content */}
          <div style={{
            position: 'absolute', inset: 0,
            background: `linear-gradient(135deg, #0a0f1e ${100 - progress*100}%, #1a2a4a ${100 - progress*100}%, #0d1a30)`,
            transition: 'background 0.1s',
          }} />
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 8 }}>
            {/* Waveform visualizer */}
            <svg width="200" height="40" viewBox="0 0 200 40">
              {Array.from({length: 40}).map((_,i) => {
                const h = 4 + Math.abs(Math.sin((i + currentTime*8) * 0.6)) * 28
                const active = i / 40 < progress
                return (
                  <rect key={i} x={i*5} y={(40-h)/2} width={3} height={h}
                    fill={active ? '#4f8ef7' : '#1a2a3a'} rx={1} />
                )
              })}
            </svg>
            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, color: '#2a3a50', letterSpacing: 2 }}>
              {activeClips.length > 0 ? activeClips[0].label : 'NO SIGNAL'}
            </div>
          </div>
          {/* Corner HUD */}
          <div style={{ position: 'absolute', top: 8, left: 10, fontFamily: 'DM Mono, monospace', fontSize: 9, color: '#3a4a5a' }}>REC</div>
          <div style={{ position: 'absolute', top: 8, right: 10, fontFamily: 'DM Mono, monospace', fontSize: 9, color: '#3a4a5a' }}>1920×1080</div>
          <div style={{ position: 'absolute', bottom: 8, right: 10, fontFamily: 'DM Mono, monospace', fontSize: 9, color: '#4f8ef7' }}>{fmt(currentTime)}</div>
        </div>
      </div>

      {/* Controls */}
      <div style={{ borderTop: '1px solid #1a1a1a', padding: '10px 16px', background: '#111' }}>
        {/* Progress bar */}
        <div
          style={{ height: 3, background: '#222', borderRadius: 2, cursor: 'pointer', marginBottom: 10, position: 'relative' }}
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect()
            setCurrentTime(((e.clientX - rect.left) / rect.width) * duration)
          }}
        >
          <div style={{ height: '100%', width: `${progress * 100}%`, background: '#4f8ef7', borderRadius: 2 }} />
          <div style={{
            position: 'absolute', top: -3, left: `${progress*100}%`,
            width: 9, height: 9, borderRadius: '50%', background: '#4f8ef7',
            transform: 'translateX(-50%)', boxShadow: '0 0 0 2px #0d0d0d',
          }} />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button style={btnStyle} onClick={() => setCurrentTime(0)}><SkipBack size={14}/></button>
          <button style={{ ...btnStyle, background: '#4f8ef7', color: '#fff', width: 32, height: 32, borderRadius: '50%' }} onClick={togglePlay}>
            {isPlaying ? <Pause size={14} fill="#fff"/> : <Play size={14} fill="#fff"/>}
          </button>
          <button style={btnStyle} onClick={() => setCurrentTime(duration)}><SkipForward size={14}/></button>
          <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, color: '#888', marginLeft: 4 }}>
            {fmt(currentTime)} / {fmt(duration)}
          </div>
          <div style={{ flex: 1 }} />
          <Volume2 size={13} color="#555" />
          <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 10, color: '#555' }}>100%</div>
        </div>
      </div>
    </div>
  )
}

const btnStyle = {
  background: '#1a1a1a', border: '1px solid #2a2a2a', color: '#888',
  borderRadius: 6, width: 28, height: 28, display: 'flex', alignItems: 'center',
  justifyContent: 'center', cursor: 'pointer',
}
