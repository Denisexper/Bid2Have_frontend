import { useState } from 'react'
import { ApiError } from '../api/client'
import { useAcceptOffer, useCounterOffer, useRejectOffer } from './api'
import { fieldClassSm } from './styles'

interface OfferResponseActionsProps {
  offerId: string
  listingId: string
}

export function OfferResponseActions({ offerId, listingId }: OfferResponseActionsProps) {
  const [isCountering, setIsCountering] = useState(false)
  const [counterAmount, setCounterAmount] = useState('')

  const accept = useAcceptOffer(listingId)
  const reject = useRejectOffer(listingId)
  const counter = useCounterOffer(listingId)

  const error = accept.error ?? reject.error ?? counter.error
  const isPending = accept.isPending || reject.isPending || counter.isPending

  function submitCounter(): void {
    const amount = Number(counterAmount)
    if (!amount || amount <= 0) return
    counter.mutate({ offerId, amount }, { onSuccess: () => setIsCountering(false) })
  }

  return (
    <div className="flex flex-col gap-2">
      {!isCountering ? (
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="btn btn-primary btn-xs"
            disabled={isPending}
            onClick={() => accept.mutate({ offerId })}
          >
            Aceptar
          </button>
          <button
            type="button"
            className="btn btn-outline btn-error btn-xs"
            disabled={isPending}
            onClick={() => reject.mutate({ offerId })}
          >
            Rechazar
          </button>
          <button
            type="button"
            className="btn btn-ghost btn-xs"
            disabled={isPending}
            onClick={() => setIsCountering(true)}
          >
            Contraofertar
          </button>
        </div>
      ) : (
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="number"
            className={`${fieldClassSm} w-24`}
            value={counterAmount}
            onChange={(e) => setCounterAmount(e.target.value)}
            placeholder="Monto"
            min="0"
            step="0.01"
            autoFocus
          />
          <button type="button" className="btn btn-primary btn-xs" disabled={isPending} onClick={submitCounter}>
            Enviar
          </button>
          <button type="button" className="btn btn-ghost btn-xs" onClick={() => setIsCountering(false)}>
            Cancelar
          </button>
        </div>
      )}

      {error && (
        <p className="text-xs text-error">{error instanceof ApiError ? error.message : 'No pudimos procesar la acción.'}</p>
      )}
    </div>
  )
}
