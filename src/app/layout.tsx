import type { Metadata } from 'next'
import './globals.css'
import Navbar from './components/Nav/Navbar'
import { BaseWidthProvider } from './context/BaseWidth'
import ReduxProvider from './state/ReduxProvider'
import Analytics from './components/Analytics'

export const metadata: Metadata = {
  title: 'Royal postcards',
  description: 'Collection of royal postcards',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="root">
        <ReduxProvider>
          <Navbar />
          <BaseWidthProvider>
            <Analytics />
            {children}
          </BaseWidthProvider>
        </ReduxProvider>
      </body>
    </html>
  )
}
