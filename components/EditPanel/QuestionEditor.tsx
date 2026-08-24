'use client'

import { useState, useEffect } from 'react'
import { SelectedBlock, QuestionData } from '@/lib/types'
import { parseQuestion, serializeQuestion } from '@/lib/blockDetector'

interface Props {
  block: SelectedBlock
  onUpdate: (newOuterHTML: string) => void
}

const LETTERS = ['A', 'B', 'C', 'D'] as const

export default function QuestionEditor({ block, onUpdate }: Props) {
  const [data, setData] = useState<QuestionData | null>(null)

  useEffect(() => {
    const parsed = parseQuestion(block.outerHTML)
    if (parsed) setData(parsed)
  }, [block.outerHTML])

  if (!data) return <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Parsing…</p>

  const set = (field: keyof QuestionData, value: string) =>
    setData(prev => prev ? { ...prev, [field]: value } : prev)

  const setOption = (letter: string, text: string) =>
    setData(prev => {
      if (!prev) return prev
      const opts = prev.options.map(o => o.letter === letter ? { ...o, text } : o)
      return { ...prev, options: opts }
    })

  const handleApply = () => {
    if (!data) return
    const html = serializeQuestion(data, block.blockId)
    onUpdate(html)
  }

  return (
    <div>
      {/* Q Number */}
      <div className="field-group">
        <label className="field-label">Question Number</label>
        <input
          className="field-input"
          value={data.qNum}
          onChange={e => set('qNum', e.target.value)}
          placeholder="e.g. 1"
          style={{ fontFamily: 'monospace' }}
        />
      </div>

      {/* Stem */}
      <div className="field-group">
        <label className="field-label">Question Stem</label>
        <textarea
          className="field-input"
          value={data.stemText}
          onChange={e => set('stemText', e.target.value)}
          rows={3}
          placeholder="Enter the question stem text…"
        />
      </div>

      {/* Source */}
      <div className="field-group">
        <label className="field-label">Source Tag</label>
        <input
          className="field-input"
          value={data.src}
          onChange={e => set('src', e.target.value)}
          placeholder="[IGCSE Extended Feb./March, 2025]"
        />
      </div>

      <div className="section-divider">Options</div>

      {/* Options A–D */}
      {LETTERS.map(letter => {
        const opt = data.options.find(o => o.letter === letter)
        return (
          <div key={letter} className="field-group">
            <label className="field-label">Option ({letter})</label>
            <input
              className="field-input"
              value={opt?.text || ''}
              onChange={e => setOption(letter, e.target.value)}
              placeholder={`Option ${letter} text…`}
            />
          </div>
        )
      })}

      <div className="section-divider">Answer</div>

      {/* Correct option */}
      <div className="field-group">
        <label className="field-label">Correct Option</label>
        <select
          className="field-input"
          value={data.correctOption}
          onChange={e => set('correctOption', e.target.value)}
          style={{ cursor: 'pointer' }}
        >
          {['', 'A', 'B', 'C', 'D'].map(l => (
            <option key={l} value={l}>{l || '— select —'}</option>
          ))}
        </select>
      </div>

      {/* Answer source */}
      <div className="field-group">
        <label className="field-label">Marking Scheme Source</label>
        <input
          className="field-input"
          value={data.ansSource}
          onChange={e => set('ansSource', e.target.value)}
          placeholder="[IGCSE Marking Scheme Feb./March, 2025]"
        />
      </div>

      <div className="section-divider">Explanation</div>

      <div className="field-group">
        <label className="field-label">Explanation Text</label>
        <textarea
          className="field-input"
          value={data.explanation}
          onChange={e => set('explanation', e.target.value)}
          rows={4}
          placeholder="Rewritten explanation…"
        />
      </div>

      <button className="apply-btn" onClick={handleApply}>
        Apply Changes
      </button>
    </div>
  )
}
