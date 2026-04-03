import React from 'react'
import { Lock, Volume2, VolumeX, Trash2, Plus } from 'lucide-react'
import { useStore, TRACK_COLORS } from '../store'

const TRACK_ICONS = { video: '▶', audio: '♪', text: 'T', effect: '✦' }

export default function TrackHeaders({ tracks, trackHeight }) {
  const { updateTrack, removeTrack, addTrack } = useStore()

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: 180, flexShrink: 0, borderRight: '1px solid #1e1e1e' }}>
      {tracks.map((track) => (
        <div key={track.id} style={{
          height: trackHeight,
          borderBottom: '1px solid #1a1a1a',
          padding: '0 10px',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          background: '#0f0f0f',
        }}>
          <div style={{
            width: 6, height: '60%', borderRadius: 2,
            background: TRACK_COLORS[track.type] || '#555',
            opacity: 0.8,
          }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 11, fontFamily: 'Syne, sans-serif', fontWeight: 600, color: '#ddd', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {track.label}
            </div>
            <div style={{ fontSize: 9, color: '#555', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase' }}>{track.type}</div>
          </div>
          <button
            style={iconBtn}
            onClick={() => updateTrack(track.id, { muted: !track.muted })}
            title={track.muted ? 'Unmute' : 'Mute'}
          >
            {track.muted ? <VolumeX size={11} color="#f7a14f" /> : <Volume2 size={11} />}
          </button>
          <button
            style={iconBtn}
            onClick={() => updateTrack(track.id, { locked: !track.locked })}
            title={track.locked ? 'Unlock' : 'Lock'}
          >
            <Lock size={11} color={track.locked ? '#f7a14f' : undefined} />
          </button>
          <button style={iconBtn} onClick={() => removeTrack(track.id)} title="Remove track">
            <Trash2 size={11} color="#663" />
          </button>
        </div>
      ))}
      {/* Add track button */}
      <div style={{ height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', borderTop: '1px solid #1a1a1a' }}>
        <button
          style={{ ...iconBtn, gap: 4, fontSize: 10, fontFamily: 'Inter, sans-serif', color: '#555', padding: '4px 10px' }}
          onClick={() => addTrack('video')}
        >
          <Plus size={10} /> Add Track
        </button>
      </div>
    </div>
  )
}

const iconBtn = {
  background: 'transparent',
  border: 'none',
  color: '#555',
  cursor: 'pointer',
  padding: 3,
  borderRadius: 3,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}
