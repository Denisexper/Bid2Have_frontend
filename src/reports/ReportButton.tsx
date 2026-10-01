import { useState, type FormEvent } from 'react'
import { ApiError } from '../api/client'
import { useCreateReport } from './api'
import type { ReportTargetType } from './types'

interface ReportButtonProps {
  label: string
  targetType: ReportTargetType
  listingId?: string
  targetUserId?: string
}

export function ReportButton({ label, targetType, listingId, targetUserId }: ReportButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [reason, setReason] = useState('')
  const [description, setDescription] = useState('')
  const createReport = useCreateReport()

  if (createReport.isSuccess) {
    return <span className="text-xs text-base-content/50">✓ Reportado</span>
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
    if (!reason.trim()) return

    createReport.mutate({
      targetType,
      listingId,
      targetUserId,
      reason: reason.trim(),
      description: description.trim() || undefined,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-lg bg-base-200 p-2">
      <input
        type="text"
        className="input input-bordered input-xs w-full"
        placeholder="Motivo del reporte"
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        required
        autoFocus
      />
      <textarea
        className="textarea textarea-bordered textarea-xs mt-1 w-full"
        placeholder="Detalle (opcional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={2}
      />
      <div className="mt-1 flex gap-2">
        <button type="submit" className="btn btn-error btn-xs" disabled={createReport.isPending}>
          Enviar reporte
        </button>
        <button type="button" className="btn btn-ghost btn-xs" onClick={() => setIsOpen(false)}>
          Cancelar
        </button>
      </div>
      {createReport.isError && (
        <p className="mt-1 text-xs text-error">
          {createReport.error instanceof ApiError ? createReport.error.message : 'No pudimos enviar el reporte.'}
        </p>
      )}
    </form>
  )
}
