import React, { useRef, useState, useCallback } from 'react'
import { ZoomIn, ZoomOut, Grid, Magnet } from 'lucide-react'
import { useStore } from '../store'
import TrackHeaders from './TrackHeaders'
import TimelineRuler from './TimelineRuler'
import Clip from './Clip'

const TRACK_HEIGHT = 56

export default function Timeline() {
  const { tracks, clips, currentTime, duration, zoom, setZoom, setCurrentTime, showGrid, toggleGrid, snapEnabled, toggleSnap, deselectAll } = useStore()
  const scrollRef = useRef(null)
  const [scrollLeft, setScrollLeft] = useState(0)

  const totalWidth = duration * zoom

  const handleScroll = (e) => setScrollLeft(e.target.scrollLeft)

  const handleSeek = useCallback((t) => {
    setCurrentTime(Math.max(0, Math.min(t, duration)))
  }, [duration])

  const playheadX = currentTime * zoom

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, background: '#0d0d0d', overflow: 'hidden' }}>
      {/* Timeline toolbar */}
      <div style={{ height: 36, borderBottom: '1px solid #1a1a1a', display: 'flex', alignItems: 'center', padding: '0 12px', gap: 8, flexShrink: 0 }}>
        <span style={{ fontSize: 10, fontFamily: 'DM Mono, monospace', color: '#444', marginRight: 4 }}>TIMELINE</span>
        <button style={tbBtn} onClick={() => setZoom(zoom - 10)} title="Zoom out"><ZoomOut size={13}/></button>
        <div style={{ fontSize: 9, fontFamily: 'DM Mono, monospace', color: '#555', minWidth: 32, textAlign: 'center' }}>{zoom}px/s</div>
        <button style={tbBtn} onClick={() => setZoom(zoom + 10)} title="Zoom in"><ZoomIn size={13}/></button>
        <div style={{ width: 1, height: 16, background: '#222', margin: '0 4px' }} />
        <button style={{ ...tbBtn, color: showGrid ? '#4f8ef7' : '#555' }} onClick={toggleGrid} title="Grid"><Grid size={13}/></button>
        <button style={{ ...tbBtn, color: snapEnabled ? '#4f8ef7' : '#555' }} onClick={toggleSnap} title="Snap"><Magnet size={13}/></button>
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: 9, fontFamily: 'DM Mono, monospace', color: '#333' }}>Double-click clip to delete • Drag edges to resize</span>
      </div>

      {/* Main timeline area */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Left: Track headers + ruler corner */}
        <div style={{ display: 'flex', flexDirection: 'column', flexShrink: 0, zIndex: 10 }}>
          {/* Ruler corner */}
          <div style={{ height: 28, width: 180, borderBottom: '1px solid #1e1e1e', borderRight: '1px solid #1e1e1e', background: '#0c0c0c', flexShrink: 0, display: 'flex', alignItems: 'center', padding: '0 10px' }}>
            <span style={{ fontSize: 9, fontFamily: 'DM Mono, monospace', color: '#333' }}>{tracks.length} TRACKS</span>
          </div>
          {/* Track headers scroll sync */}
          <div style={{ flex: 1, overflowY: 'hidden' }}>
            <TrackHeaders tracks={tracks} trackHeight={TRACK_HEIGHT} />
          </div>
        </div>

        {/* Right: Ruler + track lanes */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* Ruler */}
          <TimelineRuler duration={duration} zoom={zoom} scrollLeft={scrollLeft} onSeek={handleSeek} />

          {/* Scrollable lanes */}
          <div
            ref={scrollRef}
            style={{ flex: 1, overflowX: 'auto', overflowY: 'auto', position: 'relative' }}
            onScroll={handleScroll}
            onClick={() => deselectAll()}
          >
            <div style={{ width: totalWidth + 400, position: 'relative', minHeight: tracks.length * TRACK_HEIGHT + 40 }}>
              {/* Grid lines */}
              {showGrid && (
                <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
                  {Array.from({ length: Math.ceil(duration) + 1 }).map((_, i) => (
                    <line key={i} x1={i * zoom} y1={0} x2={i * zoom} y2="100%" stroke="#1a1a1a" strokeWidth={1} />
                  ))}
                  {tracks.map((_, i) => (
                    <line key={i} x1={0} y1={(i + 1) * TRACK_HEIGHT} x2="100%" y2={(i + 1) * TRACK_HEIGHT} stroke="#1a1a1a" strokeWidth={1} />
                  ))}
                </svg>
              )}

              {/* Track lanes */}
              {tracks.map((track, ti) => (
                <div key={track.id} style={{ position: 'absolute', left: 0, top: ti * TRACK_HEIGHT, width: '100%', height: TRACK_HEIGHT }}>
                  {clips.filter(c => c.trackId === track.id).map(clip => (
                    <Clip key={clip.id} clip={clip} zoom={zoom} trackHeight={TRACK_HEIGHT} trackLocked={track.locked} />
                  ))}
                </div>
              ))}

              {/* Playhead */}
              <div style={{ position: 'absolute', left: playheadX, top: 0, bottom: 0, width: 1, background: '#4f8ef7', pointerEvents: 'none', zIndex: 20 }}>
                <div style={{ position: 'absolute', top: -4, left: -5, width: 10, height: 10, background: '#4f8ef7', clipPath: 'polygon(50% 100%, 0 0, 100% 0)', transform: 'rotate(180deg)' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const tbBtn = {
  background: 'transparent',
  border: 'none',
  color: '#555',
  cursor: 'pointer',
  padding: '4px 5px',
  borderRadius: 4,
  display: 'flex',
  alignItems: 'center',
}
