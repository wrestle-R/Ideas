"use client"
import { SessionProvider } from "next-auth/react"
import React, { Suspense } from "react"

export default function CreateIdeaLayout({ children }: React.PropsWithChildren) {
  return (
    <SessionProvider>
      <div className="min-h-screen relative">
        <main className="relative z-10">
          <Suspense fallback={<div className="text-white p-8">Loading...</div>}>
            {children}
          </Suspense>
        </main>
      </div>
    </SessionProvider>
  )
}