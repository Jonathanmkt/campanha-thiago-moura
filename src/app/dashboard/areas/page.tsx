'use client'

import React from 'react'
import { AreaMapContent } from './components/AreaMapContent'

export default function AreasPage() {
  return (
    <div 
      className="h-[calc(100vh-4rem)] w-full" 
      style={{ 
        minHeight: '600px',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <AreaMapContent />
    </div>
  )
}
