"use client"
import { useState, useEffect } from "react"
import { createIdea } from "@/lib/actions"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import ReactMarkdown from "react-markdown"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism"

interface FormData {
  title: string
  description: string
  category: string
  notes: string
}

export default function CreateIdeaPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [isPreviewMode, setIsPreviewMode] = useState<boolean>(false)
  
  // Default markdown template
  const defaultNotesTemplate = `# Implementation Plan

## Overview
Brief description of how to implement this idea...

## Key Features
- Feature 1
- Feature 2
- Feature 3

## Technical Requirements
\`\`\`javascript
// Example code or pseudocode
function exampleFunction() {
  return "Hello World";
}
\`\`\`

## Next Steps
1. Research phase
2. Prototype development
3. Testing and validation

---

*Feel free to modify or replace this template with your own notes*`

  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    category: "",
    notes: defaultNotesTemplate
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

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    }
  }, [status, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Check if notes are still the default template
    const isUsingDefaultNotes = formData.notes.trim() === defaultNotesTemplate.trim()
    
    try {
      const formDataObj = new FormData(e.currentTarget as HTMLFormElement)
      
      // Add author information
      if (session?.user) {
        formDataObj.append('authorId', (session.user as any).githubId?.toString() || session.user.email || '')
        formDataObj.append('authorName', session.user.name || '')
      }
      
      // If using default notes, send empty notes instead
      if (isUsingDefaultNotes) {
        formDataObj.set('notes', '')
      }
      
      const result = await createIdea(formDataObj)
      
      if (result.error) {
        alert(result.error)
      } else {
        console.log("Idea created successfully:", result.idea)
        alert("Idea created successfully!")
        
        // Reset form and redirect to my-ideas
        handleReset()
        
        // Redirect to my-ideas page after successful creation
        window.location.href = '/my-ideas'
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

  const handleReset = () => {
    setFormData({
      title: "",
      description: "",
      category: "",
      notes: defaultNotesTemplate
    })
    setIsPreviewMode(false)
  }

  // Check if form is valid for submission
  const isFormValid = () => {
    const hasTitle = formData.title.trim().length > 0
    const hasDescription = formData.description.trim().length > 0
    const isUsingDefaultNotes = formData.notes.trim() === defaultNotesTemplate.trim()
    
    return hasTitle && hasDescription && !isUsingDefaultNotes
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    )
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
                    Notes <span className="text-gray-500 text-xs font-normal">• markdown supported (optional)</span>
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
                      placeholder="Add detailed notes, implementation ideas, or research links. Use **bold**, *italic*, `code`, # headings, and - lists for formatting."
                      style={{ 
                        minHeight: '400px',
                        scrollbarWidth: 'thin',
                        scrollbarColor: '#4B5563 #1F2937'
                      }}
                      />
                      
                      {/* Character count and template indicator */}
                      <div className="absolute bottom-4 right-4 flex items-center space-x-2 text-xs text-gray-500 bg-gray-900/80 px-2 py-1 rounded backdrop-blur-sm">
                        {formData.notes.trim() === defaultNotesTemplate.trim() && (
                          <span className="bg-yellow-600 text-yellow-100 px-2 py-1 rounded text-xs">
                            Template
                          </span>
                        )}
                        <span>{formData.notes.length} chars</span>
                      </div>
                    </div>
                  ) : (
                    <div className="min-h-[400px] w-full px-6 py-4 bg-gray-800/80 border border-gray-600 rounded-xl transition-all duration-300 overflow-y-auto max-h-[500px]">
                      {formData.notes.trim() ? (
                        <div className="prose prose-invert max-w-none text-gray-200 text-sm leading-relaxed">
                          <ReactMarkdown
                            components={{
                              code({ className, children }) {
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
                                  <code className="bg-gray-700 text-green-400 px-2 py-1 rounded text-sm font-mono">
                                    {children}
                                  </code>
                                )
                              },
                              h1: ({ children }) => (
                                <h1 className="text-2xl font-bold text-white mb-4 mt-6 pb-2 border-b border-gray-600">
                                  {children}
                                </h1>
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
                                <blockquote className="border-l-4 border-blue-500 pl-4 py-2 mb-4 bg-gray-700/50 text-gray-200 italic rounded-r">
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
                                  <table className="min-w-full border border-gray-600 rounded-lg">{children}</table>
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

                {/* Clear template button */}
                {formData.notes.trim() === defaultNotesTemplate.trim() && (
                  <div className="mt-2">
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, notes: "" }))}
                    className="flex items-center text-sm bg-gray-800/80 hover:bg-gray-700 text-gray-300 hover:text-white px-4 py-2 rounded-lg transition-all duration-200 border border-gray-700 hover:border-gray-500 shadow-sm"
                  >
                    <span className="mr-2">🗑️</span>
                    Clear template and start fresh
                  </button>
                  </div>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="flex flex-col sm:flex-row justify-between space-y-3 sm:space-y-0 sm:space-x-4 pt-8">
                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="px-6 py-3 border border-gray-600 text-gray-300 bg-transparent rounded-xl hover:bg-gray-800 hover:border-gray-500 transition-all duration-300 font-medium"
                  >
                    🔄 Reset
                  </button>
                  <button
                    type="button"
                    onClick={() => router.back()}
                    className="px-6 py-3 border border-gray-600 text-gray-300 bg-transparent rounded-xl hover:bg-gray-800 hover:border-gray-500 transition-all duration-300 font-medium"
                  >
                    Cancel
                  </button>
                </div>
                
                <div className="flex flex-col">
                  <button
                    type="submit"
                    disabled={isSubmitting || !isFormValid()}
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
                  
                  {/* Validation message */}
                  {!isFormValid() && formData.title.trim() && formData.description.trim() && (
                    <p className="text-xs text-yellow-400 mt-1 text-center">
                      Please customize or clear the notes template to continue
                    </p>
                  )}
                </div>
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