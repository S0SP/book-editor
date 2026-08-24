'use client'

import { useState, useCallback } from 'react'
import { ParsedPage, SelectedBlock } from '@/lib/types'
import { updateBlockInContent } from '@/lib/parser'
import Toolbar from './Toolbar'
import PageList from './PageList'
import PageCanvas from './PageCanvas'
import EditPanel from './EditPanel/index'
import styles from './EditorApp.module.css'

interface Props {
  pages: ParsedPage[]
  setPages: React.Dispatch<React.SetStateAction<ParsedPage[]>>
  onBack: () => void
}

export default function EditorApp({ pages, setPages, onBack }: Props) {
  const [currentIdx, setCurrentIdx] = useState(0)
  const [selectedBlock, setSelectedBlock] = useState<SelectedBlock | null>(null)
  const [zoom, setZoom] = useState(0.72)

  const currentPage = pages[currentIdx]

  const handleBlockSelect = useCallback((block: SelectedBlock) => {
    setSelectedBlock(block)
  }, [])

  const handleDeselect = useCallback(() => {
    setSelectedBlock(null)
  }, [])

  const handleBlockUpdated = useCallback((blockId: string, newOuterHTML: string) => {
    setPages(prev => {
      const next = [...prev]
      const updated = { ...next[currentIdx] }
      updated.content = updateBlockInContent(updated.content, blockId, newOuterHTML)
      updated.isDirty = true
      next[currentIdx] = updated
      return next
    })
    // Update selected block state to reflect new HTML
    setSelectedBlock(prev => prev && prev.blockId === blockId
      ? { ...prev, outerHTML: newOuterHTML }
      : prev
    )
  }, [currentIdx, setPages])

  const handlePageUpdated = useCallback((newHtml: string) => {
    setPages(prev => {
      const next = [...prev]
      const updated = { ...next[currentIdx] }
      updated.content = newHtml
      updated.isDirty = true
      next[currentIdx] = updated
      return next
    })
  }, [currentIdx, setPages])

  const handleNavigate = useCallback((idx: number) => {
    setCurrentIdx(idx)
    setSelectedBlock(null)
  }, [])

  const handleAddFiles = useCallback((newPages: ParsedPage[]) => {
    setPages(prev => {
      // Filter out files that might have been re-uploaded, or just append
      // To be safe, let's append new ones, maybe preventing duplicate filenames if needed
      // Actually, standard behavior is to append and sort by pageNum
      const combined = [...prev]
      
      newPages.forEach(np => {
        const existingIdx = combined.findIndex(p => p.filename === np.filename)
        if (existingIdx >= 0) {
          // Replace existing if re-uploaded
          combined[existingIdx] = np
        } else {
          combined.push(np)
        }
      })
      
      return combined.sort((a, b) => a.pageNum - b.pageNum)
    })
  }, [setPages])

  return (
    <div className={styles.root}>
      <Toolbar
        pages={pages}
        currentIdx={currentIdx}
        zoom={zoom}
        onZoomChange={setZoom}
        onBack={onBack}
        onNavigate={handleNavigate}
      />

      <div className={styles.body}>
        {/* Left: page list */}
        <aside className={styles.sidebar}>
          <PageList
            pages={pages}
            currentIdx={currentIdx}
            onSelect={handleNavigate}
            onAddFiles={handleAddFiles}
          />
        </aside>

        {/* Centre: A4 preview */}
        <main className={styles.canvas} onClick={handleDeselect}>
          {currentPage && (
            <PageCanvas
              key={currentIdx}
              content={currentPage.content}
              zoom={zoom}
              onBlockSelect={handleBlockSelect}
              onBlockUpdated={handleBlockUpdated}
              onPageUpdated={handlePageUpdated}
            />
          )}
        </main>

        {/* Right: edit panel */}
        <aside className={styles.panel}>
          <EditPanel
            selectedBlock={selectedBlock}
            onBlockUpdate={handleBlockUpdated}
          />
        </aside>
      </div>
    </div>
  )
}
