"use client"
import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useSearchParams, useRouter } from "next/navigation"
import { getIdeaById } from "@/lib/sanity"
import { updateIdea } from "@/lib/actions"
import Link from "next/link"
import ReactMarkdown from "react-markdown"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism"

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

        // Optional: Check if user owns this idea (only if session exists)
        if (session?.user) {
          const authorId = (session?.user as any)?.githubId?.toString() || session?.user?.email || ''
          if (fetchedIdea.author.id !== authorId) {
            setError('You can only edit your own ideas')
            setLoading(false)
            return
          }
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

    if (ideaId) {
      fetchIdea()
    } else {
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
                        rows={16}
                        value={formData.notes}
                        onChange={handleChange}
                        className="w-full px-6 py-4 bg-gray-800/80 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 resize-y group-hover:border-gray-500 font-mono text-sm leading-relaxed scrollbar-thin scrollbar-track-gray-800 scrollbar-thumb-gray-600 hover:scrollbar-thumb-gray-500 scrollbar-thumb-rounded-full scrollbar-track-rounded-full"
                        placeholder="Add detailed notes, implementation ideas, or research links..."
                        style={{ 
                          minHeight: '400px',
                          scrollbarWidth: 'thin',
                          scrollbarColor: '#4B5563 #1F2937'
                        }}
                      />
                      <div className="absolute bottom-4 right-4 text-xs text-gray-500 bg-gray-900/80 px-2 py-1 rounded backdrop-blur-sm">
                        {formData.notes.length} chars
                      </div>
                    </div>
                  ) : (
                    <div className="min-h-[400px] w-full px-6 py-4 bg-gray-800/80 border border-gray-600 rounded-xl transition-all duration-300 overflow-y-auto max-h-[500px]">
                      {formData.notes.trim() ? (
                        <div className="prose prose-invert max-w-none text-gray-200 text-sm leading-relaxed">
                          <ReactMarkdown
                            components={{
                              code({ node, className, children, ...props }) {
                                const match = /language-(\w+)/.exec(className || "")
                                const isInline = !match
                                return !isInline ? (
                                 <SyntaxHighlighter
                                    style={tomorrow as any}
                                    language={match[1]}
                                    PreTag="div"
                                    className="rounded-md my-3"
                                  >
                                    {String(children).replace(/\n$/, "")}
                                  </SyntaxHighlighter>
                                ) : (
                                  <code className="bg-gray-700 text-green-400 px-2 py-1 rounded text-sm font-mono" {...props}>
                                    {children}
                                  </code>
                                )
                              },
                              h1: ({ children }) => (
                                <h1 className="text-2xl font-bold text-white mb-4 mt-6">{children}</h1>
                              ),
                              h2: ({ children }) => (
                                <h2 className="text-xl font-semibold text-white mb-3 mt-5">{children}</h2>
                              ),
                              h3: ({ children }) => (
                                <h3 className="text-lg font-semibold text-white mb-2 mt-4">{children}</h3>
                              ),
                              p: ({ children }) => <p className="text-gray-200 mb-4 leading-relaxed">{children}</p>,
                              ul: ({ children }) => (
                                <ul className="list-disc list-inside mb-4 space-y-1 text-gray-200 ml-4">{children}</ul>
                              ),
                              ol: ({ children }) => (
                                <ol className="list-decimal list-inside mb-4 space-y-1 text-gray-200 ml-4">{children}</ol>
                              ),
                              li: ({ children }) => <li className="text-gray-200">{children}</li>,
                              blockquote: ({ children }) => (
                                <blockquote className="border-l-4 border-blue-500 pl-4 py-2 mb-4 bg-gray-700/50 text-gray-200 italic">
                                  {children}
                                </blockquote>
                              ),
                              a: ({ href, children }) => (
                                <a
                                  href={href}
                                  className="text-blue-400 hover:text-blue-300 underline"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  {children}
                                </a>
                              ),
                              table: ({ children }) => (
                                <div className="overflow-x-auto mb-4">
                                  <table className="min-w-full border border-gray-600">{children}</table>
                                </div>
                              ),
                              thead: ({ children }) => <thead className="bg-gray-700">{children}</thead>,
                              th: ({ children }) => (
                                <th className="px-4 py-2 text-left font-semibold text-white border-b border-gray-600">
                                  {children}
                                </th>
                              ),
                              td: ({ children }) => (
                                <td className="px-4 py-2 text-gray-200 border-b border-gray-600">{children}</td>
                              ),
                              hr: () => <hr className="my-6 border-t border-gray-600" />,
                              strong: ({ children }) => <strong className="font-bold text-white">{children}</strong>,
                              em: ({ children }) => <em className="italic text-gray-200">{children}</em>,
                            }}
                          >
                            {formData.notes}
                          </ReactMarkdown>
                        </div>
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