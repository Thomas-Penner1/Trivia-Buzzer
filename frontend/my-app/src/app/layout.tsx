import { Inter } from 'next/font/google'

import "./globals.css"
import { GameProvider } from '@/context/GameContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Trivia Buzzer',
  description: 'A trivia buzzer for in person trivia',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <GameProvider>
        <html lang="en">
            <body className={inter.className}>
                {children}
            </body>
        </html>
    </GameProvider>
  )
}
