'use client'

import { useState } from 'react'
import UploadScreen from '@/components/UploadScreen'
import EditorApp from '@/components/EditorApp'
import { ParsedPage } from '@/lib/types'

export default function Home() {
  const [pages, setPages] = useState<ParsedPage[]>([])
  const [mode, setMode] = useState<'upload' | 'editor'>('upload')

  const handleFilesLoaded = (loaded: ParsedPage[]) => {
    setPages(loaded)
    setMode('editor')
  }

  const handleBack = () => {
    setMode('upload')
    setPages([])
  }

  return mode === 'upload'
    ? <UploadScreen onFilesLoaded={handleFilesLoaded} />
    : <EditorApp pages={pages} setPages={setPages} onBack={handleBack} />
}
