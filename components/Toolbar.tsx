'use client'

import { ParsedPage } from '@/lib/types'
import { buildMdContent } from '@/lib/parser'
import { PIPELINE_CSS } from '@/lib/iframeContent'
import { sendToActiveIframe } from './PageCanvas'
import styles from './Toolbar.module.css'

interface Props {
  pages: ParsedPage[]
  currentIdx: number
  zoom: number
  onZoomChange: (z: number) => void
  onBack: () => void
  onNavigate: (idx: number) => void
}

const ZOOM_STEPS = [0.5, 0.6, 0.72, 0.85, 1.0]

export default function Toolbar({ pages, currentIdx, zoom, onZoomChange, onBack, onNavigate }: Props) {
  const current = pages[currentIdx]
  const dirtyCount = pages.filter(p => p.isDirty).length

  const handlePrint = () => {
    const win = window.open('', '_blank')
    if (!win) return

    win.document.write(`<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8"/>
<style>${PIPELINE_CSS}</style>
<style>@media print { * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; } .page { page-break-after: always; } body { margin: 0; } }</style>
</head>
<body>
${pages.map(p => p.content).join('\n')}
</body>
</html>`)
    win.document.close()
    setTimeout(() => win.print(), 600)
  }

  const handleDownloadPdf = () => {
    if (!current) return
    sendToActiveIframe({ 
      type: 'DOWNLOAD_PDF',
      filename: current.filename.replace('.md', '.pdf')
    })
  }

  const handleSaveAll = () => {
    pages.forEach(page => {
      if (!page.isDirty) return
      const content = buildMdContent(page)
      const blob = new Blob([content], { type: 'text/markdown' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = page.filename
      a.click()
      URL.revokeObjectURL(url)
    })
  }

  const handleSaveCurrent = () => {
    if (!current) return
    const content = buildMdContent(current)
    const blob = new Blob([content], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = current.filename
    a.click()
    URL.revokeObjectURL(url)
  }

  const cycleZoom = (dir: 1 | -1) => {
    const idx = ZOOM_STEPS.findIndex(z => Math.abs(z - zoom) < 0.01)
    const next = Math.max(0, Math.min(ZOOM_STEPS.length - 1, idx + dir))
    onZoomChange(ZOOM_STEPS[next])
  }

  return (
    <header className={styles.toolbar}>
      {/* Left */}
      <div className={styles.left}>
        <button className={styles.backBtn} onClick={onBack} title="Back to upload">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M20 12H4M4 12l7-7M4 12l7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back
        </button>

        <div className={styles.separator} />

        <div className={styles.logoMini}>
          <span className={styles.logoMark}>✦</span>
          <span className={styles.logoText}>IGCSE Editor</span>
        </div>
      </div>

      {/* Center: page nav */}
      <div className={styles.center}>
        <button
          className={styles.navBtn}
          onClick={() => currentIdx > 0 && onNavigate(currentIdx - 1)}
          disabled={currentIdx === 0}
          title="Previous page"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>

        <span className={styles.pageLabel}>
          {current ? current.filename : '—'}
          {current?.isDirty && <span className={styles.dirtyDot} title="Unsaved changes" />}
        </span>

        <button
          className={styles.navBtn}
          onClick={() => currentIdx < pages.length - 1 && onNavigate(currentIdx + 1)}
          disabled={currentIdx >= pages.length - 1}
          title="Next page"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>

        <span className={styles.pageCount}>{currentIdx + 1} / {pages.length}</span>
      </div>

      {/* Right */}
      <div className={styles.right}>
        {/* Zoom */}
        <div className={styles.zoomGroup}>
          <button className={styles.zoomBtn} onClick={() => cycleZoom(-1)} title="Zoom out">−</button>
          <span className={styles.zoomLabel}>{Math.round(zoom * 100)}%</span>
          <button className={styles.zoomBtn} onClick={() => cycleZoom(1)} title="Zoom in">+</button>
        </div>

        <div className={styles.separator} />

        {/* Save current */}
        <button className={styles.actionBtn} onClick={handleSaveCurrent} title="Download current page">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M12 4v12M12 16l-4-4M12 16l4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M4 20h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          Save
        </button>

        {/* Save all dirty */}
        {dirtyCount > 0 && (
          <button className={`${styles.actionBtn} ${styles.saveAll}`} onClick={handleSaveAll} title="Download all modified pages">
            Save all ({dirtyCount})
          </button>
        )}

        {/* Download PDF directly */}
        <button className={styles.actionBtn} onClick={handleDownloadPdf} title="Download as PDF directly">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M12 4v12M12 16l-4-4M12 16l4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M4 20h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          Download PDF
        </button>

        {/* Print (All) */}
        <button className={`${styles.actionBtn} ${styles.printBtn}`} onClick={handlePrint} title="Print all to PDF">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M6 9V4a1 1 0 011-1h10a1 1 0 011 1v5" stroke="currentColor" strokeWidth="1.5"/>
            <rect x="3" y="9" width="18" height="10" rx="2" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M7 19v-5h10v5" stroke="currentColor" strokeWidth="1.5"/>
            <circle cx="17" cy="13" r="1" fill="currentColor"/>
          </svg>
          Print All
        </button>
      </div>
    </header>
  )
}
