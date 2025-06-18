"use client"
import { useState, useEffect } from "react"
import { getTotalIdeasCount, client } from "@/lib/sanity"

export default function StatsSection() {
  const [totalIdeas, setTotalIdeas] = useState(1247) // Default fallback
  const [creativeMinds, setCreativeMinds] = useState(0)

  useEffect(() => {
    async function fetchStats() {
      try {
        const count = await getTotalIdeasCount()
        setTotalIdeas(count)
        // Count unique authors who have posted at least one idea
        const query = 'count(array::unique(*[_type == "idea" && defined(author.id)].author.id))'
        const minds = await client.fetch(query)
        setCreativeMinds(minds)
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
          <div className="text-2xl font-bold text-white">{creativeMinds.toLocaleString()}</div>
          <div className="text-gray-300">Creative Minds</div>
        </div>
      </div>
    </section>
  )
}
