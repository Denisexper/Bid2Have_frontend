import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ApiError } from '@api/client'
import { formatRelativeTime } from '@listings/format'
import { useDismissReport, useReports, useReviewReport } from '@reports/api'
import { reportStatusLabels, reportTargetTypeLabels } from '@reports/labels'
import type { Report, ReportStatus } from '@reports/types'

const statusFilters: Array<{ value: ReportStatus | 'ALL'; label: string }> = [
  { value: 'PENDING', label: 'Pendientes' },
  { value: 'REVIEWED', label: 'Revisados' },
  { value: 'DISMISSED', label: 'Descartados' },
  { value: 'ALL', label: 'Todos' },
]

const statusBadgeClass: Record<ReportStatus, string> = {
  PENDING: 'badge-warning',
  REVIEWED: 'badge-success',
  DISMISSED: 'badge-ghost',
}

export function AdminReportsPage() {
  const [filter, setFilter] = useState<ReportStatus | 'ALL'>('PENDING')
  const { data, isLoading, isError } = useReports(filter === 'ALL' ? undefined : filter)

  const reports = data?.reports ?? []

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-baseline justify-between">
        <h1 className="text-lg font-bold">Reportes</h1>
        {reports.length > 0 && <span className="text-xs text-base-content/40">{reports.length}</span>}
      </div>

      <div className="flex flex-wrap gap-1.5">
        {statusFilters.map((option) => (
          <button
            key={option.value}
            type="button"
            className={`btn btn-xs ${filter === option.value ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setFilter(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>

      {isLoading && (
        <div className="flex justify-center py-8">
          <span className="loading loading-spinner loading-md text-primary" />
        </div>
      )}

      {isError && <p className="py-8 text-center text-sm text-error">No pudimos cargar los reportes.</p>}

      {!isLoading && !isError && reports.length === 0 && (
        <p className="py-8 text-center text-sm text-base-content/60">No hay reportes en esta categoría.</p>
      )}

      <ul className="grid gap-2 lg:grid-cols-2">
        {reports.map((report) => (
          <ReportRow key={report.id} report={report} />
        ))}
      </ul>
    </div>
  )
}

function ReportRow({ report }: { report: Report }) {
  const review = useReviewReport()
  const dismiss = useDismissReport()

  const error = review.error ?? dismiss.error
  const isPending = review.isPending || dismiss.isPending

  return (
    <li className="flex flex-col gap-2 border-2 border-base-300 bg-base-100 p-3 sm:p-4">
      <div className="flex items-center justify-between gap-2">
        <span className="badge badge-ghost badge-sm">{reportTargetTypeLabels[report.targetType]}</span>
        <span className={`badge badge-sm ${statusBadgeClass[report.status]}`}>
          {reportStatusLabels[report.status]}
        </span>
      </div>

      <div>
        <p className="text-sm font-semibold">{report.reason}</p>
        {report.description && <p className="mt-1 text-sm text-base-content/70">{report.description}</p>}
      </div>

      <div className="text-xs text-base-content/50">
        {report.targetType === 'LISTING' && report.listingId ? (
          <Link to={`/listings/${report.listingId}`} className="link link-primary">
            Ver publicación
          </Link>
        ) : (
          report.targetUserId && <span>Usuario #{report.targetUserId.slice(0, 8)}</span>
        )}
        {' · '}
        Reportado por #{report.reporterId.slice(0, 8)} · {formatRelativeTime(report.createdAt)}
      </div>

      {report.status === 'PENDING' && (
        <div className="flex gap-2 border-t border-base-300 pt-2">
          <button
            type="button"
            className="btn btn-success btn-xs"
            disabled={isPending}
            onClick={() => review.mutate(report.id)}
          >
            Revisar
          </button>
          <button
            type="button"
            className="btn btn-ghost btn-xs"
            disabled={isPending}
            onClick={() => dismiss.mutate(report.id)}
          >
            Descartar
          </button>
        </div>
      )}

      {error && (
        <p className="text-xs text-error">
          {error instanceof ApiError ? error.message : 'No pudimos procesar la acción.'}
        </p>
      )}
    </li>
  )
}
