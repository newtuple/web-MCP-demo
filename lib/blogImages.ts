const OPENAI_SELECT_BADGE = '/images/partners/openai-select-partner.svg'

export function getBlogImageMotionClass(image?: string) {
  return image === OPENAI_SELECT_BADGE
    ? 'scale-[0.96] group-hover:scale-100'
    : 'group-hover:scale-105'
}
