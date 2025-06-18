"use client"
import { SessionProvider } from "next-auth/react"
import Navbar from "../../../components/Navbar"
import React, { Suspense } from "react"

export default function CreateIdeaLayout({ children }: React.PropsWithChildren) {
  return (
    <SessionProvider>
      <div className="min-h-screen relative">
        <div className="relative z-50">
          <Navbar />
        </div>
        <main className="relative z-10">
          <Suspense fallback={<div className="text-white p-8">Loading...</div>}>
            {children}
          </Suspense>
        </main>
      </div>
    </SessionProvider>
  )
}