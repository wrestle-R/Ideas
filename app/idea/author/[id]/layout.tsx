"use client"
import { SessionProvider } from "next-auth/react"
import Navbar from "../../../../components/Navbar"
import React from "react"

export default function CreateIdeaLayout({ children }: React.PropsWithChildren) {
  return (
    <SessionProvider>
      <div className="min-h-screen relative">
        <div className="relative z-50">
          <Navbar />
        </div>
        <main className="relative z-10">
          {children}
        </main>
      </div>
    </SessionProvider>
  )
}