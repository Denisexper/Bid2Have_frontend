interface IconProps {
  className?: string
}

const base = 'h-full w-full'

export function IconSun({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className ?? base}>
      <circle cx="12" cy="12" r="4.5" />
      <path
        strokeLinecap="round"
        d="M12 2.5v2.5M12 19v2.5M4.6 4.6l1.8 1.8M17.6 17.6l1.8 1.8M2.5 12h2.5M19 12h2.5M4.6 19.4l1.8-1.8M17.6 6.4l1.8-1.8"
      />
    </svg>
  )
}

export function IconMoon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className ?? base}>
      <path strokeLinejoin="round" d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5Z" />
    </svg>
  )
}

export function IconFeed({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className ?? base}>
      <rect x="3.5" y="3.5" width="7" height="7" />
      <rect x="13.5" y="3.5" width="7" height="7" />
      <rect x="3.5" y="13.5" width="7" height="7" />
      <rect x="13.5" y="13.5" width="7" height="7" />
    </svg>
  )
}

export function IconChat({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className ?? base}>
      <path strokeLinejoin="round" d="M4 5.5h16v10H12l-4 4v-4H4Z" />
    </svg>
  )
}

export function IconProfile({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className ?? base}>
      <circle cx="12" cy="8.3" r="3.3" />
      <path strokeLinecap="round" d="M4.8 19.5c1.3-3 4-4.6 7.2-4.6s5.9 1.6 7.2 4.6" />
    </svg>
  )
}

export function IconPlus({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className ?? base}>
      <path strokeLinecap="round" d="M12 4.5v15M4.5 12h15" />
    </svg>
  )
}

export function IconImage({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className={className ?? base}>
      <rect x="3" y="4.5" width="18" height="15" />
      <circle cx="8.5" cy="9.5" r="1.6" />
      <path strokeLinejoin="round" d="M3 16l5-4.5 4 3 3.5-4L21 15" />
    </svg>
  )
}

export function IconClock({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className={className ?? base}>
      <circle cx="12" cy="12" r="9" />
      <path strokeLinecap="round" d="M12 7v5l3.2 2.2" />
    </svg>
  )
}

export function IconPin({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className={className ?? base}>
      <path strokeLinejoin="round" d="M12 21s7-7.58 7-12a7 7 0 10-14 0c0 4.42 7 12 7 12z" />
      <circle cx="12" cy="9" r="2.3" />
    </svg>
  )
}

export function IconSearch({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className ?? base}>
      <circle cx="11" cy="11" r="7" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  )
}

interface StarProps extends IconProps {
  filled?: boolean
}

export function IconStar({ className, filled = true }: StarProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinejoin="round"
      className={className ?? base}
    >
      <path d="M12 2.5l2.9 6 6.5.8-4.8 4.5 1.2 6.5-5.8-3.2-5.8 3.2 1.2-6.5-4.8-4.5 6.5-.8z" />
    </svg>
  )
}
