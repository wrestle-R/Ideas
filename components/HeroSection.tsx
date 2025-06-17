"use client"
import { useSession, signIn } from "next-auth/react"
import { Sparkles, Lightbulb } from "lucide-react"

export default function HeroSection() {
  const { data: session } = useSession()

  return (
    <section className="container mx-auto px-6 pt-7 text-center relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-4 left-4 w-8 h-8 rounded-full bg-black/20 blur-xl"></div>
      <div className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-black/20 blur-xl"></div>
      <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-white rounded-full"></div>
      <div className="absolute top-2/3 left-1/3 w-1 h-1 bg-white rounded-full"></div>

      <div className="relative max-w-2xl mx-auto">
        <div className="inline-block px-3 py-1 text-xs font-medium bg-black/30 text-white rounded-full border border-white/50 mb-3">
          <Sparkles className="h-3 w-3 inline mr-1" />
          Share Your Brilliance
        </div>
        
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-3 leading-tight">
          Where Great Ideas Come to Life
        </h1>
        
        <p className="text-base text-gray-300 max-w-lg mx-auto mb-6 leading-relaxed">
          A simple place to share and discover brilliant ideas from creative minds around the world.
        </p>

        {/* CTA */}
        {!session && (
          <button 
            onClick={() => signIn()}
            className="bg-white hover:bg-black hover:text-white text-black font-semibold py-2.5 px-6 rounded-lg transition-all duration-200 shadow-lg flex items-center gap-2 mx-auto border border-white hover:border-white"
          >
            <Lightbulb className="h-4 w-4" />
            Start Sharing Ideas
          </button>
        )}
      </div>
    </section>
  )
}