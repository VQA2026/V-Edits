import { create } from 'zustand'
import { v4 as uuid } from 'uuid'

const TRACK_COLORS = {
  video: '#4f8ef7',
  audio: '#f7a14f',
  text: '#a14ff7',
  effect: '#4ff7a1',
}

const DEFAULT_CLIPS = [
  { id: uuid(), trackId: 't1', type: 'video', label: 'Intro Shot', start: 0, duration: 4, color: '#4f8ef7', thumbnail: null },
  { id: uuid(), trackId: 't1', type: 'video', label: 'Main Scene', start: 4.5, duration: 6, color: '#4f8ef7', thumbnail: null },
  { id: uuid(), trackId: 't1', type: 'video', label: 'Cutaway', start: 11, duration: 3, color: '#4f8ef7', thumbnail: null },
  { id: uuid(), trackId: 't2', type: 'audio', label: 'Background Music', start: 0, duration: 14, color: '#f7a14f', thumbnail: null },
  { id: uuid(), trackId: 't2', type: 'audio', label: 'SFX Burst', start: 4.2, duration: 1.5, color: '#f7a14f', thumbnail: null },
  { id: uuid(), trackId: 't3', type: 'text', label: 'Title Card', start: 0.5, duration: 2, color: '#a14ff7', thumbnail: null },
  { id: uuid(), trackId: 't3', type: 'text', label: 'Lower Third', start: 5, duration: 3, color: '#a14ff7', thumbnail: null },
  { id: uuid(), trackId: 't4', type: 'effect', label: 'Color Grade', start: 0, duration: 14, color: '#4ff7a1', thumbnail: null },
]

const DEFAULT_TRACKS = [
  { id: 't1', label: 'Video 1', type: 'video', muted: false, locked: false, volume: 1 },
  { id: 't2', label: 'Audio 1', type: 'audio', muted: false, locked: false, volume: 0.8 },
  { id: 't3', label: 'Text', type: 'text', muted: false, locked: false, volume: 1 },
  { id: 't4', label: 'Effects', type: 'effect', muted: false, locked: false, volume: 1 },
]

export const useStore = create((set, get) => ({
  // --- Playback ---
  currentTime: 0,
  isPlaying: false,
  duration: 20,
  playbackRate: 1,

  // --- Timeline ---
  zoom: 60, // px per second
  tracks: DEFAULT_TRACKS,
  clips: DEFAULT_CLIPS,
  selectedClipId: null,
  selectedTrackId: null,

  // --- UI ---
  activePanel: 'inspector', // 'inspector' | 'media' | 'effects' | 'export'
  showGrid: true,
  snapEnabled: true,
  markerTime: null,

  // --- Actions: Playback ---
  setCurrentTime: (t) => set({ currentTime: Math.max(0, Math.min(t, get().duration)) }),
  togglePlay: () => set((s) => ({ isPlaying: !s.isPlaying })),
  setPlaybackRate: (r) => set({ playbackRate: r }),

  // --- Actions: Clips ---
  selectClip: (id) => set({ selectedClipId: id }),
  deselectAll: () => set({ selectedClipId: null, selectedTrackId: null }),

  addClip: (trackId, type, start = 0) => {
    const track = get().tracks.find((t) => t.id === trackId)
    const clip = {
      id: uuid(),
      trackId,
      type,
      label: `New ${type}`,
      start,
      duration: 3,
      color: TRACK_COLORS[type] || '#888',
    }
    set((s) => ({ clips: [...s.clips, clip], selectedClipId: clip.id }))
  },

  removeClip: (id) => set((s) => ({
    clips: s.clips.filter((c) => c.id !== id),
    selectedClipId: s.selectedClipId === id ? null : s.selectedClipId,
  })),

  updateClip: (id, patch) => set((s) => ({
    clips: s.clips.map((c) => c.id === id ? { ...c, ...patch } : c),
  })),

  splitClipAtPlayhead: () => {
    const { clips, currentTime, selectedClipId } = get()
    const clip = clips.find((c) => c.id === selectedClipId)
    if (!clip) return
    const relT = currentTime - clip.start
    if (relT <= 0 || relT >= clip.duration) return
    const a = { ...clip, duration: relT }
    const b = { ...clip, id: uuid(), start: currentTime, duration: clip.duration - relT }
    set((s) => ({ clips: s.clips.filter((c) => c.id !== clip.id).concat([a, b]) }))
  },

  // --- Actions: Tracks ---
  addTrack: (type) => {
    const track = { id: uuid(), label: `${type} ${get().tracks.filter(t=>t.type===type).length+1}`, type, muted: false, locked: false, volume: 1 }
    set((s) => ({ tracks: [...s.tracks, track] }))
  },

  removeTrack: (id) => set((s) => ({
    tracks: s.tracks.filter((t) => t.id !== id),
    clips: s.clips.filter((c) => c.trackId !== id),
  })),

  updateTrack: (id, patch) => set((s) => ({
    tracks: s.tracks.map((t) => t.id === id ? { ...t, ...patch } : t),
  })),

  // --- Actions: UI ---
  setActivePanel: (p) => set({ activePanel: p }),
  setZoom: (z) => set({ zoom: Math.max(20, Math.min(200, z)) }),
  toggleGrid: () => set((s) => ({ showGrid: !s.showGrid })),
  toggleSnap: () => set((s) => ({ snapEnabled: !s.snapEnabled })),
  setMarker: (t) => set({ markerTime: t }),
}))

export { TRACK_COLORS }
