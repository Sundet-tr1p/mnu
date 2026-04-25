import type { Metadata } from 'next'
import './globals.css'
import { LocaleProvider } from '@/components/layout/LocaleProvider'
import { ThemeProvider } from '@/components/layout/ThemeProvider'

export const metadata: Metadata = {
  title: 'UniConnect — MNU',
  description: 'Студенческий портал и социальная сеть MNU',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body className="app-background text-gray-900">
        <ThemeProvider>
          <LocaleProvider>{children}</LocaleProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
