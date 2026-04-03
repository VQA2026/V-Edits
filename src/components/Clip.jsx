import React, { useRef, useState, useCallback } from 'react'
import { useStore } from '../store'

export default function Clip({ clip, zoom, trackHeight, trackLocked }) {
  const { selectClip, selectedClipId, updateClip, removeClip } = useStore()
  const isSelected = selectedClipId === clip.id
  const ref = useRef(null)
  const [hovered, setHovered] = useState(false)

  const width = Math.max(clip.duration * zoom, 8)
  const left = clip.start * zoom

  const handleDrag = useCallback((e) => {
    if (trackLocked) return
    e.preventDefault()
    const startX = e.clientX
    const startTime = clip.start

    const onMove = (ev) => {
      const dx = ev.clientX - startX
      const newStart = Math.max(0, startTime + dx / zoom)
      updateClip(clip.id, { start: Math.round(newStart * 10) / 10 })
    }
    const onUp = () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }, [clip, zoom, trackLocked])

  const handleResizeRight = useCallback((e) => {
    if (trackLocked) return
    e.stopPropagation()
    e.preventDefault()
    const startX = e.clientX
    const startDur = clip.duration

    const onMove = (ev) => {
      const dx = ev.clientX - startX
      const newDur = Math.max(0.5, startDur + dx / zoom)
      updateClip(clip.id, { duration: Math.round(newDur * 10) / 10 })
    }
    const onUp = () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }, [clip, zoom, trackLocked])

  const handleResizeLeft = useCallback((e) => {
    if (trackLocked) return
    e.stopPropagation()
    e.preventDefault()
    const startX = e.clientX
    const startStart = clip.start
    const startDur = clip.duration

    const onMove = (ev) => {
      const dx = ev.clientX - startX
      const newStart = Math.max(0, startStart + dx / zoom)
      const newDur = Math.max(0.5, startDur - (newStart - startStart))
      updateClip(clip.id, { start: Math.round(newStart*10)/10, duration: Math.round(newDur*10)/10 })
    }
    const onUp = () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }, [clip, zoom, trackLocked])

  const alpha = isSelected ? 'cc' : hovered ? 'bb' : '99'
  const border = isSelected ? `2px solid ${clip.color}` : `1px solid ${clip.color}55`

  return (
    <div
      ref={ref}
      style={{
        position: 'absolute',
        left,
        top: 4,
        width,
        height: trackHeight - 8,
        background: `${clip.color}22`,
        border,
        borderRadius: 4,
        cursor: trackLocked ? 'not-allowed' : 'grab',
        userSelect: 'none',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        transition: 'border 0.1s',
        boxShadow: isSelected ? `0 0 0 1px ${clip.color}44` : 'none',
      }}
      onMouseDown={handleDrag}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={(e) => { e.stopPropagation(); selectClip(clip.id) }}
      onDoubleClick={(e) => { e.stopPropagation(); removeClip(clip.id) }}
    >
      {/* Waveform / pattern */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', opacity: 0.4 }}>
        {clip.type === 'audio' && (
          <svg width={width} height={trackHeight - 8} style={{ display: 'block' }}>
            {Array.from({ length: Math.floor(width / 4) }).map((_, i) => {
              const h = 2 + Math.abs(Math.sin(i * 0.7 + clip.start)) * (trackHeight * 0.5)
              return <rect key={i} x={i * 4} y={((trackHeight - 8) - h) / 2} width={3} height={h} fill={clip.color} rx={1} />
            })}
          </svg>
        )}
        {clip.type === 'video' && (
          <div style={{ display: 'flex', height: '100%', gap: 1 }}>
            {Array.from({ length: Math.max(1, Math.floor(width / 40)) }).map((_, i) => (
              <div key={i} style={{ flex: 1, background: `${clip.color}11`, border: `1px solid ${clip.color}22`, borderRadius: 2 }} />
            ))}
          </div>
        )}
      </div>

      {/* Label */}
      <div style={{ position: 'relative', padding: '0 8px', fontSize: 10, fontFamily: 'Inter, sans-serif', fontWeight: 500, color: clip.color, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%' }}>
        {clip.label}
      </div>

      {/* Resize handles */}
      <div
        style={{ position: 'absolute', left: 0, top: 0, width: 6, height: '100%', cursor: 'ew-resize', zIndex: 2 }}
        onMouseDown={handleResizeLeft}
      />
      <div
        style={{ position: 'absolute', right: 0, top: 0, width: 6, height: '100%', cursor: 'ew-resize', zIndex: 2 }}
        onMouseDown={handleResizeRight}
      />

      {/* Duration badge */}
      {(hovered || isSelected) && width > 60 && (
        <div style={{ position: 'absolute', right: 8, fontSize: 9, fontFamily: 'DM Mono, monospace', color: clip.color, opacity: 0.8 }}>
          {clip.duration.toFixed(1)}s
        </div>
      )}
    </div>
  )
}
