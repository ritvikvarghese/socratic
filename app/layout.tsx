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
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-192x192.png', sizes: '192x192', type: 'image/png' },
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
