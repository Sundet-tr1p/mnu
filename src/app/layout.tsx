import type { Metadata } from 'next'
import './globals.css'
import { LocaleProvider } from '@/components/layout/LocaleProvider'

export const metadata: Metadata = {
  title: 'UniConnect — MNU',
  description: 'Студенческий портал и социальная сеть MNU',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body className="app-background text-gray-900">
        <LocaleProvider>{children}</LocaleProvider>
      </body>
    </html>
  )
}
