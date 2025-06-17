"use client"
import { SessionProvider } from "next-auth/react"
import "../../globals.css"
import React from "react"

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