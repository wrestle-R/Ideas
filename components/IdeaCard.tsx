"use client"
import { Calendar, User, Heart, MessageCircle } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { toggleLike } from "@/lib/actions"

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
    likesCount?: number
    commentsCount?: number
    userLiked?: boolean
  }
  currentUser?: {
    id: string
    name: string
  }
  onLikeUpdate?: (ideaId: string, newLikeCount: number, userLiked: boolean) => void
}

export default function IdeaCard({ idea, currentUser, onLikeUpdate }: IdeaCardProps) {
  const [isLiking, setIsLiking] = useState(false)
  const [localLiked, setLocalLiked] = useState(idea.userLiked || false)
  const [localLikeCount, setLocalLikeCount] = useState(idea.likesCount || 0)

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

  const handleLikeClick = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!currentUser || isLiking) return
    
    setIsLiking(true)
    
    // Store previous values for potential rollback
    const prevLiked = localLiked
    const prevCount = localLikeCount
    
    // Optimistic update
    const newLiked = !localLiked
    const newCount = newLiked ? localLikeCount + 1 : Math.max(0, localLikeCount - 1)
    setLocalLiked(newLiked)
    setLocalLikeCount(newCount)
    
    try {
      const result = await toggleLike(idea._id, currentUser.id, currentUser.name)
      
      if (result.success) {
        // Update was successful, keep optimistic update
        onLikeUpdate?.(idea._id, newCount, newLiked)
      } else {
        // Revert optimistic update on error
        setLocalLiked(prevLiked)
        setLocalLikeCount(prevCount)
        console.error('Error toggling like:', result.error)
      }
    } catch (error) {
      // Revert optimistic update on error
      setLocalLiked(prevLiked)
      setLocalLikeCount(prevCount)
      console.error('Error toggling like:', error)
    } finally {
      setIsLiking(false)
    }
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
            onClick={(e) => {
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
            
              
              
            
            <div className="flex items-center gap-1 text-white hover:text-blue-400 transition-colors cursor-pointer">
              <MessageCircle className="h-4 w-4" />
              <span className="text-sm">{idea.commentsCount ?? 0}</span>
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
