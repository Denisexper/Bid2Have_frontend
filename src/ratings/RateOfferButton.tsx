import { useState, type FormEvent } from 'react'
import { useCreateRating } from './api'
import { hasRatedOffer, markOfferRated } from './ratedOfferStorage'
import { IconStar } from '../components/icons'

interface RateOfferButtonProps {
  offerId: string
  label: string
}

export function RateOfferButton({ offerId, label }: RateOfferButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [score, setScore] = useState(5)
  const [comment, setComment] = useState('')
  const [alreadyRated, setAlreadyRated] = useState(() => hasRatedOffer(offerId))
  const createRating = useCreateRating(offerId)

  if (alreadyRated) {
    return <span className="text-xs text-base-content/50">✓ Calificado</span>
  }

  if (!isOpen) {
    return (
      <button type="button" className="btn btn-ghost btn-xs" onClick={() => setIsOpen(true)}>
        {label}
      </button>
    )
  }

  function handleSubmit(event: FormEvent): void {
    event.preventDefault()
    createRating.mutate(
      { score, comment: comment.trim() || undefined },
      {
        onSuccess: () => {
          markOfferRated(offerId)
          setAlreadyRated(true)
        },
      },
    )
  }

  return (
    <form onSubmit={handleSubmit} className="border border-base-300 bg-base-200 p-2">
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setScore(value)}
            aria-label={`${value} estrellas`}
            className={`h-5 w-5 ${value <= score ? 'text-base-content' : 'text-base-content/25'}`}
          >
            <IconStar filled={value <= score} />
          </button>
        ))}
      </div>
      <textarea
        className="textarea textarea-bordered textarea-xs mt-1 w-full"
        placeholder="Comentario (opcional)"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={2}
      />
      <div className="mt-1 flex gap-2">
        <button type="submit" className="btn btn-primary btn-xs" disabled={createRating.isPending}>
          Enviar
        </button>
        <button type="button" className="btn btn-ghost btn-xs" onClick={() => setIsOpen(false)}>
          Cancelar
        </button>
      </div>
      {createRating.isError && <p className="mt-1 text-xs text-error">{createRating.error.message}</p>}
    </form>
  )
}
