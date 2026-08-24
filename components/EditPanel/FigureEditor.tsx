'use client'

import { useState, useEffect, useRef } from 'react'
import { SelectedBlock, FigureData } from '@/lib/types'
import { parseFigure, serializeFigureWithImage, serializeFigurePlaceholder } from '@/lib/blockDetector'
import styles from './FigureEditor.module.css'

interface Props {
  block: SelectedBlock
  onUpdate: (newOuterHTML: string) => void
}

export default function FigureEditor({ block, onUpdate }: Props) {
  const [data, setData] = useState<FigureData | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [dragging, setDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const parsed = parseFigure(block.outerHTML)
    if (parsed) {
      setData(parsed)
      if (parsed.imageSrc && !parsed.isPlaceholder) {
        setPreviewUrl(parsed.imageSrc)
      } else {
        setPreviewUrl(null)
      }
    }
  }, [block.outerHTML])

  if (!data) return <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Parsing…</p>

  const set = (field: keyof FigureData, value: string | boolean) =>
    setData(prev => prev ? { ...prev, [field]: value } : prev)

  const handleFile = (file: File) => {
    if (!file.type.match(/^image\//)) return
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
    setData(prev => prev ? { ...prev, isPlaceholder: false, imageSrc: url } : prev)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  const handleRemoveImage = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setPreviewUrl(null)
    setData(prev => prev ? { ...prev, isPlaceholder: true, imageSrc: undefined } : prev)
  }

  const handleApply = () => {
    if (!data) return
    let html: string
    if (!data.isPlaceholder && data.imageSrc) {
      html = serializeFigureWithImage(data, block.blockId, data.imageSrc)
    } else {
      html = serializeFigurePlaceholder(data, block.blockId)
    }
    onUpdate(html)
  }

  return (
    <div>
      {/* Image upload zone */}
      <div className="section-divider">Image</div>

      {previewUrl ? (
        <div className={styles.preview}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={previewUrl} alt="Figure preview" className={styles.previewImg} />
          <button className={styles.removeBtn} onClick={handleRemoveImage}>
            ✕ Remove image
          </button>
        </div>
      ) : (
        <div
          className={`${styles.dropZone} ${dragging ? styles.dragging : ''}`}
          onDragOver={e => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          role="button"
          tabIndex={0}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleInputChange}
          />
          <div className={styles.dropIcon}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.5"/>
              <circle cx="8.5" cy="9.5" r="1.5" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M3 15l5-4 4 3 3-2 6 4" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
            </svg>
          </div>
          <p className={styles.dropTitle}>{dragging ? 'Drop image here' : 'Upload diagram image'}</p>
          <p className={styles.dropHint}>PNG, JPG, SVG — click or drag</p>
        </div>
      )}

      {/* Caption */}
      <div className="section-divider">Details</div>

      <div className="field-group">
        <label className="field-label">Figure Caption</label>
        <input
          className="field-input"
          value={data.caption}
          onChange={e => set('caption', e.target.value)}
          placeholder="Fig. 1 — Caption text"
        />
      </div>

      {/* Label */}
      <div className="field-group">
        <label className="field-label">Placeholder Label</label>
        <input
          className="field-input"
          value={data.label}
          onChange={e => set('label', e.target.value)}
          placeholder="Diagram — Fig. 1"
        />
      </div>

      {/* Description */}
      <div className="field-group">
        <label className="field-label">Description / Alt Text</label>
        <textarea
          className="field-input"
          value={data.description}
          onChange={e => set('description', e.target.value)}
          rows={4}
          placeholder="Full diagram description: all labels, positions, shapes…"
        />
      </div>

      {/* Graph toggle */}
      <div className="field-group" style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <input
          type="checkbox"
          id="isGraph"
          checked={!!data.isGraph}
          onChange={e => set('isGraph', e.target.checked)}
          style={{ accentColor: 'var(--brand-green)', width: 16, height: 16, cursor: 'pointer' }}
        />
        <label htmlFor="isGraph" className="field-label" style={{ textTransform: 'none', letterSpacing: 0, cursor: 'pointer' }}>
          This is a graph (uses green placeholder)
        </label>
      </div>

      <button className="apply-btn" onClick={handleApply}>
        Apply Changes
      </button>
    </div>
  )
}
