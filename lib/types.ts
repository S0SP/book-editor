export interface ParsedPage {
  filename: string
  content: string   // HTML with data-block-id attributes assigned
  pageNum: number
  isDirty: boolean
}

export type BlockType =
  | 'question'
  | 'topic-banner'
  | 'chapter-banner'
  | 'section-bar'
  | 'figure'
  | 'running-head'
  | 'side-card'
  | 'generic'

export interface SelectedBlock {
  blockId: string
  blockType: BlockType
  outerHTML: string
}

export interface QuestionData {
  qNum: string
  stemText: string
  options: { letter: string; text: string }[]
  src: string
  correctOption: string
  ansSource: string
  explanation: string
}

export interface FigureData {
  isPlaceholder: boolean
  label: string
  description: string
  caption: string
  imageSrc?: string
  isGraph?: boolean
  originalType?: 'fig' | 'diagram-card'
  extraHTML?: string
}

export interface TopicData {
  kicker: string
  name: string
}

export interface SectionData {
  title: string
  marks: string
}

export interface ChapterData {
  title: string
  number: string
}
