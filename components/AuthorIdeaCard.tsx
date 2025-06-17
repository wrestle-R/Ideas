import Link from 'next/link'
import { Calendar, BookOpen, Tag } from 'lucide-react'

interface Idea {
  _id: string
  title: string
  slug: { current: string }
  category: string
  notes?: string
  publishedAt: string
  body?: any[]
  text?: string
}

interface AuthorIdeaCardProps {
  idea: Idea
}

export default function AuthorIdeaCard({ idea }: AuthorIdeaCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      'technology': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      'business': 'bg-green-500/20 text-green-300 border-green-500/30',
      'design': 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      'health': 'bg-red-500/20 text-red-300 border-red-500/30',
      'education': 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
      'entertainment': 'bg-pink-500/20 text-pink-300 border-pink-500/30',
      'other': 'bg-gray-500/20 text-gray-300 border-gray-500/30'
    }
    return colors[category as keyof typeof colors] || colors.other
  }

  const stripMarkdown = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '$1') // Bold
      .replace(/\*(.*?)\*/g, '$1') // Italic
      .replace(/`(.*?)`/g, '$1') // Inline code
      .replace(/#{1,6}\s+/g, '') // Headers
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Links
      .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1') // Images
      .replace(/>\s+/g, '') // Blockquotes
      .replace(/^\s*[-*+]\s+/gm, '') // List items
      .replace(/^\s*\d+\.\s+/gm, '') // Numbered lists
      .replace(/\n+/g, ' ') // Multiple newlines
      .trim()
  }

  const getTextPreview = () => {
    if (idea.text) {
      return stripMarkdown(idea.text)
    }
    if (idea.body && idea.body.length > 0) {
      // Extract text from portable text blocks
      const rawText = idea.body
        .filter(block => block._type === 'block')
        .map(block => 
          block.children
            ?.filter((child: any) => child._type === 'span')
            .map((child: any) => child.text)
            .join('')
        )
        .join(' ')
      return stripMarkdown(rawText)
    }
    return ''
  }

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength).trim() + '...'
  }

  const textPreview = getTextPreview()

  return (
    <Link href={`/idea/${idea._id}`}>
      <div className="group bg-gray-900/40 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 hover:bg-gray-800/60 hover:border-gray-600 transition-all duration-300 hover:shadow-xl hover:shadow-white/5 cursor-pointer h-full flex flex-col">
        {/* Category and Date Header */}
        <div className="flex items-center justify-between mb-4">
          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getCategoryColor(idea.category)}`}>
            <Tag className="inline h-3 w-3 mr-1" />
            {idea.category}
          </span>
          <div className="flex items-center text-gray-400 text-sm">
            <Calendar className="h-3 w-3 mr-1" />
            {formatDate(idea.publishedAt)}
          </div>
        </div>

        {/* Title */}
        <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-gray-100 transition-colors line-clamp-2">
          {idea.title}
        </h3>

        {/* Description/Text Preview */}
        {textPreview && (
          <p className="text-gray-300 text-sm leading-relaxed mb-4 flex-grow">
            {truncateText(textPreview, 120)}
          </p>
        )}

        {/* Notes Preview */}
        {idea.notes && (
          <div className="mt-auto">
            <div className="flex items-start gap-2 p-3 bg-gray-800/50 rounded-lg border border-gray-700/50">
              <BookOpen className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
              <p className="text-gray-400 text-xs leading-relaxed">
                {truncateText(stripMarkdown(idea.notes), 80)}
              </p>
            </div>
          </div>
        )}

        {/* Hover Indicator */}
        <div className="mt-4 pt-3 border-t border-gray-700/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="text-xs text-gray-400">Click to read more →</span>
        </div>
      </div>
    </Link>
  )
}
