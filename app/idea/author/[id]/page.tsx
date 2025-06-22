"use client"
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { getIdeasByAuthor, getAuthorIdeasCount, getAuthorInfo } from '@/lib/sanity'
import { getUserBio } from '@/lib/actions'
import { Calendar, User, ArrowLeft, ExternalLink, Github, Lightbulb } from 'lucide-react'
import Link from 'next/link'
import AuthorIdeaCard from '@/components/AuthorIdeaCard'

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
  body?: any[]
  text?: string
}

interface Author {
  id: string
  name: string
  bio?: string
}

export default function AuthorPage() {
  const params = useParams()
  const [ideas, setIdeas] = useState<Idea[]>([])
  const [author, setAuthor] = useState<Author | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [totalCount, setTotalCount] = useState(0)
  const [hasMore, setHasMore] = useState(false)
  
  const ITEMS_PER_PAGE = 12

  useEffect(() => {
    async function fetchAuthorData() {
      try {
        setLoading(true)
        
        // Handle params safely
        if (!params?.id) {
          setError("Invalid author ID")
          return
        }
        
        const authorId = Array.isArray(params.id) ? params.id[0] : params.id
        
        const [fetchedIdeas, total, authorInfo, bioData] = await Promise.all([
          getIdeasByAuthor(authorId, ITEMS_PER_PAGE, 0),
          getAuthorIdeasCount(authorId),
          getAuthorInfo(authorId),
          getUserBio(authorId)
        ])
        
        // Log what we can fetch for this user
        console.log("Fetched for user:", {
          authorId,
          authorInfo,
          bio: bioData,
          totalIdeas: total,
          ideas: fetchedIdeas
        })
        
        if (!authorInfo) {
          setError("Author not found")
        } else {
          setIdeas(fetchedIdeas)
          setTotalCount(total)
          setAuthor({
            ...authorInfo,
            bio: bioData?.bio || undefined
          })
          setHasMore(fetchedIdeas.length < total)
        }
      } catch (err) {
        setError("Failed to load author data. Please try again later.")
        console.error("Error fetching author data:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchAuthorData()
  }, [params])

  const loadMoreIdeas = async () => {
    try {
      setLoadingMore(true)
      
      // Handle params safely for load more
      if (!params?.id) {
        console.error("No author ID available")
        return
      }
      
      const authorId = Array.isArray(params.id) ? params.id[0] : params.id
      const newIdeas = await getIdeasByAuthor(authorId, ITEMS_PER_PAGE, ideas.length)
      
      setIdeas(prev => [...prev, ...newIdeas])
      setHasMore(ideas.length + newIdeas.length < totalCount)
    } catch (err) {
      console.error("Error loading more ideas:", err)
    } finally {
      setLoadingMore(false)
    }
  }

  const getGithubUrl = (authorId: string) => {
    // If authorId is a GitHub ID (numeric), construct GitHub URL
    if (/^\d+$/.test(authorId)) {
      return `https://github.com/user/${authorId}`
    }
    // If it's an email or other format, try to extract username
    return null
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          <p className="text-white mt-4">Loading author...</p>
        </div>
      </div>
    )
  }

  if (error || !author) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <Link 
            href="/"
            className="px-4 py-2 border border-white/50 text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    )
  }

  const githubUrl = getGithubUrl(author.id)

  return (
    <div className="min-h-screen bg-black text-white pt-1">
      <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-800 opacity-50 -z-10"></div>
      
      <div className="relative z-0 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Back Button */}
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Ideas
          </Link>

          {/* Author Header */}
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 shadow-2xl mb-8">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <User className="h-8 w-8 text-gray-400" />
                  <h1 className="text-3xl md:text-4xl font-bold text-white">
                    {author.name}
                  </h1>
                </div>
                
                {author.bio && (
                  <p className="text-gray-300 text-lg mb-6 leading-relaxed">
                    {author.bio}
                  </p>
                )}
                
                <div className="flex flex-wrap items-center gap-6 text-gray-300">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{totalCount} idea{totalCount !== 1 ? 's' : ''} shared</span>
                  </div>
                  
                  {githubUrl && (
                    <a 
                      href={githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      <Github className="h-4 w-4" />
                      <span>View GitHub Profile</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Ideas Grid */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-6">
              <Lightbulb className="h-6 w-6 text-yellow-400" />
              <h2 className="text-2xl font-semibold text-white">
                Ideas by {author.name}
              </h2>
              <span className="bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-sm">
                {totalCount} total
              </span>
            </div>
            
            {ideas.length === 0 ? (
              <div className="text-center py-16">
                <Lightbulb className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 text-lg">No ideas shared yet.</p>
                <p className="text-gray-500 text-sm mt-2">Check back later for new ideas!</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {ideas.map((idea) => (
                    <AuthorIdeaCard key={idea._id} idea={idea} />
                  ))}
                </div>

                {/* Load More Button */}
                {hasMore && (
                  <div className="text-center mt-12">
                    <button 
                      onClick={loadMoreIdeas}
                      disabled={loadingMore}
                      className="border border-white/50 text-white hover:bg-white/20 hover:border-white font-semibold py-3 px-8 rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loadingMore ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Loading more ideas...
                        </div>
                      ) : (
                        "Load More Ideas"
                      )}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}