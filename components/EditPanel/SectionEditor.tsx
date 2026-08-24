'use client'

import { useState, useEffect } from 'react'
import { SelectedBlock, SectionData } from '@/lib/types'
import { parseSection, serializeSection } from '@/lib/blockDetector'

interface Props {
  block: SelectedBlock
  onUpdate: (newOuterHTML: string) => void
}

export default function SectionEditor({ block, onUpdate }: Props) {
  const [data, setData] = useState<SectionData | null>(null)

  useEffect(() => {
    const parsed = parseSection(block.outerHTML)
    if (parsed) setData(parsed)
  }, [block.outerHTML])

  if (!data) return <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Parsing…</p>

  const set = (field: keyof SectionData, value: string) =>
    setData(prev => prev ? { ...prev, [field]: value } : prev)

  const handleApply = () => {
    if (!data) return
    onUpdate(serializeSection(data, block.blockId))
  }

  return (
    <div>
      <div className="field-group">
        <label className="field-label">Section Title</label>
        <input
          className="field-input"
          value={data.title}
          onChange={e => set('title', e.target.value)}
          placeholder="e.g. Multiple Choice Questions"
        />
      </div>

      <div className="field-group">
        <label className="field-label">Marks / Label</label>
        <input
          className="field-input"
          value={data.marks}
          onChange={e => set('marks', e.target.value)}
          placeholder="e.g. 20 marks"
        />
      </div>

      <button className="apply-btn" onClick={handleApply}>Apply Changes</button>
    </div>
  )
}
