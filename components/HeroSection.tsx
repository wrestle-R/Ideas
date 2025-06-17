"use client"
import { useSession, signIn } from "next-auth/react"
import { Sparkles, Lightbulb, Plus } from "lucide-react"
import Link from "next/link"

export default function HeroSection() {
  const { data: session } = useSession()

  return (
    <section className="container mx-auto px-6 py-6 text-center relative overflow-hidden">
      {/* Simplified background elements */}
      <div className="absolute top-3 left-3 w-8 h-8 rounded-full bg-white/5 blur-xl"></div>
      <div className="absolute bottom-3 right-3 w-10 h-10 rounded-full bg-white/5 blur-xl"></div>
      <div className="absolute top-1/4 right-1/3 w-1 h-1 bg-white/30 rounded-full"></div>
      <div className="absolute bottom-1/3 left-1/4 w-1 h-1 bg-white/20 rounded-full"></div>

      <div className="relative max-w-3xl mx-auto">
        {/* Compact badge */}
        <div className="inline-flex items-center px-2.5 py-1 text-xs font-medium bg-black/30 text-white rounded-full border border-white/30 mb-3 backdrop-blur-sm">
          <Sparkles className="h-3 w-3 mr-1.5" />
          Share Your Brilliance
        </div>
        
        {/* Smaller heading */}
        <h1 className="text-2xl md:text-5xl font-bold text-white mb-2 leading-tight">
          Where Great Ideas Come to Life
        </h1>
        
        {/* Compact subtitle */}
        <p className="text-sm md:text-base text-gray-300 max-w-2xl mx-auto mb-4 leading-relaxed">
          A simple place to share and discover brilliant ideas from creative minds.
        </p>

        {/* Compact CTA Button */}
        <div className="flex justify-center">
          {!session ? (
            <button 
              onClick={() => signIn()}
              className="bg-white hover:bg-black hover:text-white text-black font-medium py-2 px-5 rounded-lg transition-all duration-200 shadow-lg flex items-center gap-2 border border-white text-sm"
            >
              <Lightbulb className="h-3.5 w-3.5" />
              Start Sharing Ideas
            </button>
          ) : (
            <Link 
              href="/idea/create"
              className="bg-black hover:bg-white hover:text-black text-white font-medium py-2 px-5 rounded-lg transition-all duration-200 shadow-lg flex items-center gap-2 border border-white text-sm"
            >
              <Plus className="h-3.5 w-3.5" />
              Create New Idea
            </Link>
          )}
        </div>
      </div>
    </section>
  )
}