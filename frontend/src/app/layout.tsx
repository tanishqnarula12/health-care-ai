import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import GoogleTranslate from '../components/GoogleTranslate'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Lumina Health AI',
  description: 'Proactive healthcare through AI',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#F8FAFC] text-[#1E293B]`}>
        <GoogleTranslate />
        {children}
      </body>
    </html>
  )
}
