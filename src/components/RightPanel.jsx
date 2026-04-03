import React from 'react'
import { Sliders, Film, Music, Type, Zap, FileVideo, Download } from 'lucide-react'
import { useStore } from '../store'

const PANELS = [
  { id: 'inspector', icon: Sliders, label: 'Inspector' },
  { id: 'media', icon: Film, label: 'Media' },
  { id: 'effects', icon: Zap, label: 'Effects' },
  { id: 'export', icon: Download, label: 'Export' },
]

const EFFECTS = ['Blur', 'Sharpen', 'Brightness', 'Contrast', 'Saturation', 'Sepia', 'Grayscale', 'Vignette', 'Film Grain', 'Glow']
const MEDIA_ITEMS = [
  { label: 'intro_clip.mp4', type: 'video', dur: '0:12' },
  { label: 'main_footage.mp4', type: 'video', dur: '1:04' },
  { label: 'background.mp3', type: 'audio', dur: '3:22' },
  { label: 'sfx_whoosh.wav', type: 'audio', dur: '0:02' },
  { label: 'logo.png', type: 'image', dur: '' },
]

export default function RightPanel() {
  const { activePanel, setActivePanel, selectedClipId, clips, updateClip } = useStore()
  const clip = clips.find(c => c.id === selectedClipId)

  return (
    <div style={{ width: 240, display: 'flex', flexDirection: 'column', borderLeft: '1px solid #1a1a1a', background: '#0f0f0f', flexShrink: 0 }}>
      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid #1a1a1a', flexShrink: 0 }}>
        {PANELS.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            style={{
              flex: 1, background: 'transparent', border: 'none',
              borderBottom: activePanel === id ? '2px solid #4f8ef7' : '2px solid transparent',
              color: activePanel === id ? '#4f8ef7' : '#555',
              cursor: 'pointer', padding: '8px 4px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
            }}
            onClick={() => setActivePanel(id)}
            title={label}
          >
            <Icon size={14} />
            <span style={{ fontSize: 8, fontFamily: 'Inter, sans-serif' }}>{label}</span>
          </button>
        ))}
      </div>

      {/* Panel body */}
      <div style={{ flex: 1, overflowY: 'auto', padding: 12 }}>
        {activePanel === 'inspector' && (
          <div>
            <div style={sectionTitle}>CLIP PROPERTIES</div>
            {clip ? (
              <>
                <Field label="Label">
                  <input
                    style={inputStyle}
                    value={clip.label}
                    onChange={e => updateClip(clip.id, { label: e.target.value })}
                  />
                </Field>
                <Field label="Start (s)">
                  <input type="number" style={inputStyle} value={clip.start} step={0.1}
                    onChange={e => updateClip(clip.id, { start: parseFloat(e.target.value) || 0 })} />
                </Field>
                <Field label="Duration (s)">
                  <input type="number" style={inputStyle} value={clip.duration} step={0.1}
                    onChange={e => updateClip(clip.id, { duration: parseFloat(e.target.value) || 0.1 })} />
                </Field>
                <Field label="Type">
                  <div style={{ fontSize: 11, color: '#4f8ef7', fontFamily: 'DM Mono, monospace', background: '#0a0f1e', padding: '4px 8px', borderRadius: 4 }}>{clip.type}</div>
                </Field>
                <div style={{ marginTop: 16, borderTop: '1px solid #1e1e1e', paddingTop: 12 }}>
                  <div style={sectionTitle}>TRANSFORM</div>
                  {['Scale', 'Rotation', 'Opacity'].map(prop => (
                    <Field key={prop} label={prop}>
                      <input type="range" min={0} max={100} defaultValue={prop === 'Opacity' ? 100 : 0}
                        style={{ width: '100%', accentColor: '#4f8ef7' }} />
                    </Field>
                  ))}
                </div>
              </>
            ) : (
              <div style={{ fontSize: 11, color: '#444', fontFamily: 'Inter, sans-serif', padding: '12px 0', lineHeight: 1.6 }}>
                Select a clip on the timeline to view and edit its properties.
              </div>
            )}
          </div>
        )}

        {activePanel === 'media' && (
          <div>
            <div style={sectionTitle}>MEDIA LIBRARY</div>
            {MEDIA_ITEMS.map((item) => (
              <div key={item.label} style={{
                display: 'flex', alignItems: 'center', gap: 8, padding: '6px 8px',
                borderRadius: 4, marginBottom: 2, cursor: 'pointer',
                border: '1px solid transparent',
              }}
                onMouseEnter={e => e.currentTarget.style.background = '#1a1a1a'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <div style={{ width: 28, height: 20, background: '#1a2540', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {item.type === 'video' ? <Film size={10} color="#4f8ef7" /> : item.type === 'audio' ? <Music size={10} color="#f7a14f" /> : <FileVideo size={10} color="#a14ff7" />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 10, fontFamily: 'Inter, sans-serif', color: '#ccc', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.label}</div>
                  {item.dur && <div style={{ fontSize: 9, color: '#555', fontFamily: 'DM Mono, monospace' }}>{item.dur}</div>}
                </div>
              </div>
            ))}
            <button style={{ marginTop: 12, width: '100%', background: '#1a1a1a', border: '1px dashed #2a2a2a', borderRadius: 5, padding: '8px', color: '#555', fontSize: 11, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
              + Import Media
            </button>
          </div>
        )}

        {activePanel === 'effects' && (
          <div>
            <div style={sectionTitle}>VIDEO EFFECTS</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
              {EFFECTS.map(fx => (
                <button key={fx} style={{
                  background: '#141414', border: '1px solid #2a2a2a', borderRadius: 4,
                  padding: '4px 8px', fontSize: 10, color: '#888', cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#4f8ef7'; e.currentTarget.style.color = '#4f8ef7' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#2a2a2a'; e.currentTarget.style.color = '#888' }}
                >
                  {fx}
                </button>
              ))}
            </div>
            <div style={sectionTitle}>COLOR GRADING</div>
            {['Temperature', 'Tint', 'Exposure', 'Highlights', 'Shadows'].map(p => (
              <Field key={p} label={p}>
                <input type="range" min={-100} max={100} defaultValue={0} style={{ width: '100%', accentColor: '#4f8ef7' }} />
              </Field>
            ))}
          </div>
        )}

        {activePanel === 'export' && (
          <div>
            <div style={sectionTitle}>EXPORT SETTINGS</div>
            <Field label="Format">
              <select style={{ ...inputStyle, cursor: 'pointer' }}>
                <option>MP4 (H.264)</option>
                <option>MOV (ProRes)</option>
                <option>WebM (VP9)</option>
                <option>GIF</option>
              </select>
            </Field>
            <Field label="Resolution">
              <select style={{ ...inputStyle, cursor: 'pointer' }}>
                <option>1920×1080 (1080p)</option>
                <option>3840×2160 (4K)</option>
                <option>1280×720 (720p)</option>
                <option>720×1280 (Vertical)</option>
              </select>
            </Field>
            <Field label="Frame Rate">
              <select style={{ ...inputStyle, cursor: 'pointer' }}>
                <option>30 fps</option>
                <option>24 fps</option>
                <option>60 fps</option>
              </select>
            </Field>
            <Field label="Bitrate">
              <input type="range" min={1} max={50} defaultValue={10} style={{ width: '100%', accentColor: '#4f8ef7' }} />
            </Field>
            <button style={{ marginTop: 16, width: '100%', background: '#4f8ef7', border: 'none', borderRadius: 5, padding: '10px', color: '#fff', fontSize: 12, cursor: 'pointer', fontFamily: 'Syne, sans-serif', fontWeight: 700, letterSpacing: 1 }}>
              EXPORT VIDEO
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 8 }}>
      <div style={{ fontSize: 9, fontFamily: 'DM Mono, monospace', color: '#555', marginBottom: 3, textTransform: 'uppercase' }}>{label}</div>
      {children}
    </div>
  )
}

const inputStyle = {
  width: '100%', background: '#141414', border: '1px solid #2a2a2a',
  borderRadius: 4, padding: '4px 8px', color: '#ccc', fontSize: 11,
  fontFamily: 'Inter, sans-serif', outline: 'none',
}

const sectionTitle = {
  fontSize: 9, fontFamily: 'DM Mono, monospace', color: '#444',
  letterSpacing: 1, marginBottom: 8, paddingBottom: 4,
  borderBottom: '1px solid #1a1a1a',
}
