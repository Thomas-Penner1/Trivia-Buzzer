import { Inter } from 'next/font/google'

import "./globals.css"
import { GameProvider } from '@/context/GameContext'
import { AppNotificationProvider } from '@/context/AppNotificationContext'
import DisplayAppNotification from '@/components/AppNotification/DisplayAppNotification'

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
        <AppNotificationProvider>
            <html lang="en">
                <body className={inter.className}>
                    <main>
                        {children}
                    </main>

                    <DisplayAppNotification/>
                </body>
            </html>
        </AppNotificationProvider>
    </GameProvider>
  )
}
