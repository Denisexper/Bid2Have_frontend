import { IconStar } from '../components/icons'

interface StarRatingProps {
  score: number
  max?: number
  className?: string
}

export function StarRating({ score, max = 5, className }: StarRatingProps) {
  return (
    <span className={`inline-flex items-center gap-0.5 ${className ?? ''}`}>
      {Array.from({ length: max }, (_, i) => (
        <span key={i} className={`h-3.5 w-3.5 ${i < score ? 'text-base-content' : 'text-base-content/20'}`}>
          <IconStar filled={i < score} />
        </span>
      ))}
    </span>
  )
}
