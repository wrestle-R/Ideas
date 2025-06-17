"use client"
import { SessionProvider } from "next-auth/react"
import React from "react"
import "./globals.css"

export default function RootLayout({ children }: React.PropsWithChildren) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  )
}