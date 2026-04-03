import React from 'react'
import { Film, Undo2, Redo2, Save, Share2, Settings, Scissors, Zap } from 'lucide-react'
import { useStore } from '../store'

const s = {
  bar: {
    height: 48,
    background: '#111',
    borderBottom: '1px solid #222',
    display: 'flex',
    alignItems: 'center',
    padding: '0 16px',
    gap: 8,
    flexShrink: 0,
  },
  logo: {
    fontFamily: 'Syne, sans-serif',
    fontWeight: 800,
    fontSize: 20,
    letterSpacing: '-0.5px',
    color: '#fff',
    marginRight: 12,
    display: 'flex',
    alignItems: 'center',
    gap: 6,
  },
  accent: { color: '#4f8ef7' },
  divider: { width: 1, height: 24, background: '#2a2a2a', margin: '0 4px' },
  btn: {
    background: 'transparent',
    border: 'none',
    color: '#888',
    cursor: 'pointer',
    padding: '6px 8px',
    borderRadius: 6,
    display: 'flex',
    alignItems: 'center',
    gap: 5,
    fontSize: 12,
    fontFamily: 'Inter, sans-serif',
    transition: 'color 0.15s, background 0.15s',
  },
  btnHover: { color: '#f0f0f0', background: '#1e1e1e' },
  tag: {
    background: '#1a2540',
    color: '#4f8ef7',
    fontSize: 10,
    fontFamily: 'DM Mono, monospace',
    padding: '2px 7px',
    borderRadius: 4,
    border: '1px solid #2a3a60',
    marginLeft: 4,
  },
  spacer: { flex: 1 },
  saveBtn: {
    background: '#4f8ef7',
    color: '#fff',
    border: 'none',
    borderRadius: 6,
    padding: '6px 14px',
    fontSize: 12,
    fontFamily: 'Inter, sans-serif',
    fontWeight: 500,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: 6,
  },
}

function IconBtn({ icon: Icon, label, onClick }) {
  const [hov, setHov] = React.useState(false)
  return (
    <button
      style={{ ...s.btn, ...(hov ? s.btnHover : {}) }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={onClick}
      title={label}
    >
      <Icon size={15} />
      {label && <span>{label}</span>}
    </button>
  )
}

export default function TopBar() {
  const splitClip = useStore((s) => s.splitClipAtPlayhead)
  return (
    <div style={s.bar}>
      <div style={s.logo}>
        <Film size={18} strokeWidth={2.5} color="#4f8ef7" />
        <span>V<span style={s.accent}>Edit</span></span>
        <span style={s.tag}>v1.0</span>
      </div>
      <div style={s.divider} />
      <IconBtn icon={Undo2} label="Undo" />
      <IconBtn icon={Redo2} label="Redo" />
      <div style={s.divider} />
      <IconBtn icon={Scissors} label="Split" onClick={splitClip} />
      <IconBtn icon={Zap} label="Effects" />
      <div style={s.spacer} />
      <IconBtn icon={Share2} label="Export" />
      <IconBtn icon={Settings} />
      <button style={s.saveBtn}>
        <Save size={13} /> Save Project
      </button>
    </div>
  )
}
