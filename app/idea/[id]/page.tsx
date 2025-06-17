"use client"
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { getIdeaById } from '@/lib/sanity'
import { Calendar, User, Heart, MessageCircle, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

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
  body: any[]
}

export default function IdeaPage() {
  const params = useParams()
  const [idea, setIdea] = useState<Idea | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchIdea() {
      try {
        setLoading(true)
        
        // Handle params safely
        if (!params?.id) {
          setError("Invalid idea ID")
          return
        }
        
        const id = Array.isArray(params.id) ? params.id[0] : params.id
        const fetchedIdea = await getIdeaById(id)
        
        if (!fetchedIdea) {
          setError("Idea not found")
        } else {
          setIdea(fetchedIdea)
        }
      } catch (err) {
        setError("Failed to load idea. Please try again later.")
        console.error("Error fetching idea:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchIdea()
  }, [params])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      technology: "bg-blue-500/20 text-blue-300 border-blue-500/30",
      business: "bg-green-500/20 text-green-300 border-green-500/30",
      creative: "bg-purple-500/20 text-purple-300 border-purple-500/30",
      health: "bg-red-500/20 text-red-300 border-red-500/30",
      education: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
      entertainment: "bg-pink-500/20 text-pink-300 border-pink-500/30",
      other: "bg-gray-500/20 text-gray-300 border-gray-500/30"
    }
    return colors[category] || colors.other
  }

  // Simple markdown parser for notes
  const parseMarkdown = (text: string) => {
    let html = text
      // Headers - only match when # is followed by a space
      .replace(/^### (.+$)/gim, '<h3 class="text-lg font-semibold text-white mb-2 mt-4">$1</h3>')
      .replace(/^## (.+$)/gim, '<h2 class="text-xl font-semibold text-white mb-3 mt-5">$1</h2>')
      .replace(/^# (.+$)/gim, '<h1 class="text-2xl font-bold text-white mb-2 mt-3">$1</h1>')
      // Bold and italic
      .replace(/\*\*\*(.*?)\*\*\*/gim, '<strong class="font-bold text-white"><em class="italic">$1</em></strong>')
      .replace(/\*\*(.*?)\*\*/gim, '<strong class="font-bold text-white">$1</strong>')
      .replace(/\*(.*?)\*/gim, '<em class="italic text-gray-200">$1</em>')
      // Code blocks
      .replace(/```([\s\S]*?)```/gim, '<pre class="bg-gray-800 border border-gray-600 rounded-lg p-4 my-3 overflow-x-auto"><code class="text-green-400 text-sm">$1</code></pre>')
      .replace(/`([^`]*)`/gim, '<code class="bg-gray-700 text-green-400 px-2 py-1 rounded text-sm">$1</code>')
      // Links
      .replace(/\[([^\]]*)\]\(([^\)]*)\)/gim, '<a href="$2" class="text-blue-400 hover:text-blue-300 underline" target="_blank" rel="noopener noreferrer">$1</a>')
      // Lists - only match when - is followed by a space
      .replace(/^- (.+$)/gim, '<li class="text-gray-200 ml-4 mb-1">• $1</li>')
      .replace(/^\* (.+$)/gim, '<li class="text-gray-200 ml-4 mb-1">• $1</li>')
      .replace(/^\+ (.+$)/gim, '<li class="text-gray-200 ml-4 mb-1">• $1</li>')
      // Line breaks
      .replace(/\n/gim, '<br>')

    return html
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          <p className="text-white mt-4">Loading idea...</p>
        </div>
      </div>
    )
  }

  if (error || !idea) {
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

  return (
    <div className="min-h-screen bg-black text-white pt-16">
      <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-800 opacity-50 -z-10"></div>
      
      <div className="relative z-0 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Ideas
          </Link>

          {/* Idea Content */}
          <article className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 shadow-2xl">
            {/* Category Badge */}
            {idea.category && (
              <div className={`inline-block px-3 py-1.5 text-sm rounded-full border mb-6 ${getCategoryColor(idea.category)}`}>
                {idea.category.charAt(0).toUpperCase() + idea.category.slice(1)}
              </div>
            )}

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              {idea.title}
            </h1>

            {/* Author and Date */}
            <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-700">
              <div className="flex items-center gap-2 text-gray-300">
                <User className="h-5 w-5" />
                <span className="font-medium">{idea.author?.name || "Anonymous"}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <Calendar className="h-5 w-5" />
                <span>{formatDate(idea.publishedAt)}</span>
              </div>
            </div>

            {/* Description */}
            <div className="prose prose-lg prose-invert max-w-none mb-8">
              <p className="text-gray-200 text-lg leading-relaxed">
                {idea.text || "No description available"}
              </p>
            </div>

            {/* Notes Section */}
            {idea.notes && idea.notes.trim() && (
              <div className="mt-8 pt-8 border-t border-gray-700">
                <h2 className="text-2xl font-semibold text-white mb-4">Additional Notes</h2>
                <div className="bg-gray-800/50 border border-gray-600 rounded-xl p-6">
                  <div 
                    className="prose prose-invert max-w-none text-gray-200 text-sm leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: parseMarkdown(idea.notes) }}
                  />
                </div>
              </div>
            )}

            {/* Engagement Section */}
            <div className="flex items-center justify-between pt-8 mt-8 border-t border-gray-700">
              <div className="flex items-center gap-6">
                <button className="flex items-center gap-2 text-gray-400 hover:text-red-400 transition-colors">
                  <Heart className="h-5 w-5" />
                  <span>Like</span>
                </button>
                <button className="flex items-center gap-2 text-gray-400 hover:text-blue-400 transition-colors">
                  <MessageCircle className="h-5 w-5" />
                  <span>Comment</span>
                </button>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span>0 likes</span>
                <span>•</span>
                <span>0 comments</span>
              </div>
            </div>
          </article>
        </div>
      </div>
    </div>
  )
}