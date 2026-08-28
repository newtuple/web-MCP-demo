import { Fragment } from 'react'
import GradientText from './GradientText'

interface HighlightedTextProps {
  text: string
  highlight?: string
  highlightClassName?: string
}

export default function HighlightedText({ text, highlight, highlightClassName }: HighlightedTextProps) {
  if (!highlight) {
    return <>{text}</>
  }

  const parts = text.split(highlight)
  if (parts.length === 1) {
    return <>{text}</>
  }

  return (
    <>
      {parts.map((part, index) => (
        <Fragment key={`${highlight}-${index}`}>
          {part}
          {index < parts.length - 1 ? (
            highlightClassName ? <span className={highlightClassName}>{highlight}</span> : <GradientText>{highlight}</GradientText>
          ) : null}
        </Fragment>
      ))}
    </>
  )
}
