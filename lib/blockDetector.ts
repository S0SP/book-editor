import { BlockType, QuestionData, FigureData, TopicData, SectionData, ChapterData } from './types'

export function detectBlockType(el: Element): BlockType {
  if (el.classList.contains('q')) return 'question'
  if (el.classList.contains('topic-banner')) return 'topic-banner'
  if (el.classList.contains('chapter-banner')) return 'chapter-banner'
  if (el.classList.contains('section-bar')) return 'section-bar'
  if (el.classList.contains('fig') || el.classList.contains('diagram-card')) return 'figure'
  if (el.classList.contains('running-head')) return 'running-head'
  if (el.classList.contains('side-card')) return 'side-card'
  return 'generic'
}

function parse(html: string): Document {
  return new DOMParser().parseFromString(html, 'text/html')
}

export function parseQuestion(outerHTML: string): QuestionData | null {
  const doc = parse(outerHTML)
  const block = doc.querySelector('.q')
  if (!block) return null

  const firstP = block.querySelector('p')
  const qStrong = firstP?.querySelector('strong')
  const qNum = (qStrong?.textContent || '').replace(/^Q\.\s*/, '').replace(/\.$/, '').trim()
  const stemText = (firstP?.textContent || '').replace(qStrong?.textContent || '', '').trim()

  const options: { letter: string; text: string }[] = []
  block.querySelectorAll('ul > li').forEach((li, i) => {
    const strong = li.querySelector('strong')
    const letter = (strong?.textContent || '').replace(/[()]/g, '').trim() || String.fromCharCode(65 + i)
    const text = (li.textContent || '').replace(strong?.textContent || '', '').trim()
    options.push({ letter, text })
  })
  while (options.length < 4) {
    options.push({ letter: String.fromCharCode(65 + options.length), text: '' })
  }

  let src = ''
  block.querySelectorAll('.src').forEach(el => {
    if (!el.closest('.ans')) src = el.textContent?.trim() || ''
  })

  const ans = block.querySelector('.ans')
  let correctOption = ''
  let ansSource = ''
  if (ans) {
    ans.querySelectorAll('strong').forEach(s => {
      const t = s.textContent?.trim() || ''
      if (/^\([A-D]\)$/.test(t)) correctOption = t.replace(/[()]/g, '')
    })
    ansSource = ans.querySelector('.src')?.textContent?.trim() || ''
  }

  const explanation = (block.querySelector('.expl')?.textContent || '')
    .replace(/^Explanation:\s*/i, '')
    .trim()

  return { qNum, stemText, options, src, correctOption, ansSource, explanation }
}

export function serializeQuestion(data: QuestionData, blockId: string): string {
  const opts = ['A', 'B', 'C', 'D']
    .map((l, i) => {
      const d = data.options.find(o => o.letter === l) || data.options[i]
      return `    <li><strong>(${l})</strong> ${d?.text || ''}</li>`
    })
    .join('\n')

  return `<div class="q" data-block-id="${blockId}">
  <p><strong>Q. ${data.qNum}.</strong> ${data.stemText}</p>
  <ul>
${opts}
  </ul>
  <span class="src">${data.src}</span>
  <div class="ans">
    <strong>Ans.</strong> Option <strong>(${data.correctOption})</strong> is correct.
    <span class="src">${data.ansSource}</span>
  </div>
  <p class="expl"><strong>Explanation:</strong> ${data.explanation}</p>
</div>`
}

export function parseFigure(outerHTML: string): FigureData | null {
  const doc = parse(outerHTML)
  const fig = doc.querySelector('.fig')
  const diagramCard = doc.querySelector('.diagram-card')

  if (diagramCard) {
    const header = diagramCard.querySelector('.diagram-header')
    const summary = diagramCard.querySelector('.diagram-summary')
    const caption = diagramCard.querySelector('figcaption')
    
    const body = diagramCard.querySelector('.diagram-body')
    let extraHTML = ''
    if (body) {
      Array.from(body.children).forEach(child => {
        if (!child.classList.contains('diagram-summary')) {
          extraHTML += child.outerHTML + '\n    '
        }
      })
    }

    return {
      isPlaceholder: true,
      isGraph: false,
      label: header?.textContent?.trim() || '',
      description: summary?.textContent?.trim() || '',
      caption: caption?.textContent?.trim() || '',
      originalType: 'diagram-card',
      extraHTML: extraHTML.trim()
    }
  }

  if (!fig) return null
  return {
    isPlaceholder: !!fig.querySelector('.fig-placeholder'),
    isGraph: fig.classList.contains('graph'),
    label: fig.querySelector('.ph-label')?.textContent?.trim() || '',
    description: fig.querySelector('.ph-desc')?.textContent?.trim() || '',
    caption: fig.querySelector('figcaption')?.textContent?.trim() || '',
    imageSrc: fig.querySelector('img')?.getAttribute('src') || undefined,
    originalType: 'fig'
  }
}

export function serializeFigureWithImage(
  data: FigureData,
  blockId: string,
  imageSrc: string
): string {
  return `<figure class="fig${data.isGraph ? ' graph' : ''}" data-block-id="${blockId}">
  <img src="${imageSrc}" alt="${data.description}" style="max-height:var(--fig-height,46mm);max-width:100%;display:block;margin:0 auto;" />
  <figcaption>${data.caption}</figcaption>
</figure>`
}

export function serializeFigurePlaceholder(data: FigureData, blockId: string): string {
  if (data.originalType === 'diagram-card') {
    return `<div class="diagram-card" data-block-id="${blockId}">
  <div class="diagram-header">${data.label}</div>
  <div class="diagram-body">
    <p class="diagram-summary">${data.description}</p>
    ${data.extraHTML || ''}
  </div>
  <figcaption>${data.caption}</figcaption>
</div>`
  }

  const graphClass = data.isGraph ? ' graph' : ''
  return `<figure class="fig${graphClass}" data-block-id="${blockId}">
  <div class="fig-placeholder${graphClass}">
    <span class="ph-icon">${data.isGraph ? '〜' : '◎'}</span>
    <span class="ph-label">${data.label}</span>
    <span class="ph-desc">${data.description}</span>
  </div>
  <figcaption>${data.caption}</figcaption>
</figure>`
}

export function parseTopic(outerHTML: string): TopicData | null {
  const doc = parse(outerHTML)
  const block = doc.querySelector('.topic-banner')
  if (!block) return null
  return {
    kicker: block.querySelector('.topic-kicker')?.textContent?.trim() || '',
    name: block.querySelector('.topic-name')?.textContent?.trim() || '',
  }
}

export function serializeTopic(data: TopicData, blockId: string): string {
  return `<div class="topic-banner" data-block-id="${blockId}">
  <span class="topic-kicker">${data.kicker}</span>
  <span class="topic-name">${data.name}</span>
</div>`
}

export function parseSection(outerHTML: string): SectionData | null {
  const doc = parse(outerHTML)
  const block = doc.querySelector('.section-bar')
  if (!block) return null
  return {
    title: block.querySelector('.section-title')?.textContent?.trim() || '',
    marks: block.querySelector('.section-marks')?.textContent?.trim() || '',
  }
}

export function serializeSection(data: SectionData, blockId: string): string {
  return `<div class="section-bar" data-block-id="${blockId}">
  <span class="section-icon">?</span>
  <span class="section-title">${data.title}</span>
  <span class="section-marks">${data.marks}</span>
</div>`
}

export function parseChapter(outerHTML: string): ChapterData | null {
  const doc = parse(outerHTML)
  const block = doc.querySelector('.chapter-banner')
  if (!block) return null
  return {
    title: block.querySelector('.chapter-title')?.textContent?.trim() || '',
    number: block.querySelector('.chapter-number')?.textContent?.trim() || '',
  }
}

export function serializeChapter(data: ChapterData, blockId: string): string {
  return `<div class="chapter-banner" data-block-id="${blockId}">
  <div class="chapter-title">${data.title}</div>
  <div class="chapter-number">${data.number}</div>
</div>`
}
