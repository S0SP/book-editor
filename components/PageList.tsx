'use client'

import { useRef, useCallback } from 'react'
import { ParsedPage } from '@/lib/types'
import { parseFiles } from '@/lib/parser'
import styles from './PageList.module.css'

interface Props {
  pages: ParsedPage[]
  currentIdx: number
  onSelect: (idx: number) => void
  onAddFiles?: (newPages: ParsedPage[]) => void
}

export default function PageList({ pages, currentIdx, onSelect, onAddFiles }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0 || !onAddFiles) return

    const mdFiles: { filename: string; content: string }[] = []
    for (const file of Array.from(files)) {
      if (!file.name.endsWith('.md')) continue
      const content = await file.text()
      mdFiles.push({ filename: file.name, content })
    }

    if (mdFiles.length > 0) {
      const newPages = parseFiles(mdFiles)
      onAddFiles(newPages)
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [onAddFiles])

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <div>
          <span className={styles.title}>Pages</span>
          <span className={styles.count} style={{marginLeft: '6px'}}>{pages.length}</span>
        </div>
        {onAddFiles && (
          <>
            <button className={styles.addFilesBtn} onClick={() => fileInputRef.current?.click()}>
              + Add Files
            </button>
            <input 
              type="file" 
              multiple 
              accept=".md" 
              ref={fileInputRef} 
              style={{ display: 'none' }} 
              onChange={handleFileChange}
            />
          </>
        )}
      </div>

      <nav className={styles.list}>
        {pages.map((page, idx) => (
          <button
            key={page.filename}
            className={`${styles.item} ${idx === currentIdx ? styles.active : ''}`}
            onClick={() => onSelect(idx)}
            title={page.filename}
          >
            <div className={styles.thumb}>
              <span className={styles.thumbNum}>{page.pageNum || idx + 1}</span>
            </div>
            <div className={styles.info}>
              <span className={styles.name}>{page.filename.replace('.md', '')}</span>
              {page.isDirty && <span className={styles.dirty} title="Unsaved">●</span>}
            </div>
          </button>
        ))}
      </nav>
    </div>
  )
}
