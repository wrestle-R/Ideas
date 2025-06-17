"use client"
import { useState, useEffect } from "react"
import { createIdea } from "@/lib/actions"
import { useSession } from "next-auth/react"

interface FormData {
  title: string
  description: string
  category: string
  notes: string
}

export default function CreateIdeaPage() {
  const { data: session, status } = useSession()
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [isPreviewMode, setIsPreviewMode] = useState<boolean>(false)
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    category: "",
    notes: ""
  })

  // Log session information
  useEffect(() => {
    console.log('Session status:', status)
    console.log('Session data:', session)
    if (session?.user) {
      console.log('User githubId:', (session.user as any).githubId)
      console.log('User name:', session.user.name)
      console.log('User email:', session.user.email)
      console.log('User image:', session.user.image)
    }
  }, [session, status])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      const formDataObj = new FormData(e.currentTarget as HTMLFormElement)
      
      // Add author information
      if (session?.user) {
        formDataObj.append('authorId', (session.user as any).githubId?.toString() || session.user.email || '')
        formDataObj.append('authorName', session.user.name || '')
      }
      
      const result = await createIdea(formDataObj)
      
      if (result.error) {
        alert(result.error)
      } else {
        console.log("Idea created successfully:", result.idea)
        alert("Idea created successfully!")
        
        // Reset form
        setFormData({
          title: "",
          description: "",
          category: "",
          notes: ""
        })
        setIsPreviewMode(false)
      }
      
    } catch (error) {
      console.error("Error creating idea:", error)
      alert("Failed to create idea. Please try again.")
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

  // Simple markdown parser for preview
  const parseMarkdown = (text: string) => {
    let html = text
      // Headers
      .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold text-white mb-2 mt-4">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-xl font-semibold text-white mb-3 mt-5">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold text-white mb-4 mt-6">$1</h1>')
      // Bold and italic
      .replace(/\*\*\*(.*)\*\*\*/gim, '<strong class="font-bold text-white"><em class="italic">$1</em></strong>')
      .replace(/\*\*(.*)\*\*/gim, '<strong class="font-bold text-white">$1</strong>')
      .replace(/\*(.*)\*/gim, '<em class="italic text-gray-200">$1</em>')
      // Code blocks
      .replace(/```([\s\S]*?)```/gim, '<pre class="bg-gray-800 border border-gray-600 rounded-lg p-4 my-3 overflow-x-auto"><code class="text-green-400 text-sm">$1</code></pre>')
      .replace(/`([^`]*)`/gim, '<code class="bg-gray-700 text-green-400 px-2 py-1 rounded text-sm">$1</code>')
      // Links
      .replace(/\[([^\]]*)\]\(([^\)]*)\)/gim, '<a href="$2" class="text-blue-400 hover:text-blue-300 underline" target="_blank" rel="noopener noreferrer">$1</a>')
      // Lists
      .replace(/^\- (.*$)/gim, '<li class="text-gray-200 ml-4">• $1</li>')
      .replace(/^\* (.*$)/gim, '<li class="text-gray-200 ml-4">• $1</li>')
      .replace(/^\+ (.*$)/gim, '<li class="text-gray-200 ml-4">• $1</li>')
      // Line breaks
      .replace(/\n/gim, '<br>')

    return html
  }

  return (
    <div className="min-h-screen bg-black text-white pt-3">
      {/* Background gradient overlay - moved below navbar */}
      <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-800 opacity-50 -z-10"></div>
      
      <div className="relative z-0 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-4">
              Create New Idea
            </h1>
            <p className="text-gray-400 text-lg">
              Transform your thoughts into actionable concepts
            </p>
            
          </div>

          {/* Form Container */}
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Title */}
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

              {/* Description */}
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

              {/* Category */}
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

              {/* Notes - Markdown Editor */}
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
                      placeholder="Add detailed notes, implementation ideas, or research links.  Use **bold**, *italic*, `code`, # headings, and - lists for formatting."
                      />
                      
                      {/* Character count */}
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

                {/* Subtle markdown help
                {!isPreviewMode && formData.notes.length === 0 && (
                  <div className="mt-2 text-xs text-gray-500">
                    <span className="opacity-75">
                      Format with markdown: **bold**, *italic*, `code`, # headers, - lists
                    </span>
                  </div>
                )} */}
              </div>

              {/* Submit Buttons */}
              <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-8">
                <button
                  type="button"
                  className="px-8 py-3 border border-gray-600 text-gray-300 bg-transparent rounded-xl hover:bg-gray-800 hover:border-gray-500 transition-all duration-300 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !formData.title.trim() || !formData.description.trim()}
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none"
                >
                  {isSubmitting ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Creating...</span>
                    </div>
                  ) : (
                    "✨ Create Idea"
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Footer tip */}
          <div className="text-center mt-8">
            <p className="text-gray-500 text-sm">
              💡 Tip: Great ideas often start with simple observations
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}