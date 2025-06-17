"use client"
import { useSession, signIn } from "next-auth/react"
import { Sparkles, Lightbulb } from "lucide-react"
import SearchComponent from "./SearchCompoent"

export default function HeroSection() {
  const { data: session } = useSession()

  return (
    <section className="container mx-auto px-6 py-12 text-center relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-6 left-6 w-10 h-10 rounded-full bg-black/20 blur-xl"></div>
      <div className="absolute bottom-6 right-6 w-12 h-12 rounded-full bg-black/20 blur-xl"></div>
      <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-white rounded-full"></div>
      <div className="absolute top-2/3 left-1/3 w-1 h-1 bg-white rounded-full"></div>

      <div className="relative max-w-3xl mx-auto">
        <div className="inline-block px-3 py-1 text-xs font-medium bg-black/30 text-white rounded-full border border-white/50 mb-4">
          <Sparkles className="h-3 w-3 inline mr-1" />
          Share Your Brilliance
        </div>
        
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
          Where Great Ideas
          <br />
          <span className="text-white">Come to Life</span>
        </h2>
        
        <p className="text-lg text-white max-w-xl mx-auto mb-6 leading-relaxed">
          A simple place to share and discover brilliant ideas from creative minds around the world. 
          Turn your thoughts into inspiration for others.
        </p>

        <SearchComponent/>

        {/* Stats */}
        <div className="flex justify-center items-center gap-6 mb-6 text-sm">
          <div className="text-center">
            <div className="text-xl font-bold text-white">1,247</div>
            <div className="text-white">Ideas Shared</div>
          </div>
          <div className="w-px h-6 bg-white/30"></div>
          <div className="text-center">
            <div className="text-xl font-bold text-white">892</div>
            <div className="text-white">Creative Minds</div>
          </div>
          <div className="w-px h-6 bg-white/30"></div>
          <div className="text-center">
            <div className="text-xl font-bold text-white">3.2k</div>
            <div className="text-white">Collaborations</div>
          </div>
        </div>

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
