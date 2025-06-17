"use client"
import { SessionProvider } from "next-auth/react"
import Navbar from "../../../components/Navbar"
import React from "react"

export default function RootLayout({ children }: React.PropsWithChildren) {
  return (
        <SessionProvider>
          <Navbar />
          {children}
        </SessionProvider>
  )
}