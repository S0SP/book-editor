'use client'

import { useState, useEffect } from 'react'
import { SelectedBlock, ChapterData } from '@/lib/types'
import { parseChapter, serializeChapter } from '@/lib/blockDetector'

interface Props {
  block: SelectedBlock
  onUpdate: (newOuterHTML: string) => void
}

export default function ChapterEditor({ block, onUpdate }: Props) {
  const [data, setData] = useState<ChapterData | null>(null)

  useEffect(() => {
    const parsed = parseChapter(block.outerHTML)
    if (parsed) setData(parsed)
  }, [block.outerHTML])

  if (!data) return <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Parsing…</p>

  const set = (field: keyof ChapterData, value: string) =>
    setData(prev => prev ? { ...prev, [field]: value } : prev)

  const handleApply = () => {
    if (!data) return
    onUpdate(serializeChapter(data, block.blockId))
  }

  return (
    <div>
      <div className="field-group">
        <label className="field-label">Chapter Title</label>
        <input
          className="field-input"
          value={data.title}
          onChange={e => set('title', e.target.value)}
          placeholder="e.g. Cell Biology"
        />
      </div>

      <div className="field-group">
        <label className="field-label">Chapter Number</label>
        <input
          className="field-input"
          value={data.number}
          onChange={e => set('number', e.target.value)}
          placeholder="e.g. 21"
          style={{ fontFamily: 'monospace', fontWeight: 700 }}
        />
      </div>

      <button className="apply-btn" onClick={handleApply}>Apply Changes</button>
    </div>
  )
}
