import React from 'react'
import TopBar from './components/TopBar'
import PreviewPanel from './components/PreviewPanel'
import Timeline from './components/Timeline'
import RightPanel from './components/RightPanel'

export default function App() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#0a0a0a', overflow: 'hidden' }}>
      {/* Top bar */}
      <TopBar />

      {/* Main workspace */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Center: Preview + Timeline stacked */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* Preview panel - top 40% */}
          <div style={{ height: '40%', borderBottom: '1px solid #1a1a1a', flexShrink: 0 }}>
            <PreviewPanel />
          </div>
          {/* Timeline - bottom 60% */}
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <Timeline />
          </div>
        </div>

        {/* Right panel */}
        <RightPanel />
      </div>
    </div>
  )
}
