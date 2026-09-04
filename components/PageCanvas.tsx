'use client'

import { useEffect, useRef, useMemo, useCallback } from 'react'
import { buildSrcdoc } from '@/lib/iframeContent'
import { SelectedBlock, BlockType } from '@/lib/types'
import styles from './PageCanvas.module.css'

interface Props {
  content: string
  zoom: number
  onBlockSelect: (block: SelectedBlock) => void
  onBlockUpdated: (blockId: string, newOuterHTML: string) => void
  onPageUpdated?: (newHtml: string) => void
}

export default function PageCanvas({ content, zoom, onBlockSelect, onBlockUpdated, onPageUpdated }: Props) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  
  // Only parse srcdoc on initial mount of this page component.
  // This prevents the iframe from refreshing and losing scroll position when React updates the page's HTML content.
  const initialContentRef = useRef(content)
  const srcdoc = useMemo(() => buildSrcdoc(initialContentRef.current), [])

  const sendToIframe = useCallback((msg: object) => {
    iframeRef.current?.contentWindow?.postMessage(msg, '*')
  }, [])

  // Listen for postMessages from iframe
  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (!e.data?.type) return

      if (e.data.type === 'BLOCK_CLICK') {
        onBlockSelect({
          blockId: e.data.blockId,
          blockType: e.data.blockType as BlockType,
          outerHTML: e.data.outerHTML,
        })
      }

      if (e.data.type === 'BLOCK_UPDATED') {
        onBlockUpdated(e.data.blockId, e.data.outerHTML)
      }

      if (e.data.type === 'DESELECT') {
        // Block click outside any editable — just pass through
      }

      if (e.data.type === 'PAGE_CONTENT_UPDATED' && onPageUpdated) {
        onPageUpdated(e.data.html)
      }
    }

    window.addEventListener('message', handler)
    return () => window.removeEventListener('message', handler)
  }, [onBlockSelect, onBlockUpdated, onPageUpdated])

  // Expose sendToIframe so EditPanel can trigger iframe updates
  // We use a global ref trick via the iframe element dataset
  useEffect(() => {
    if (iframeRef.current) {
      // Store the send function in a way EditPanel can reach via the canvas
      (window as unknown as Record<string, unknown>).__igcseEditorSend = sendToIframe
    }
    return () => {
      delete (window as unknown as Record<string, unknown>).__igcseEditorSend
    }
  }, [sendToIframe])

  // The A4 page is 210mm × 297mm at 96dpi ≈ 794px × 1123px
  const A4_W_PX = 794
  const A4_H_PX = 1123

  // Count the number of .page elements to set height dynamically
  const pageCount = useMemo(() => {
    if (typeof window === 'undefined') return 1
    const parser = new DOMParser()
    const doc = parser.parseFromString(content, 'text/html')
    return doc.querySelectorAll('.page').length || 1
  }, [content])

  const iframeHeight = (A4_H_PX * pageCount) + (20 * pageCount)
  const scaledW = A4_W_PX * zoom
  const scaledH = iframeHeight * zoom

  return (
    <div
      className={styles.wrapper}
      style={{ width: scaledW, height: scaledH, flexShrink: 0 }}
    >
      <iframe
        ref={iframeRef}
        srcDoc={srcdoc}
        className={styles.iframe}
        style={{
          width: A4_W_PX,
          height: iframeHeight,
          transform: `scale(${zoom})`,
          transformOrigin: 'top left',
        }}
        title="Page preview"
        sandbox="allow-scripts allow-same-origin allow-downloads"
      />
    </div>
  )
}

/** Called by EditPanel to push block replacements into the active iframe */
export function sendToActiveIframe(msg: object) {
  const send = (window as unknown as Record<string, unknown>).__igcseEditorSend as ((m: object) => void) | undefined
  send?.(msg)
}
