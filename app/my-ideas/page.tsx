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
      <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-800 opacity-50 -z-10"></div>
      
    <div className="relative z-0 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-4">
          My Ideas
        </h1>
        <p className="text-gray-400 text-lg mb-8">
          Manage and edit your creative concepts
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          
          <Link 
            href="/idea/create"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            ✨ Create New Idea
          </Link>
        </div>
        </div>

          {error && (
            <div className="bg-red-900/50 border border-red-700 rounded-xl p-4 mb-8">
              <p className="text-red-200">{error}</p>
            </div>
          )}

          {ideas.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-6">💡</div>
              <h2 className="text-2xl font-semibold text-gray-300 mb-4">No ideas yet</h2>
              <p className="text-gray-400 mb-8">Start creating your first idea to see it here!</p>
              <Link 
                href="/idea/create"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-medium"
              >
                Create Your First Idea
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ideas.map((idea) => (
                <div key={idea._id} className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 hover:border-gray-600 transition-all duration-300 group">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-gray-200 transition-colors">
                        {idea.title}
                      </h3>
                      {idea.category && (
                        <span className="inline-block px-3 py-1 bg-blue-600/20 text-blue-300 text-xs rounded-full border border-blue-600/30">
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
                      className="inline-flex items-center px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white text-sm rounded-lg transition-all duration-300 border border-gray-600 hover:border-gray-500"
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