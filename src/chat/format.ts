const timeFormatter = new Intl.DateTimeFormat('es', { hour: '2-digit', minute: '2-digit' })
const longDateFormatter = new Intl.DateTimeFormat('es', { day: 'numeric', month: 'long' })
const longDateWithYearFormatter = new Intl.DateTimeFormat('es', { day: 'numeric', month: 'long', year: 'numeric' })

export function formatMessageTime(iso: string): string {
  return timeFormatter.format(new Date(iso))
}

export function isSameCalendarDay(isoA: string, isoB: string): boolean {
  return new Date(isoA).toDateString() === new Date(isoB).toDateString()
}

export function formatDateDivider(iso: string): string {
  const date = new Date(iso)
  const now = new Date()
  const yesterday = new Date(now)
  yesterday.setDate(now.getDate() - 1)

  if (date.toDateString() === now.toDateString()) return 'Hoy'
  if (date.toDateString() === yesterday.toDateString()) return 'Ayer'

  return date.getFullYear() === now.getFullYear()
    ? longDateFormatter.format(date)
    : longDateWithYearFormatter.format(date)
}
