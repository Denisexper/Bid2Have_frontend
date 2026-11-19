import { useState, type FormEvent } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '@auth/AuthContext'
import { ApiError } from '@api/client'
import { fieldClassSm, labelClass } from '@components/fieldStyles'
import { useCreateReport } from './api'
import type { ReportTargetType } from './types'

interface ReportButtonProps {
  label: string
  targetType: ReportTargetType
  listingId?: string
  targetUserId?: string
}

export function ReportButton({ label, targetType, listingId, targetUserId }: ReportButtonProps) {
  const { user } = useAuth()
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(false)
  const [reason, setReason] = useState('')
  const [description, setDescription] = useState('')
  const createReport = useCreateReport()

  if (!user) {
    return (
      <Link to="/login" state={{ from: location }} className="btn btn-ghost btn-xs">
        {label}
      </Link>
    )
  }

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
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 border border-base-300 bg-base-200 p-3">
      <label className="flex flex-col gap-1">
        <span className={labelClass}>Motivo del reporte</span>
        <input
          type="text"
          className={fieldClassSm}
          placeholder="Ej. contenido engañoso"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          required
          autoFocus
        />
      </label>
      <label className="flex flex-col gap-1">
        <span className={labelClass}>Detalle (opcional)</span>
        <textarea
          className={`${fieldClassSm} resize-none`}
          placeholder="Contanos más si hace falta"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
        />
      </label>
      <div className="flex gap-2">
        <button type="submit" className="btn btn-error btn-xs" disabled={createReport.isPending}>
          Enviar reporte
        </button>
        <button type="button" className="btn btn-ghost btn-xs" onClick={() => setIsOpen(false)}>
          Cancelar
        </button>
      </div>
      {createReport.isError && (
        <p className="text-xs text-error">
          {createReport.error instanceof ApiError ? createReport.error.message : 'No pudimos enviar el reporte.'}
        </p>
      )}
    </form>
  )
}
