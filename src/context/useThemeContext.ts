import { useContext } from 'react'
import { ThemeContext, type ThemeContextValue } from './ThemeContextInstance'

/** Access the current theme + toggle. Must be used within ThemeProvider. */
export function useThemeContext(): ThemeContextValue {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useThemeContext must be used within a ThemeProvider')
  }
  return context
}
