"use client"
import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { getIdeasByAuthor } from "@/lib/sanity"
import Link from "next/link"

interface Idea {
  _id: string
  title: string
  slug: { current: string }
  category: string
  notes: string
  publishedAt: string
  author: { id: string; name: string }
  text: string
}

export default function MyIdeasPage() {
  const { data: session, status } = useSession()
  const [ideas, setIdeas] = useState<Idea[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMyIdeas = async () => {
      if (session?.user) {
        try {
          const authorId = (session.user as any).githubId?.toString() || session.user.email || ''
          const userIdeas = await getIdeasByAuthor(authorId)
          setIdeas(userIdeas)
        } catch (err) {
          console.error('Error fetching ideas:', err)
          setError('Failed to load your ideas')
        } finally {
          setLoading(false)
        }
      }
    }

    if (status === 'authenticated') {
      fetchMyIdeas()
    } else if (status === 'unauthenticated') {
      setLoading(false)
    }
  }, [session, status])

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading your ideas...</p>
        </div>
      </div>
    )
  }

  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please sign in to view your ideas</h1>
          <Link href="/api/auth/signin" className="text-blue-400 hover:text-blue-300">
            Sign In
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white pt-3">
      <div className="fixed inset-0 bg-gradient-to-br from-black via-gray-900 to-gray-800 opacity-60 -z-10"></div>
      
    <div className="relative z-0 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-white mb-4">
          My Ideas
        </h1>
        <p className="text-gray-400 text-lg mb-8">
          Manage and edit your creative concepts
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link 
            href="/idea/create"
            className="inline-flex items-center px-6 py-3 border border-gray-700 text-gray-300 bg-black/60 rounded-xl hover:bg-gray-900 hover:text-white transition-all duration-300 font-medium shadow hover:shadow-lg"
          >
            ✨ Create New Idea
          </Link>
        </div>
        </div>

          {error && (
            <div className="bg-gray-900/60 border border-gray-700 rounded-xl p-4 mb-8">
              <p className="text-gray-300">{error}</p>
            </div>
          )}

          {ideas.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-6">💡</div>
              <h2 className="text-2xl font-semibold text-gray-300 mb-4">No ideas yet</h2>
              <p className="text-gray-400 mb-8">Start creating your first idea to see it here!</p>
              <Link 
                href="/idea/create"
                className="inline-flex items-center px-6 py-3 border border-gray-700 text-gray-300 bg-black/60 rounded-xl hover:bg-gray-900 hover:text-white transition-all duration-300 font-medium"
              >
                Create Your First Idea
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ideas.map((idea) => (
                <div key={idea._id} className="bg-black/70 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 hover:border-gray-500 transition-all duration-300 group">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-gray-200 transition-colors">
                        {idea.title}
                      </h3>
                      {idea.category && (
                        <span className="inline-block px-3 py-1 bg-gray-800/60 text-gray-400 text-xs rounded-full border border-gray-700">
                          {idea.category}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                    {idea.text || 'No description available'}
                  </p>
                  
                  {idea.notes && (
                    <p className="text-gray-400 text-xs mb-4 line-clamp-2">
                      Notes: {idea.notes}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 text-xs">
                      {new Date(idea.publishedAt).toLocaleDateString()}
                    </span>
                    <Link
                      href={`/my-ideas/edit?id=${idea._id}`}
                      className="inline-flex items-center px-4 py-2 border border-gray-700 bg-black/60 hover:bg-gray-900 text-gray-300 hover:text-white text-sm rounded-lg transition-all duration-300"
                    >
                      ✏️ Edit
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}