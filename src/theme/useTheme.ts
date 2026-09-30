import { useEffect, useState } from 'react'

export type Theme = 'bid2have-light' | 'bid2have-dark'

const STORAGE_KEY = 'bid2have_theme'

function getSystemTheme(): Theme {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'bid2have-dark' : 'bid2have-light'
}

function getStoredTheme(): Theme | null {
  const stored = localStorage.getItem(STORAGE_KEY)
  return stored === 'bid2have-light' || stored === 'bid2have-dark' ? stored : null
}

export function useTheme(): { theme: Theme; toggleTheme: () => void } {
  const [theme, setThemeState] = useState<Theme>(() => getStoredTheme() ?? getSystemTheme())

  useEffect(() => {
    const stored = getStoredTheme()
    if (stored) {
      document.documentElement.setAttribute('data-theme', stored)
    }
  }, [])

  function setTheme(next: Theme): void {
    document.documentElement.setAttribute('data-theme', next)
    localStorage.setItem(STORAGE_KEY, next)
    setThemeState(next)
  }

  function toggleTheme(): void {
    setTheme(theme === 'bid2have-dark' ? 'bid2have-light' : 'bid2have-dark')
  }

  return { theme, toggleTheme }
}
