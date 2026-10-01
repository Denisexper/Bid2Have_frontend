import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ApiError } from '../api/client'
import { formatRelativeTime } from '../listings/format'
import { useDismissReport, useReports, useReviewReport } from '../reports/api'
import { reportStatusLabels, reportTargetTypeLabels } from '../reports/labels'
import type { Report, ReportStatus } from '../reports/types'

const statusFilters: Array<{ value: ReportStatus | 'ALL'; label: string }> = [
  { value: 'PENDING', label: 'Pendientes' },
  { value: 'REVIEWED', label: 'Revisados' },
  { value: 'DISMISSED', label: 'Descartados' },
  { value: 'ALL', label: 'Todos' },
]

export function AdminReportsPage() {
  const [filter, setFilter] = useState<ReportStatus | 'ALL'>('PENDING')
  const { data, isLoading, isError } = useReports(filter === 'ALL' ? undefined : filter)

  const reports = data?.reports ?? []

  return (
    <div className="flex flex-col gap-3">
      <h1 className="text-lg font-bold">Reportes</h1>

      <div className="flex gap-1.5">
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

      <ul className="flex flex-col gap-2">
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
    <li className="rounded-2xl bg-base-100 p-3 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="badge badge-ghost badge-sm">{reportTargetTypeLabels[report.targetType]}</span>
        <span className="badge badge-outline badge-sm">{reportStatusLabels[report.status]}</span>
      </div>

      <p className="mt-2 text-sm font-semibold">{report.reason}</p>
      {report.description && <p className="mt-1 text-sm text-base-content/70">{report.description}</p>}

      <div className="mt-2 text-xs text-base-content/50">
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
        <div className="mt-2 flex gap-2">
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
        <p className="mt-1 text-xs text-error">
          {error instanceof ApiError ? error.message : 'No pudimos procesar la acción.'}
        </p>
      )}
    </li>
  )
}
