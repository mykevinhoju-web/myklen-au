export function formatMessageDate(iso: string) {
  return new Intl.DateTimeFormat('en-AU', {
    dateStyle: 'medium',
    timeZone: 'Australia/Brisbane',
  }).format(new Date(iso))
}

export function formatSchedule(iso: string) {
  return new Intl.DateTimeFormat('en-AU', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Australia/Brisbane',
  }).format(new Date(iso))
}

export function statusLabel(status: 'scheduled' | 'completed' | 'cancelled') {
  if (status === 'scheduled') return 'Scheduled'
  if (status === 'completed') return 'Completed'
  return 'Cancelled'
}
