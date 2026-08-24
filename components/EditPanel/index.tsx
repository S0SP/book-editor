'use client'

import { SelectedBlock } from '@/lib/types'
import { sendToActiveIframe } from '@/components/PageCanvas'
import QuestionEditor from './QuestionEditor'
import FigureEditor from './FigureEditor'
import TopicEditor from './TopicEditor'
import SectionEditor from './SectionEditor'
import ChapterEditor from './ChapterEditor'
import styles from './EditPanel.module.css'

interface Props {
  selectedBlock: SelectedBlock | null
  onBlockUpdate: (blockId: string, newOuterHTML: string) => void
}

function EmptyState() {
  return (
    <div className={styles.empty}>
      <div className={styles.emptyIcon}>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
          <path d="M3 8h18M3 12h10M3 16h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          <circle cx="19" cy="15" r="3" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M21.5 17.5l1.5 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </div>
      <p className={styles.emptyTitle}>No block selected</p>
      <p className={styles.emptyHint}>Click any element in the page preview to edit it</p>
    </div>
  )
}

export default function EditPanel({ selectedBlock, onBlockUpdate }: Props) {
  if (!selectedBlock) return (
    <div className={styles.root}>
      <EmptyState />
    </div>
  )

  const handleUpdate = (newOuterHTML: string) => {
    // Push to iframe
    sendToActiveIframe({
      type: 'REPLACE_BLOCK',
      blockId: selectedBlock.blockId,
      newOuterHTML,
    })
    // Update React state (will be confirmed by BLOCK_UPDATED message)
    onBlockUpdate(selectedBlock.blockId, newOuterHTML)
  }

  const handleRemove = () => {
    sendToActiveIframe({
      type: 'REMOVE_BLOCK',
      blockId: selectedBlock.blockId,
    })
  }

  const typeLabel: Record<string, string> = {
    'question':      'Question Block',
    'topic-banner':  'Topic Banner',
    'chapter-banner':'Chapter Banner',
    'section-bar':   'Section Bar',
    'figure':        'Figure / Diagram',
    'running-head':  'Running Head',
    'side-card':     'Side Card',
    'generic':       'Block',
  }

  return (
    <div className={styles.root}>
      {/* Panel header */}
      <div className={styles.panelHeader}>
        <span className={`${styles.typeChip} ${styles[`chip_${selectedBlock.blockType.replace('-', '_')}`]}`}>
          {typeLabel[selectedBlock.blockType] || 'Block'}
        </span>
        <span className={styles.blockId}>#{selectedBlock.blockId}</span>
      </div>

      {/* Routed editor */}
      <div className={styles.editorArea}>
        {selectedBlock.blockType === 'question' && (
          <QuestionEditor block={selectedBlock} onUpdate={handleUpdate} />
        )}
        {selectedBlock.blockType === 'figure' && (
          <FigureEditor block={selectedBlock} onUpdate={handleUpdate} />
        )}
        {selectedBlock.blockType === 'topic-banner' && (
          <TopicEditor block={selectedBlock} onUpdate={handleUpdate} />
        )}
        {selectedBlock.blockType === 'section-bar' && (
          <SectionEditor block={selectedBlock} onUpdate={handleUpdate} />
        )}
        {selectedBlock.blockType === 'chapter-banner' && (
          <ChapterEditor block={selectedBlock} onUpdate={handleUpdate} />
        )}
        {(selectedBlock.blockType === 'running-head' ||
          selectedBlock.blockType === 'side-card' ||
          selectedBlock.blockType === 'generic') && (
          <div className={styles.rawEditor}>
            <p className={styles.rawHint}>
              This block type does not have a structured editor yet.
              Use the page directly to select other blocks.
            </p>
            <div className={styles.rawPreview}>
              <code>{selectedBlock.outerHTML.slice(0, 300)}{selectedBlock.outerHTML.length > 300 ? '…' : ''}</code>
            </div>
          </div>
        )}
        
        <button className="remove-btn" onClick={handleRemove}>
          Remove Block
        </button>
      </div>
    </div>
  )
}
