"use client"
import { Calendar, User } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import Image from "next/image"
import LightOn from "../public/light_on_bg.jpg"
import LightOff from "../public/light_off_bg.jpg"
import { motion, AnimatePresence } from "framer-motion"

interface IdeaCardProps {
  idea: {
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
  }
  currentUser?: {
    id: string
    name: string
  }
}

export default function IdeaCard({ idea, currentUser }: IdeaCardProps) {
  // Voting state
  const [voteCount, setVoteCount] = useState(0)
  const [upvoteAnim, setUpvoteAnim] = useState(false)
  const [downvoteAnim, setDownvoteAnim] = useState(false)
  const [isUpvoted, setIsUpvoted] = useState(false)
  const [isDownvoted, setIsDownvoted] = useState(false)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours} hours ago`
    if (diffInHours < 48) return "1 day ago"
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)} days ago`
    return date.toLocaleDateString()
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

  return (
    <Link href={`/idea/${idea._id}`}>
      <div className="bg-black/50 border border-white/30 rounded-lg p-6 hover:border-white/50 transition-all duration-200 hover:shadow-lg hover:shadow-white/10 group backdrop-blur-sm cursor-pointer w-[320px] h-[320px] flex flex-col justify-between min-h-0">
        {/* Category Badge */}
        {idea.category && (
          <div className={`inline-flex px-3 py-1 w-fit text-xs rounded-xl border mb-2 ${getCategoryColor(idea.category)}`}>
            {idea.category.charAt(0).toUpperCase() + idea.category.slice(1)}
          </div>
        )}

        {/* Idea Title */}
        <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-white transition-colors line-clamp-2">
          {idea.title}
        </h3>
        
        {/* Idea Description */}
        <p className="text-white mb-3 line-clamp-3 text-sm leading-relaxed overflow-hidden text-ellipsis">
          {idea.text || "No description available"}
        </p>

        {/* Author and Date */}
        <div className="flex items-center gap-1 mb-3 text-sm text-white">
          <User className="h-4 w-4" />
          <span 
            onClick={e => {
              e.preventDefault()
              e.stopPropagation()
            }}
            className="hover:text-blue-400 transition-colors cursor-pointer"
          >
            {idea.author?.name || "Anonymous"}
          </span>
          <span>•</span>
          <Calendar className="h-3 w-3" />
          <span>{formatDate(idea.publishedAt)}</span>
        </div>

        {/* Engagement Stats */}
        <div className="flex items-center justify-between pt-3 border-t border-white/30">
          <div className="flex items-center gap-3">
            {/* Upvote/Downvote */}
            <div className="flex items-center gap-4 relative">
              {/* Light On (Upvote) */}
              <button
                className="rounded-full w-10 h-10 flex items-center justify-center relative overflow-visible transition-all duration-300 transform hover:scale-110"
                onClick={e => {
                  e.preventDefault()
                  e.stopPropagation()
                  if (isUpvoted) {
                    setVoteCount(voteCount - 1)
                    setIsUpvoted(false)
                    return
                  }
                  setVoteCount(isDownvoted ? voteCount + 2 : voteCount + 1)
                  setIsUpvoted(true)
                  setIsDownvoted(false)
                  setUpvoteAnim(true)
                  setTimeout(() => setUpvoteAnim(false), 600)
                }}
                style={{ 
                  padding: 0, 
                  border: "none", 
                  background: "none"
                }}
                type="button"
                aria-pressed={isUpvoted}
              >
<Image
  src={LightOn}
  alt="Light On (Upvote)"
  width={36}
  height={36}
  className={`rounded-full transition-all duration-300 ${
    isUpvoted
      ? "opacity-100 brightness-110 saturate-200 contrast-125 shadow-[0_0_16px_rgba(255,255,0,0.5)]"
      : "opacity-70 hover:opacity-90"
  }`}
  priority={false}
/>



                <AnimatePresence>
                  {upvoteAnim && (
                    <motion.div
                      key="upvote-pulse"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ 
                        opacity: [0, 0.6, 0],
                        scale: [0.5, 2.2, 3]
                      }}
                      exit={{ opacity: 0 }}
                      transition={{ 
                        duration: 0.6, 
                        ease: "easeOut",
                        times: [0, 0.3, 1]
                      }}
                      className="absolute inset-0 z-10 pointer-events-none rounded-full"
                      style={{
                        background: "radial-gradient(circle, #fbbf24 20%, #f59e0b 40%, transparent 70%)",
                        filter: "blur(8px)",
                      }}
                    />
                  )}
                </AnimatePresence>
              </button>

              {/* Single Vote Number */}
              <motion.span 
                key={voteCount}
                initial={{ scale: 1 }}
                animate={{ 
                  scale: upvoteAnim || downvoteAnim ? [1, 1.3, 1] : 1
                }}
                transition={{ duration: 0.3 }}
                className={`text-lg font-bold transition-all duration-300 ${
                  voteCount > 0
                    ? "text-yellow-300 drop-shadow-sm"
                    : voteCount < 0
                    ? "text-orange-300 drop-shadow-sm"
                    : "text-white"
                }`}
                style={{
                  textShadow:
                    voteCount > 0
                      ? "0 0 10px rgba(253, 224, 71, 0.3)"
                      : voteCount < 0
                      ? "0 0 10px rgba(251, 146, 60, 0.3)"
                      : "none"
                }}
              >
                {voteCount}
              </motion.span>

              {/* Light Off (Downvote) */}
              <button
                className="rounded-full w-10 h-10 flex items-center justify-center relative overflow-visible transition-all duration-300 transform hover:scale-110"
                onClick={e => {
                  e.preventDefault()
                  e.stopPropagation()
                  if (isDownvoted) {
                    setVoteCount(voteCount + 1)
                    setIsDownvoted(false)
                    return
                  }
                  setVoteCount(isUpvoted ? voteCount - 2 : voteCount - 1)
                  setIsDownvoted(true)
                  setIsUpvoted(false)
                  setDownvoteAnim(true)
                  setTimeout(() => setDownvoteAnim(false), 600)
                }}
                style={{ 
                  padding: 0, 
                  border: "none", 
                  background: "none"
                }}
                type="button"
                aria-pressed={isDownvoted}
              >
<Image
  src={LightOff}
  alt="Light Off (Downvote)"
  width={36}
  height={36}
  className={`w-9 h-9 rounded-full transition-all duration-300 ${
    isDownvoted
      ? "opacity-100 brightness-95 saturate-400 shadow-[0_0_12px_4px_rgba(0,191,255,0.4)]"
      : "opacity-70 hover:opacity-90"
  }`}
  priority={false}
/>



                <AnimatePresence>
                  {downvoteAnim && (
                    <motion.div
                      key="downvote-pulse"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ 
                        opacity: [0, 0.5, 0],
                        scale: [0.5, 2.2, 3]
                      }}
                      exit={{ opacity: 0 }}
                      transition={{ 
                        duration: 0.6, 
                        ease: "easeOut",
                        times: [0, 0.3, 1]
                      }}
                      className="absolute inset-0 z-10 pointer-events-none rounded-full"
                      style={{
                        background: "radial-gradient(circle, #f97316 20%, #ea580c 40%, transparent 70%)",
                        filter: "blur(8px)",
                      }}
                    />
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>
          <span className="text-white hover:text-white text-sm font-medium transition-colors">
            View →
          </span>
        </div>
      </div>
    </Link>
  )
}