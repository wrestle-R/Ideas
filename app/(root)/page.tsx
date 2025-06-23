"use client"
import { useSession } from "next-auth/react"
import { useState, useEffect, useCallback } from "react"
import { getIdeasWithVotes, getTotalIdeasCount } from "@/lib/actions"
import HeroSection from "@/components/HeroSection"
import StatsSection from "@/components/StatsSection"
import IdeaCard from "@/components/IdeaCard"
import SearchComponent from "@/components/SearchCompoent"
import { useRouter } from "next/navigation"

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
  commentsCount?: number
  voteCount?: number
  userVote?: "upvote" | "downvote" | null
}

export default function Home() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [ideas, setIdeas] = useState<Idea[]>([])
  const [allIdeas, setAllIdeas] = useState<Idea[]>([]) // Store all fetched ideas
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [totalCount, setTotalCount] = useState(0)
  const [hasMore, setHasMore] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  
  const ITEMS_PER_PAGE = 24

  const fetchIdeas = useCallback(async (isLoadMore = false) => {
    try {
      if (isLoadMore) {
        setLoadingMore(true)
      } else {
        setLoading(true)
      }

      // Only fetch from server on initial load or when user changes
      if (!isLoadMore) {
        const currentUserId = session?.user?.id || session?.user?.email || undefined
        const fetchedIdeas = await getIdeasWithVotes(currentUserId)
        setAllIdeas(fetchedIdeas)
      }

      // Apply client-side filtering
      let filteredIdeas = allIdeas
      
      if (searchQuery) {
        filteredIdeas = filteredIdeas.filter(idea => 
          idea.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (idea.text && idea.text.toLowerCase().includes(searchQuery.toLowerCase()))
        )
      }
      
      if (selectedCategory) {
        filteredIdeas = filteredIdeas.filter(idea => idea.category === selectedCategory)
      }

      // Apply pagination
      const offset = isLoadMore ? ideas.length : 0
      const paginatedIdeas = filteredIdeas.slice(offset, offset + ITEMS_PER_PAGE)

      if (isLoadMore) {
        setIdeas(prev => [...prev, ...paginatedIdeas])
      } else {
        setIdeas(paginatedIdeas)
      }

      setTotalCount(filteredIdeas.length)
      setHasMore((isLoadMore ? ideas.length : 0) + paginatedIdeas.length < filteredIdeas.length)
    } catch (err) {
      setError("Failed to load ideas. Please try again later.")
      console.error("Error fetching ideas:", err)
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }, [searchQuery, selectedCategory, ideas.length, session?.user, allIdeas])

  // Initial load - fetch all ideas
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true)
        const currentUserId = session?.user?.id || session?.user?.email || undefined
        const fetchedIdeas = await getIdeasWithVotes(currentUserId)
        setAllIdeas(fetchedIdeas)
        
        // Apply initial pagination
        const initialIdeas = fetchedIdeas.slice(0, ITEMS_PER_PAGE)
        setIdeas(initialIdeas)
        setTotalCount(fetchedIdeas.length)
        setHasMore(initialIdeas.length < fetchedIdeas.length)
      } catch (err) {
        setError("Failed to load ideas. Please try again later.")
        console.error("Error fetching ideas:", err)
      } finally {
        setLoading(false)
      }
    }

    if (status !== 'loading') {
      loadInitialData()
    }
  }, [session?.user, status])

  // Filter and paginate when search/category changes
  useEffect(() => {
    if (allIdeas.length > 0) {
      let filteredIdeas = allIdeas
      
      if (searchQuery) {
        filteredIdeas = filteredIdeas.filter(idea => 
          idea.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (idea.text && idea.text.toLowerCase().includes(searchQuery.toLowerCase()))
        )
      }
      
      if (selectedCategory) {
        filteredIdeas = filteredIdeas.filter(idea => idea.category === selectedCategory)
      }

      const paginatedIdeas = filteredIdeas.slice(0, ITEMS_PER_PAGE)
      setIdeas(paginatedIdeas)
      setTotalCount(filteredIdeas.length)
      setHasMore(paginatedIdeas.length < filteredIdeas.length)
    }
  }, [searchQuery, selectedCategory, allIdeas])

  useEffect(() => {
    // If you want to protect this page:
    // if (status === "unauthenticated") {
    //   router.replace("/api/auth/signin")
    // }
  }, [status, router])

  const handleSearchChange = (query: string) => {
    setSearchQuery(query)
  }

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
  }

  const loadMoreIdeas = async () => {
    let filteredIdeas = allIdeas
    
    if (searchQuery) {
      filteredIdeas = filteredIdeas.filter(idea => 
        idea.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (idea.text && idea.text.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }
    
    if (selectedCategory) {
      filteredIdeas = filteredIdeas.filter(idea => idea.category === selectedCategory)
    }

    const offset = ideas.length
    const moreIdeas = filteredIdeas.slice(offset, offset + ITEMS_PER_PAGE)
    
    setIdeas(prev => [...prev, ...moreIdeas])
    setHasMore(ideas.length + moreIdeas.length < filteredIdeas.length)
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <HeroSection />
      
      {/* Stats Section */}
      <StatsSection />

      {/* Search Section */}
      <section className="container mx-auto px-6 py-6">
        <SearchComponent 
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
        />
      </section>

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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {ideas.map((idea) => (
                <IdeaCard
                  key={idea._id}
                  idea={idea}
                  currentUser={session?.user ? { id: session.user.id || session.user.email || '', name: session.user.name || '' } : undefined}
                />
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