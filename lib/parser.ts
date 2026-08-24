import { ParsedPage } from './types'

const EDITABLE_SELECTORS = [
  '.q',
  '.topic-banner',
  '.chapter-banner',
  '.section-bar',
  '.fig',
  '.running-head',
  '.side-card',
]

/** Parse a .md file's content into a ParsedPage with data-block-id assigned */
export function parseMdFile(filename: string, rawContent: string): ParsedPage {
  const pageNum = parseInt(filename.match(/(\d+)/)?.[1] || '0', 10)

  if (typeof window === 'undefined') {
    return { filename, content: rawContent, pageNum, isDirty: false }
  }

  const parser = new DOMParser()
  // Wrap in a body if needed
  const doc = parser.parseFromString(rawContent, 'text/html')

  // Assign data-block-id to every editable block
  let counter = 0
  EDITABLE_SELECTORS.forEach(selector => {
    doc.querySelectorAll(selector).forEach(el => {
      el.setAttribute('data-block-id', String(counter++))
    })
  })

  return {
    filename,
    content: doc.body.innerHTML.trim(),
    pageNum,
    isDirty: false,
  }
}

/** Sort and parse an array of raw files */
export function parseFiles(files: { filename: string; content: string }[]): ParsedPage[] {
  return files
    .map(f => parseMdFile(f.filename, f.content))
    .sort((a, b) => a.pageNum - b.pageNum)
}

/** Update a single block's outerHTML inside the stored page HTML */
export function updateBlockInContent(
  pageContent: string,
  blockId: string,
  newOuterHTML: string
): string {
  if (typeof window === 'undefined') return pageContent

  const parser = new DOMParser()
  const doc = parser.parseFromString(pageContent, 'text/html')
  const block = doc.querySelector(`[data-block-id="${blockId}"]`)
  if (!block) return pageContent

  const tmp = doc.createElement('div')
  tmp.innerHTML = newOuterHTML
  const newBlock = tmp.firstElementChild
  if (newBlock) {
    block.parentNode?.replaceChild(newBlock, block)
  }

  return doc.body.innerHTML
}

/** Strip editor-only attributes for export/save */
export function exportCleanHtml(content: string): string {
  return content
    .replace(/ data-block-id="\d+"/g, '')
    .replace(/\s*block-selected\s*/g, '')
    .replace(/ class=""/g, '')
}

export function buildMdContent(page: ParsedPage): string {
  let clean = exportCleanHtml(page.content)
  // If it doesn't already have the page wrapper, add it
  const hasPage = clean.includes('class="page"') || clean.includes("class='page'");
  if (!hasPage) {
    clean = `<div class="page">\n${clean}\n</div>`
  }
  return `<!-- @page: ${page.pageNum} | @source: IGCSE -->\n\n${clean}\n`
}
