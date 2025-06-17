"use client"
import { Calendar, User, Heart, MessageCircle } from "lucide-react"
import Link from "next/link"

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
  }
}

export default function IdeaCard({ idea }: IdeaCardProps) {
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
    <div className="bg-black/50 border border-white/30 rounded-lg p-6 hover:border-white/50 transition-all duration-200 hover:shadow-lg hover:shadow-white/10 group backdrop-blur-sm cursor-pointer">
      {/* Category Badge */}
      {idea.category && (
        <div className={`inline-block px-2 py-1 text-xs rounded-full border mb-3 ${getCategoryColor(idea.category)}`}>
          {idea.category.charAt(0).toUpperCase() + idea.category.slice(1)}
        </div>
      )}

      {/* Idea Title */}
      <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-white transition-colors line-clamp-2">
        <Link href={`/idea/${idea._id}`}>
          {idea.title}
        </Link>
      </h3>
      
      {/* Idea Description */}
      <p className="text-white mb-4 line-clamp-3 text-sm leading-relaxed">
        {idea.text || "No description available"}
      </p>

      {/* Author and Date */}
      <div className="flex items-center gap-2 mb-4 text-sm text-white">
        <User className="h-4 w-4" />
        <Link 
          href={`/idea/author/${idea.author?.id}`}
          className="hover:text-blue-400 transition-colors cursor-pointer"
        >
          {idea.author?.name || "Anonymous"}
        </Link>
        <span>•</span>
        <Calendar className="h-3 w-3" />
        <span>{formatDate(idea.publishedAt)}</span>
      </div>

      {/* Engagement Stats */}
      <div className="flex items-center justify-between pt-4 border-t border-white/30">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 text-white hover:text-white transition-colors cursor-pointer">
            <Heart className="h-4 w-4" />
            <span className="text-sm">0</span>
          </div>
          <div className="flex items-center gap-1 text-white hover:text-white transition-colors cursor-pointer">
            <MessageCircle className="h-4 w-4" />
            <span className="text-sm">0</span>
          </div>
        </div>
        <Link 
          href={`/idea/${idea._id}`}
          className="text-white hover:text-white text-sm font-medium transition-colors"
        >
          View →
        </Link>
      </div>
    </div>
  )
}
