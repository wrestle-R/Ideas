"use client"
import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useSearchParams, useRouter } from "next/navigation"
import { getIdeaById } from "@/lib/sanity"
import { updateIdea } from "@/lib/actions"
import Link from "next/link"

interface FormData {
  title: string
  description: string
  category: string
  notes: string
}

interface Idea {
  _id: string
  title: string
  category: string
  notes: string
  author: { id: string; name: string }
  body: any[]
}

export default function EditIdeaPage() {
  const { data: session, status } = useSession()
  const searchParams = useSearchParams()
  const router = useRouter()
  const ideaId = searchParams?.get('id')
  
  const [idea, setIdea] = useState<Idea | null>(null)
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    category: "",
    notes: ""
  })

  useEffect(() => {
    const fetchIdea = async () => {
      if (!ideaId) {
        setError('No idea ID provided')
        setLoading(false)
        return
      }

      try {
        const fetchedIdea = await getIdeaById(ideaId)
        if (!fetchedIdea) {
          setError('Idea not found')
          setLoading(false)
          return
        }

        // Check if user owns this idea
        const authorId = (session?.user as any)?.githubId?.toString() || session?.user?.email || ''
        if (fetchedIdea.author.id !== authorId) {
          setError('You can only edit your own ideas')
          setLoading(false)
          return
        }

        setIdea(fetchedIdea)
        setFormData({
          title: fetchedIdea.title,
          description: fetchedIdea.body?.[0]?.children?.[0]?.text || '',
          category: fetchedIdea.category || '',
          notes: fetchedIdea.notes || ''
        })
      } catch (err) {
        console.error('Error fetching idea:', err)
        setError('Failed to load idea')
      } finally {
        setLoading(false)
      }
    }

    if (status === 'authenticated' && ideaId) {
      fetchIdea()
    } else if (status === 'unauthenticated') {
      setLoading(false)
    }
  }, [ideaId, session, status])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!idea) return

    setIsSubmitting(true)
    
    try {
      const result = await updateIdea(idea._id, formData)
      
      if (result.error) {
        alert(result.error)
      } else {
        alert("Idea updated successfully!")
        router.push('/my-ideas')
      }
      
    } catch (error) {
      console.error("Error updating idea:", error)
      alert("Failed to update idea. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const parseMarkdown = (text: string) => {
    let html = text
      .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold text-white mb-2 mt-4">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-xl font-semibold text-white mb-3 mt-5">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold text-white mb-4 mt-6">$1</h1>')
      .replace(/\*\*\*(.*)\*\*\*/gim, '<strong class="font-bold text-white"><em class="italic">$1</em></strong>')
      .replace(/\*\*(.*)\*\*/gim, '<strong class="font-bold text-white">$1</strong>')
      .replace(/\*(.*)\*/gim, '<em class="italic text-gray-200">$1</em>')
      .replace(/```([\s\S]*?)```/gim, '<pre class="bg-gray-800 border border-gray-600 rounded-lg p-4 my-3 overflow-x-auto"><code class="text-green-400 text-sm">$1</code></pre>')
      .replace(/`([^`]*)`/gim, '<code class="bg-gray-700 text-green-400 px-2 py-1 rounded text-sm">$1</code>')
      .replace(/\[([^\]]*)\]\(([^\)]*)\)/gim, '<a href="$2" class="text-blue-400 hover:text-blue-300 underline" target="_blank" rel="noopener noreferrer">$1</a>')
      .replace(/^\- (.*$)/gim, '<li class="text-gray-200 ml-4">• $1</li>')
      .replace(/^\* (.*$)/gim, '<li class="text-gray-200 ml-4">• $1</li>')
      .replace(/^\+ (.*$)/gim, '<li class="text-gray-200 ml-4">• $1</li>')
      .replace(/\n/gim, '<br>')

    return html
  }

  // useEffect(() => {
  //   if (status === "unauthenticated") {
  //     router.push("/auth/signin")
  //   }
  // }, [status, router])

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading idea...</p>
        </div>
      </div>
    )
  }

  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please sign in to edit ideas</h1>
          <Link href="/api/auth/signin" className="text-blue-400 hover:text-blue-300">
            Sign In
          </Link>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 text-red-400">{error}</h1>
          <Link href="/my-ideas" className="text-blue-400 hover:text-blue-300">
            Back to My Ideas
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white pt-3">
      <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-800 opacity-50 -z-10"></div>
      
      <div className="relative z-0 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-4">
              Edit Idea
            </h1>
            <p className="text-gray-400 text-lg">
              Update your creative concept
            </p>
          </div>

          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* ...existing form fields from create page... */}
              <div className="group">
                <label htmlFor="title" className="block text-sm font-semibold text-gray-200 mb-3">
                  Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-800/80 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 group-hover:border-gray-500"
                  placeholder="Enter your brilliant idea..."
                />
              </div>

              <div className="group">
                <label htmlFor="description" className="block text-sm font-semibold text-gray-200 mb-3">
                  Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  required
                  rows={5}
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-800/80 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 resize-none group-hover:border-gray-500"
                  placeholder="Describe your idea in detail. What makes it special?"
                />
              </div>

              <div className="group">
                <label htmlFor="category" className="block text-sm font-semibold text-gray-200 mb-3">
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-800/80 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 group-hover:border-gray-500"
                >
                  <option value="" className="bg-gray-800">Select a category...</option>
                  <option value="technology" className="bg-gray-800">Technology</option>
                  <option value="business" className="bg-gray-800">Business</option>
                  <option value="creative" className="bg-gray-800">Creative</option>
                  <option value="health" className="bg-gray-800">Health</option>
                  <option value="education" className="bg-gray-800">Education</option>
                  <option value="entertainment" className="bg-gray-800">Entertainment</option>
                  <option value="other" className="bg-gray-800">Other</option>
                </select>
              </div>

              <div className="group">
                <div className="flex items-center justify-between mb-3">
                  <label htmlFor="notes" className="block text-sm font-semibold text-gray-200">
                    Notes <span className="text-gray-500 text-xs font-normal">• markdown supported</span>
                  </label>
                  <div className="flex items-center bg-gray-800 rounded-lg p-1">
                    <button
                      type="button"
                      onClick={() => setIsPreviewMode(false)}
                      className={`px-3 py-1 text-xs rounded-md transition-all duration-200 ${
                        !isPreviewMode 
                          ? 'bg-blue-600 text-white shadow-md' 
                          : 'text-gray-400 hover:text-gray-200'
                      }`}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsPreviewMode(true)}
                      className={`px-3 py-1 text-xs rounded-md transition-all duration-200 ${
                        isPreviewMode 
                          ? 'bg-blue-600 text-white shadow-md' 
                          : 'text-gray-400 hover:text-gray-200'
                      }`}
                    >
                      👁️ Preview
                    </button>
                  </div>
                </div>

                <div className="relative">
                  {!isPreviewMode ? (
                    <div className="relative">
                      <textarea
                        id="notes"
                        name="notes"
                        rows={8}
                        value={formData.notes}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-800/80 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 resize-none group-hover:border-gray-500 font-mono text-sm"
                        placeholder="Add detailed notes, implementation ideas, or research links..."
                      />
                      <div className="absolute bottom-3 right-3 text-xs text-gray-500">
                        {formData.notes.length} chars
                      </div>
                    </div>
                  ) : (
                    <div className="min-h-[200px] w-full px-4 py-3 bg-gray-800/80 border border-gray-600 rounded-xl transition-all duration-300">
                      {formData.notes.trim() ? (
                        <div 
                          className="prose prose-invert max-w-none text-gray-200 text-sm leading-relaxed"
                          dangerouslySetInnerHTML={{ __html: parseMarkdown(formData.notes) }}
                        />
                      ) : (
                        <div className="flex items-center justify-center h-48 text-gray-500">
                          <div className="text-center">
                            <div className="text-4xl mb-2">📝</div>
                            <p>Start writing in the editor to see your markdown preview here</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-8">
                <Link
                  href="/my-ideas"
                  className="px-8 py-3 border border-gray-600 text-gray-300 bg-transparent rounded-xl hover:bg-gray-800 hover:border-gray-500 transition-all duration-300 font-medium text-center"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={isSubmitting || !formData.title.trim() || !formData.description.trim()}
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none"
                >
                  {isSubmitting ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Updating...</span>
                    </div>
                  ) : (
                    "💾 Update Idea"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}