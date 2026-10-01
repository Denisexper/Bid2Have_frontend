const timeFormatter = new Intl.DateTimeFormat('es', { hour: '2-digit', minute: '2-digit' })

export function formatMessageTime(iso: string): string {
  return timeFormatter.format(new Date(iso))
}
