import React from 'react'
import Form from 'next/form'
import { Search, Filter } from 'lucide-react'

const SearchComponent = () => {
  return (
    <div className="w-full max-w-2xl mx-auto mb-8">
      <Form action="/search" className="relative" scroll={false}>
        <div className="relative flex items-center">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input 
              type="text" 
              name="q"
              placeholder="Search for ideas, topics, or creators..."
              className="w-full pl-12 pr-4 py-3.5 bg-gray-900/50 border border-gray-700/50 rounded-l-lg text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-600/50 focus:border-gray-600 transition-all duration-200 backdrop-blur-sm"
            />
          </div>
          
          {/* Filter Button */}
          <button
            type="button"
            className="px-4 py-3.5 bg-gray-900/50 border-t border-r border-b border-gray-700/50 text-gray-400 hover:text-gray-300 hover:bg-gray-800/50 transition-all duration-200 backdrop-blur-sm"
            title="Filters"
          >
            <Filter className="h-5 w-5" />
          </button>
          
          {/* Search Button */}
          <button 
            type="submit"
            className="px-6 py-3.5 bg-white hover:bg-gray-200 text-black font-semibold rounded-r-lg transition-all duration-200 shadow-lg flex items-center gap-2"
          >
            Search
          </button>
        </div>
        
        {/* Quick filters */}
        <div className="flex flex-wrap gap-2 mt-3">
          <button 
            type="button"
            className="px-3 py-1.5 text-xs font-medium bg-gray-900/30 text-gray-300 rounded-full border border-gray-800/50 hover:border-gray-600/50 hover:bg-gray-800/30 transition-all duration-200"
          >
            🤖 AI & Tech
          </button>
          <button 
            type="button"
            className="px-3 py-1.5 text-xs font-medium bg-gray-900/30 text-gray-300 rounded-full border border-gray-800/50 hover:border-gray-600/50 hover:bg-gray-800/30 transition-all duration-200"
          >
            🌱 Sustainability
          </button>
          <button 
            type="button"
            className="px-3 py-1.5 text-xs font-medium bg-gray-900/30 text-gray-300 rounded-full border border-gray-800/50 hover:border-gray-600/50 hover:bg-gray-800/30 transition-all duration-200"
          >
            🏠 Lifestyle
          </button>
          <button 
            type="button"
            className="px-3 py-1.5 text-xs font-medium bg-gray-900/30 text-gray-300 rounded-full border border-gray-800/50 hover:border-gray-600/50 hover:bg-gray-800/30 transition-all duration-200"
          >
            💼 Business
          </button>
          <button 
            type="button"
            className="px-3 py-1.5 text-xs font-medium bg-gray-900/30 text-gray-300 rounded-full border border-gray-800/50 hover:border-gray-600/50 hover:bg-gray-800/30 transition-all duration-200"
          >
            🎨 Creative
          </button>
        </div>
      </Form>
    </div>
  )
}

export default SearchComponent