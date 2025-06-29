"use client"
import { useState, useEffect, useRef } from 'react'
import { useParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { motion, AnimatePresence } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { getIdeaById, getCommentsForIdea, getAllCommentsForIdea } from '@/lib/sanity'
import { addComment } from '@/lib/actions'
import { Calendar, User, MessageCircle, ArrowLeft, Send } from 'lucide-react'
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
  body?: any[]
}

interface Comment {
  _id: string
  text: string
  author: {
    id: string
    name: string
  }
  createdAt: string
}

interface OptimisticComment extends Comment {
  isOptimistic?: boolean
}

export default function IdeaPage() {
  const params = useParams()
  const { data: session, status } = useSession()
  const [idea, setIdea] = useState<Idea | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [showComments, setShowComments] = useState(false)
  const [newComment, setNewComment] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [submittingComment, setSubmittingComment] = useState(false)
  const commentFormRef = useRef<HTMLFormElement>(null)

  // Get current user from session
  const currentUser = session?.user ? {
    id: session.user.id || session.user.email || 'anonymous',
    name: session.user.name || 'Anonymous'
  } : null

  // Fetch all comments for the idea from backend
  const fetchComments = async (ideaId: string) => {
    try {
      const commentsData = await getAllCommentsForIdea(ideaId)
      setComments(commentsData || [])
    } catch (err) {
      setComments([])
    }
  }

  // Fetch idea and comments (for initial load)
  const fetchAllData = async (ideaId: string, setLoadingState: boolean = true) => {
    if (setLoadingState) setLoading(true)
    try {
      const fetchedIdea = await getIdeaById(ideaId)
      if (!fetchedIdea) {
        setError("Idea not found")
        if (setLoadingState) setLoading(false)
        return false
      }
      setIdea(fetchedIdea)
      await fetchComments(ideaId)
      if (setLoadingState) setLoading(false)
      return true
    } catch (err) {
      setError("Failed to load idea. Please try again later.")
      if (setLoadingState) setLoading(false)
      return false
    }
  }

  useEffect(() => {
    async function fetchData() {
      setError(null)
      
      if (!params?.id) {
        setError("Invalid idea ID")
        setLoading(false)
        return
      }
      
      const id = Array.isArray(params.id) ? params.id[0] : params.id
      await fetchAllData(id, true)
      setLoading(false)
    }

    fetchData()
  }, [params])

  // Fetch comments when comments section is opened
  useEffect(() => {
    if (showComments && idea?._id) {
      fetchComments(idea._id)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showComments])

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!idea || !newComment.trim() || submittingComment) return

    setSubmittingComment(true)

    const authorId = currentUser?.id || 'anonymous'
    const authorName = currentUser?.name || 'Anonymous'
    const commentText = newComment.trim()
    setNewComment('')

    try {
      await addComment(idea._id, commentText, authorId, authorName)
      // Always fetch all comments and idea after posting
      await Promise.all([
        fetchComments(idea._id),
        fetchAllData(idea._id, false)
      ])
    } catch (error) {
      setError('Failed to save comment. Please try again.')
    } finally {
      setSubmittingComment(false)
    }
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) {
        return 'Invalid date'
      }
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    } catch {
      return 'Invalid date'
    }
  }

  const formatCommentDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) {
        return 'Invalid date'
      }
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return 'Invalid date'
    }
  }

  const getCategoryColor = (category: string): string => {
    const colors: Record<string, string> = {
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

  // ReactMarkdown components for styling
  const markdownComponents = {
    code({ node, inline, className, children, ...props }: any) {
      const match = /language-(\w+)/.exec(className || "")
      return !inline && match ? (
        <SyntaxHighlighter
          style={tomorrow}
          language={match[1]}
          PreTag="div"
          className="rounded-lg my-3"
          {...props}
        >
          {String(children).replace(/\n$/, "")}
        </SyntaxHighlighter>
      ) : (
        <code className="bg-gray-700 text-green-400 px-2 py-1 rounded text-sm font-mono" {...props}>
          {children}
        </code>
      )
    },
    h1: ({ children }: any) => (
      <h1 className="text-2xl font-bold text-white mb-3 mt-4">{children}</h1>
    ),
    h2: ({ children }: any) => (
      <h2 className="text-xl font-semibold text-white mb-3 mt-5">{children}</h2>
    ),
    h3: ({ children }: any) => (
      <h3 className="text-lg font-semibold text-white mb-2 mt-4">{children}</h3>
    ),
    p: ({ children }: any) => (
      <p className="text-gray-200 mb-4 leading-relaxed">{children}</p>
    ),
    ul: ({ children }: any) => (
      <ul className="list-disc list-inside mb-4 space-y-1 text-gray-200 ml-4">{children}</ul>
    ),
    ol: ({ children }: any) => (
      <ol className="list-decimal list-inside mb-4 space-y-1 text-gray-200 ml-4">{children}</ol>
    ),
    li: ({ children }: any) => (
      <li className="text-gray-200 mb-1">{children}</li>
    ),
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-4 border-blue-500 pl-4 py-2 mb-4 bg-blue-900/20 text-gray-200 italic">
        {children}
      </blockquote>
    ),
    a: ({ href, children }: any) => (
      <a
        href={href}
        className="text-blue-400 hover:text-blue-300 underline"
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    ),
    table: ({ children }: any) => (
      <div className="overflow-x-auto mb-4">
        <table className="min-w-full border border-gray-600 rounded-lg">{children}</table>
      </div>
    ),
    thead: ({ children }: any) => (
      <thead className="bg-gray-700">{children}</thead>
    ),
    th: ({ children }: any) => (
      <th className="px-4 py-2 text-left font-semibold text-white border-b border-gray-600">
        {children}
      </th>
    ),
    td: ({ children }: any) => (
      <td className="px-4 py-2 text-gray-200 border-b border-gray-600">{children}</td>
    ),
    hr: () => <hr className="my-6 border-t border-gray-600" />,
    strong: ({ children }: any) => (
      <strong className="font-bold text-white">{children}</strong>
    ),
    em: ({ children }: any) => (
      <em className="italic text-gray-200">{children}</em>
    ),
  }

  // Animation variants
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  }

  const commentVariants = {
    initial: { opacity: 0, y: -20, scale: 0.95 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -20, scale: 0.95 }
  }

  const buttonVariants = {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 }
  }

  if (loading || status === 'loading') {
    return (
      <motion.div 
        className="min-h-screen bg-black text-white flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="text-center">
          <motion.div 
            className="inline-block w-8 h-8 border-2 border-white border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <motion.p 
            className="text-white mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Loading idea...
          </motion.p>
        </div>
      </motion.div>
    )
  }

  if (error || !idea) {
    return (
      <motion.div 
        className="min-h-screen bg-black text-white flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="text-center">
          <motion.p 
            className="text-red-400 mb-4"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            {error}
          </motion.p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link 
              href="/"
              className="px-4 py-2 border border-white/50 text-white hover:bg-white/10 rounded-lg transition-colors inline-block"
            >
              Back to Home
            </Link>
          </motion.div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div 
      className="min-h-screen bg-black text-white pt-16 overflow-x-hidden"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-800 opacity-50 -z-10 overflow-x-hidden"></div>
      
      <div className="relative z-0 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            whileHover={{ x: -5 }}
          >
            <Link 
              href="/"
              className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Ideas
            </Link>
          </motion.div>

          {/* Idea Content */}
          <motion.article 
            className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 shadow-2xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
          >
            {/* Category Badge */}
            {idea.category && (
              <motion.div 
                className={`inline-block px-3 py-1.5 text-sm rounded-full border mb-6 ${getCategoryColor(idea.category)}`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
              >
                {idea.category.charAt(0).toUpperCase() + idea.category.slice(1)}
              </motion.div>
            )}

            {/* Title */}
            <motion.h1 
              className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              {idea.title}
            </motion.h1>

            {/* Author and Date */}
            <motion.div 
              className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-700"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <div className="flex items-center gap-2 text-gray-300">
                <User className="h-5 w-5" />
                <Link 
                  href={`/idea/author/${idea.author?.id}`}
                  className="font-medium hover:text-blue-400 transition-colors cursor-pointer"
                >
                  {idea.author?.name || "Anonymous"}
                </Link>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <Calendar className="h-5 w-5" />
                <span>{formatDate(idea.publishedAt)}</span>
              </div>
            </motion.div>

            {/* Description */}
            <motion.div 
              className="prose prose-lg prose-invert max-w-none mb-8"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <p className="text-gray-200 text-lg leading-relaxed">
                {idea.text || "No description available"}
              </p>
            </motion.div>

            {/* Notes Section */}
            {idea.notes && idea.notes.trim() && (
              <motion.div 
                className="mt-8 pt-8 border-t border-gray-700"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.6 }}
              >
                <h2 className="text-2xl font-semibold text-white mb-4">Additional Notes</h2>
                <div className="bg-gray-800/50 border border-gray-600 rounded-xl p-6 overflow-x-auto">
                  <div className="prose prose-invert max-w-none">
                    <ReactMarkdown components={markdownComponents}>
                      {idea.notes}
                    </ReactMarkdown>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Engagement Section */}
            <motion.div 
              className="flex items-center justify-between pt-8 mt-8 border-t border-gray-700"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              <div className="flex items-center gap-6">
                <motion.button 
                  onClick={() => setShowComments(!showComments)}
                  className="flex items-center gap-2 text-gray-400 hover:text-blue-400 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <MessageCircle className="h-5 w-5" />
                  <span>Comment</span>
                </motion.button>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <motion.button 
                  onClick={() => setShowComments(true)}
                  className="hover:text-gray-300 transition-colors cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                >
                  {comments.length} {comments.length === 1 ? 'comment' : 'comments'}
                </motion.button>
              </div>
            </motion.div>

            {/* Comments Section */}
            <AnimatePresence>
              {showComments && (
                <motion.div 
                  className="mt-8 pt-8 border-t border-gray-700"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                >
                  <motion.h3 
                    className="text-xl font-semibold text-white mb-4"
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    Comments ({comments.length})
                  </motion.h3>
                  
                  {/* Add Comment Form */}
                  <motion.form 
                    ref={commentFormRef}
                    onSubmit={handleCommentSubmit}
                    className="mb-6"
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <div className="flex gap-3">
                      <motion.input
                        type="text"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder={currentUser ? `Comment as ${currentUser.name}` : "Comment as Anonymous"}
                        className="flex-1 bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                        maxLength={500}
                        whileFocus={{ scale: 1.02 }}
                      />
                      <motion.button
                        type="submit"
                        disabled={!newComment.trim() || submittingComment}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:opacity-50 text-white rounded-lg transition-colors flex items-center gap-2"
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                      >
                        <Send className="h-4 w-4" />
                        {submittingComment ? 'Posting...' : 'Post'}
                      </motion.button>
                    </div>
                    <motion.div 
                      className="flex items-center justify-between mt-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      <p className="text-gray-400 text-sm">
                        {currentUser ? (
                          <>Commenting as <span className="text-blue-400">{currentUser.name}</span> (GitHub User)</>
                        ) : (
                          <>Commenting as <span className="text-gray-300">Anonymous</span></>
                        )}
                      </p>
                      {!currentUser && (
                        <motion.div whileHover={{ scale: 1.05 }}>
                          <Link 
                            href="/api/auth/signin"
                            className="text-blue-400 hover:text-blue-300 text-sm underline"
                          >
                            Sign in with GitHub
                          </Link>
                        </motion.div>
                      )}
                    </motion.div>
                  </motion.form>

                  {/* Comments List */}
                  <div className="space-y-4">
                    <AnimatePresence mode="popLayout">
                      {comments.length > 0 ? (
                        comments.map((comment, index) => (
                          <motion.div 
                            key={comment._id} 
                            className="bg-gray-800/50 border border-gray-600 rounded-lg p-4"
                            variants={commentVariants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            transition={{ 
                              duration: 0.5, 
                              delay: index * 0.1,
                              type: "spring",
                              stiffness: 100
                            }}
                            layout
                            whileHover={{ scale: 1.02, borderColor: "rgb(59 130 246 / 0.5)" }}
                          >
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-medium text-white">{comment.author.name}</span>
                              {comment.author.id !== 'anonymous' ? (
                                <motion.span 
                                  className="text-blue-400 text-xs bg-blue-500/20 border border-blue-500/30 px-2 py-1 rounded"
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  transition={{ delay: 0.3 }}
                                >
                                  GitHub User
                                </motion.span>
                              ) : (
                                <motion.span 
                                  className="text-gray-400 text-xs bg-gray-700 px-2 py-1 rounded"
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  transition={{ delay: 0.3 }}
                                >
                                  Anonymous
                                </motion.span>
                              )}
                              <span className="text-gray-400 text-sm">
                                {formatCommentDate(comment.createdAt)}
                              </span>
                            </div>
                            <motion.p 
                              className="text-gray-200"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.4 }}
                            >
                              {comment.text}
                            </motion.p>
                          </motion.div>
                        ))
                      ) : (
                        <motion.p 
                          className="text-gray-400 text-center py-4"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.5 }}
                        >
                          No comments yet. Be the first to comment!
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.article>
        </div>
      </div>
    </motion.div>
  )
}