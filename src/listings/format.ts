const relativeTimeFormatter = new Intl.RelativeTimeFormat('es', { numeric: 'auto' })

export function formatPrice(price: string, currency: string): string {
  return new Intl.NumberFormat('es-SV', { style: 'currency', currency }).format(Number(price))
}

export function formatRelativeTime(iso: string): string {
  const diffMinutes = Math.round((new Date(iso).getTime() - Date.now()) / 60_000)

  if (Math.abs(diffMinutes) < 60) {
    return relativeTimeFormatter.format(diffMinutes, 'minute')
  }

  const diffHours = Math.round(diffMinutes / 60)
  if (Math.abs(diffHours) < 24) {
    return relativeTimeFormatter.format(diffHours, 'hour')
  }

  return relativeTimeFormatter.format(Math.round(diffHours / 24), 'day')
}

export function formatCountdown(auctionEndAt: string | null): string | null {
  if (!auctionEndAt) {
    return null
  }

  const totalMinutes = Math.floor((new Date(auctionEndAt).getTime() - Date.now()) / 60_000)
  if (totalMinutes <= 0) {
    return null
  }

  const days = Math.floor(totalMinutes / 1440)
  const hours = Math.floor((totalMinutes % 1440) / 60)
  const minutes = totalMinutes % 60

  if (days > 0) return `${days}d ${hours}h`
  if (hours > 0) return `${hours}h ${minutes}m`
  return `${minutes}m`
}
