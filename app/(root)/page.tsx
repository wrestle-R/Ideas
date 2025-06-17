"use client"
import { useSession, signIn } from "next-auth/react"
import { useState } from "react"
import { 
  Plus, 
  Calendar, 
  User,
  Heart,
  MessageCircle,
  Lightbulb,
  Sparkles,
  Search
} from "lucide-react"
import SearchComponent from "@/components/SearchCompoent"

export default function Home() {
  const { data: session } = useSession()
  
  // Mock ideas data - replace with real data later
  const [ideas] = useState([
    {
      id: 1,
      title: "AI-Powered Study Assistant",
      description: "Create an app that helps students organize their study materials and generates personalized quizzes based on their notes.",
      author: "John Doe",
      date: "2 hours ago",
      likes: 24,
      comments: 5
    },
    {
      id: 2,
      title: "Smart Home Energy Optimizer", 
      description: "Develop a system that automatically adjusts home appliances to minimize energy consumption while maintaining comfort.",
      author: "Jane Smith",
      date: "5 hours ago", 
      likes: 18,
      comments: 3
    },
    {
      id: 3,
      title: "Local Community Skills Exchange",
      description: "Platform where neighbors can exchange skills - like teaching guitar for help with gardening.",
      author: "Mike Wilson",
      date: "1 day ago",
      likes: 31,
      comments: 8
    },
    {
      id: 4,
      title: "Sustainable Food Packaging",
      description: "Biodegradable food packaging made from agricultural waste that dissolves harmlessly in water.",
      author: "Sarah Johnson", 
      date: "2 days ago",
      likes: 42,
      comments: 12
    },
    {
      id: 5,
      title: "Virtual Reality Meditation App",
      description: "Immersive VR experience that transports users to peaceful environments for guided meditation sessions.",
      author: "Alex Chen",
      date: "3 days ago",
      likes: 15,
      comments: 2
    },
    {
      id: 6,
      title: "Automated Plant Care System",
      description: "Smart system that monitors soil moisture, light levels, and automatically waters plants when needed.",
      author: "Emma Davis",
      date: "1 week ago",
      likes: 27,
      comments: 6
    }
  ])

  return (
    <div className="min-h-screen bg-black text-white">

      {/* Hero Section */}
<section className="container mx-auto px-6 py-12 text-center relative overflow-hidden">
  {/* Background decorative elements */}
  <div className="absolute top-6 left-6 w-10 h-10 rounded-full bg-gray-900/20 blur-xl"></div>
  <div className="absolute bottom-6 right-6 w-12 h-12 rounded-full bg-gray-800/20 blur-xl"></div>
  <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-gray-400 rounded-full"></div>
  <div className="absolute top-2/3 left-1/3 w-1 h-1 bg-gray-500 rounded-full"></div>

  <div className="relative max-w-3xl mx-auto">
    <div className="inline-block px-3 py-1 text-xs font-medium bg-gray-900/30 text-gray-300 rounded-full border border-gray-800/50 mb-4">
      <Sparkles className="h-3 w-3 inline mr-1" />
      Share Your Brilliance
    </div>
    
    <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
      Where Great Ideas
      <br />
      <span className="text-gray-400">Come to Life</span>
    </h2>
    
    <p className="text-lg text-gray-300 max-w-xl mx-auto mb-6 leading-relaxed">
      A simple place to share and discover brilliant ideas from creative minds around the world. 
      Turn your thoughts into inspiration for others.
    </p>

    <SearchComponent/>

    {/* Stats */}
    <div className="flex justify-center items-center gap-6 mb-6 text-sm">
      <div className="text-center">
        <div className="text-xl font-bold text-white">1,247</div>
        <div className="text-gray-500">Ideas Shared</div>
      </div>
      <div className="w-px h-6 bg-gray-800/30"></div>
      <div className="text-center">
        <div className="text-xl font-bold text-white">892</div>
        <div className="text-gray-500">Creative Minds</div>
      </div>
      <div className="w-px h-6 bg-gray-800/30"></div>
      <div className="text-center">
        <div className="text-xl font-bold text-white">3.2k</div>
        <div className="text-gray-500">Collaborations</div>
      </div>
    </div>

    {/* CTA */}
    {!session && (
      <button 
        onClick={() => signIn()}
        className="bg-white hover:bg-gray-200 text-black font-semibold py-2.5 px-6 rounded-lg transition-all duration-200 shadow-lg flex items-center gap-2 mx-auto"
      >
        <Lightbulb className="h-4 w-4" />
        Start Sharing Ideas
      </button>
    )}
  </div>
</section>


      {/* Ideas Grid */}
      <main className="container mx-auto px-6 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ideas.map((idea) => (
            <div 
              key={idea.id}
              className="bg-gray-900/50 border border-gray-800/30 rounded-lg p-6 hover:border-gray-600/50 transition-all duration-200 hover:shadow-lg hover:shadow-gray-500/10 group backdrop-blur-sm cursor-pointer"
            >
              {/* Idea Title */}
              <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-gray-300 transition-colors line-clamp-2">
                {idea.title}
              </h3>
              
              {/* Idea Description */}
              <p className="text-gray-400 mb-4 line-clamp-3 text-sm leading-relaxed">
                {idea.description}
              </p>

              {/* Author and Date */}
              <div className="flex items-center gap-2 mb-4 text-sm text-gray-500">
                <User className="h-4 w-4" />
                <span>{idea.author}</span>
                <span>•</span>
                <Calendar className="h-3 w-3" />
                <span>{idea.date}</span>
              </div>

              {/* Engagement Stats */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-800/30">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1 text-gray-500 hover:text-gray-300 transition-colors cursor-pointer">
                    <Heart className="h-4 w-4" />
                    <span className="text-sm">{idea.likes}</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-500 hover:text-gray-300 transition-colors cursor-pointer">
                    <MessageCircle className="h-4 w-4" />
                    <span className="text-sm">{idea.comments}</span>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-gray-300 text-sm font-medium transition-colors">
                  View →
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Load More Button */}
        <div className="text-center mt-12">
          <button className="border border-gray-600/50 text-gray-300 hover:bg-gray-900/20 hover:border-gray-500 font-semibold py-3 px-8 rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-gray-500/10">
            Load More Ideas
          </button>
        </div>
      </main>
    </div>
  )
}