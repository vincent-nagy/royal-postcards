import type { Metadata } from 'next'
import './globals.css'
import Navbar from './components/Nav/Navbar'
import { BaseWidthProvider } from './context/BaseWidth'
import Providers from '../Providers'
import Analytics from './components/Analytics'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

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
        <Providers>
          <Navbar />
          <BaseWidthProvider>
            <Analytics />
            {children}
          </BaseWidthProvider>
        </Providers>
      </body>
    </html>
  )
}
