'use client'

import { useCallback, useState, useRef } from 'react'
import { parseFiles } from '@/lib/parser'
import { ParsedPage } from '@/lib/types'
import styles from './UploadScreen.module.css'

interface Props {
  onFilesLoaded: (pages: ParsedPage[]) => void
}

export default function UploadScreen({ onFilesLoaded }: Props) {
  const [dragging, setDragging] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fileCount, setFileCount] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const processFiles = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return
    setLoading(true)
    setError(null)

    try {
      const mdFiles: { filename: string; content: string }[] = []

      for (const file of Array.from(files)) {
        if (!file.name.endsWith('.md')) continue
        const content = await file.text()
        mdFiles.push({ filename: file.name, content })
      }

      if (mdFiles.length === 0) {
        setError('No .md files found. Please select Markdown files from your pipeline output.')
        setLoading(false)
        return
      }

      setFileCount(mdFiles.length)

      // Small delay for visual feedback
      await new Promise(r => setTimeout(r, 400))

      const pages = parseFiles(mdFiles)
      onFilesLoaded(pages)
    } catch (err) {
      setError('Failed to read files. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [onFilesLoaded])

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragging(true)
  }, [])

  const onDragLeave = useCallback(() => setDragging(false), [])

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    processFiles(e.dataTransfer.files)
  }, [processFiles])

  const onInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    processFiles(e.target.files)
  }, [processFiles])

  return (
    <div className={styles.root}>
      {/* Background pattern */}
      <div className={styles.bgPattern} aria-hidden />

      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.logo}>
            <span className={styles.logoMark}>✦</span>
            <span className={styles.logoText}>IGCSE Book Editor</span>
          </div>
          <p className={styles.tagline}>Professional editorial tool for teachers &amp; content teams</p>
        </div>

        {/* Upload card */}
        <div
          className={`${styles.card} ${dragging ? styles.dragging : ''} ${loading ? styles.loading : ''}`}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onClick={() => !loading && inputRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={e => e.key === 'Enter' && inputRef.current?.click()}
          aria-label="Upload markdown files"
        >
          <input
            ref={inputRef}
            type="file"
            accept=".md"
            multiple
            onChange={onInputChange}
            className={styles.hiddenInput}
          />

          {loading ? (
            <div className={styles.loadingState}>
              <div className={styles.spinner} />
              <p className={styles.loadingText}>Parsing {fileCount} file{fileCount !== 1 ? 's' : ''}…</p>
            </div>
          ) : (
            <>
              <div className={styles.uploadIcon} aria-hidden>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                  <path d="M12 16V8M12 8l-3 3M12 8l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M3 15v1a5 5 0 005 5h8a5 5 0 005-5v-1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
              <h2 className={styles.cardTitle}>
                {dragging ? 'Drop your files here' : 'Upload pipeline output files'}
              </h2>
              <p className={styles.cardSubtitle}>
                Select all <code className={styles.code}>page-NNN.md</code> files from your{' '}
                <code className={styles.code}>pages/</code> directory
              </p>
              <div className={styles.divider}>
                <span>or</span>
              </div>
              <button
                className={styles.browseBtn}
                onClick={e => { e.stopPropagation(); inputRef.current?.click() }}
                type="button"
              >
                Browse Files
              </button>
              <p className={styles.hint}>Supports multiple .md files · Client-side only · No data uploaded</p>
            </>
          )}
        </div>

        {error && (
          <div className={styles.error} role="alert">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            {error}
          </div>
        )}

        {/* Feature pills */}
        <div className={styles.features}>
          {[
            { icon: '✏️', label: 'Visual Block Editor' },
            { icon: '🖼️', label: 'Image Upload' },
            { icon: '📄', label: 'Print-Ready PDF' },
            { icon: '💾', label: 'Save as .md' },
          ].map(f => (
            <div key={f.label} className={styles.pill}>
              <span>{f.icon}</span>
              <span>{f.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
