import type { Metadata } from 'next'
import { Inter, Cormorant_Garamond } from 'next/font/google'
import { PasscodeGate } from '@/components/examined/PasscodeGate'
import './globals.css'

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter',
});

const cormorant = Cormorant_Garamond({ 
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: '--font-cormorant',
});

export const metadata: Metadata = {
  title: 'Socratic - Thoughtful Debate Tool',
  description: 'A thoughtful space for Socratic dialogue and deep inquiry',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${cormorant.variable} font-sans antialiased`}>
        <PasscodeGate>
          {children}
        </PasscodeGate>
      </body>
    </html>
  )
}
