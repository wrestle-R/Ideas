"use client"
import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"
import { getIdeas, getTotalIdeasCount } from "@/lib/sanity"
import HeroSection from "@/components/HeroSection"
import IdeaCard from "@/components/IdeaCard"

interface Idea {
  _id: string
  title: string
  slug: { current: string }
  category: string
  notes?: string
  publishedAt: string
  author: {
    id: string
    name: string
  }
  text?: string
}

export default function Home() {
  const { data: session } = useSession()
  const [ideas, setIdeas] = useState<Idea[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [totalCount, setTotalCount] = useState(0)
  const [hasMore, setHasMore] = useState(false)
  
  const ITEMS_PER_PAGE = 12

  useEffect(() => {
    async function fetchInitialData() {
      try {
        setLoading(true)
        const [fetchedIdeas, total] = await Promise.all([
          getIdeas(ITEMS_PER_PAGE, 0),
          getTotalIdeasCount()
        ])
        
        setIdeas(fetchedIdeas)
        setTotalCount(total)
        setHasMore(fetchedIdeas.length >= ITEMS_PER_PAGE && fetchedIdeas.length < total)
      } catch (err) {
        setError("Failed to load ideas. Please try again later.")
        console.error("Error fetching ideas:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchInitialData()
  }, [])

  const loadMoreIdeas = async () => {
    try {
      setLoadingMore(true)
      const newIdeas = await getIdeas(ITEMS_PER_PAGE, ideas.length)
      
      setIdeas(prev => [...prev, ...newIdeas])
      setHasMore(ideas.length + newIdeas.length < totalCount)
    } catch (err) {
      console.error("Error loading more ideas:", err)
    } finally {
      setLoadingMore(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <HeroSection />

      {/* Ideas Grid */}
      <main className="container mx-auto px-6 pb-8">
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <p className="text-white mt-4">Loading brilliant ideas...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-12">
            <p className="text-red-400 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 border border-white/50 text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && ideas.length === 0 && (
          <div className="text-center py-12">
            <p className="text-white mb-4">No ideas found. Be the first to share your brilliant idea!</p>
          </div>
        )}

        {!loading && !error && ideas.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ideas.map((idea) => (
                <IdeaCard key={idea._id} idea={idea} />
              ))}
            </div>

            {/* Load More Button - only show if we have 4+ rows (12+ items) and there are more items */}
            {hasMore && ideas.length >= ITEMS_PER_PAGE && (
              <div className="text-center mt-12">
                <button 
                  onClick={loadMoreIdeas}
                  disabled={loadingMore}
                  className="border border-white/50 text-white hover:bg-white/20 hover:border-white font-semibold py-3 px-8 rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loadingMore ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Loading...
                    </div>
                  ) : (
                    "Load More Ideas"
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}