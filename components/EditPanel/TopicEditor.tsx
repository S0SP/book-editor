'use client'

import { useState, useEffect } from 'react'
import { SelectedBlock, TopicData } from '@/lib/types'
import { parseTopic, serializeTopic } from '@/lib/blockDetector'

interface Props {
  block: SelectedBlock
  onUpdate: (newOuterHTML: string) => void
}

export default function TopicEditor({ block, onUpdate }: Props) {
  const [data, setData] = useState<TopicData | null>(null)

  useEffect(() => {
    const parsed = parseTopic(block.outerHTML)
    if (parsed) setData(parsed)
  }, [block.outerHTML])

  if (!data) return <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Parsing…</p>

  const set = (field: keyof TopicData, value: string) =>
    setData(prev => prev ? { ...prev, [field]: value } : prev)

  const handleApply = () => {
    if (!data) return
    onUpdate(serializeTopic(data, block.blockId))
  }

  return (
    <div>
      <div className="field-group">
        <label className="field-label">Topic Kicker (large number/label)</label>
        <input
          className="field-input"
          value={data.kicker}
          onChange={e => set('kicker', e.target.value)}
          placeholder="e.g. TOPIC-1"
          style={{ fontWeight: 700 }}
        />
      </div>

      <div className="field-group">
        <label className="field-label">Topic Name</label>
        <input
          className="field-input"
          value={data.name}
          onChange={e => set('name', e.target.value)}
          placeholder="e.g. Cell Biology"
        />
      </div>

      <button className="apply-btn" onClick={handleApply}>Apply Changes</button>
    </div>
  )
}
