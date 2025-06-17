"use client"
import { useState, useEffect } from "react"
import { getTotalIdeasCount } from "@/lib/sanity"

export default function StatsSection() {
  const [totalIdeas, setTotalIdeas] = useState(1247) // Default fallback

  useEffect(() => {
    async function fetchStats() {
      try {
        const count = await getTotalIdeasCount()
        setTotalIdeas(count)
      } catch (error) {
        console.error("Error fetching stats:", error)
      }
    }
    
    fetchStats()
  }, [])

  return (
    <section className="container mx-auto px-6 p">
      <div className="flex justify-center items-center gap-8 text-sm">
        <div className="text-center">
          <div className="text-2xl font-bold text-white">{totalIdeas.toLocaleString()}</div>
          <div className="text-gray-300">Ideas Shared</div>
        </div>
        <div className="w-px h-8 bg-white/30"></div>
        <div className="text-center">
          <div className="text-2xl font-bold text-white">892</div>
          <div className="text-gray-300">Creative Minds</div>
        </div>
        <div className="w-px h-8 bg-white/30"></div>
        <div className="text-center">
          <div className="text-2xl font-bold text-white">3.2k</div>
          <div className="text-gray-300">Collaborations</div>
        </div>
      </div>
    </section>
  )
}
