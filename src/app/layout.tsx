import type { Metadata } from 'next'
import './globals.css'
import Navbar from './components/Nav/Navbar'
import { BaseWidthProvider } from './context/BaseWidth'

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
        <Navbar />
        <BaseWidthProvider>
          {children}
        </BaseWidthProvider>
      </body>
    </html>
  )
}
