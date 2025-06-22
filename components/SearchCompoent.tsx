import React from 'react'
import { Search } from 'lucide-react'

interface SearchComponentProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  selectedCategory: string
  onCategoryChange: (category: string) => void
}

const SearchComponent = ({ 
  searchQuery, 
  onSearchChange, 
  selectedCategory, 
  onCategoryChange 
}: SearchComponentProps) => {
  const categories = [
    { label: 'AI & Tech', value: 'technology' },
    { label: 'Health', value: 'health' },
    { label: 'Lifestyle', value: 'other' },
    { label: 'Business', value: 'business' },
    { label: 'Creative', value: 'creative' },
    { label: 'Education', value: 'education' },
    { label: 'Entertainment', value: 'entertainment' }
  ]

  return (
    <div className="w-full max-w-3xl mx-auto mb-10">
      {/* Main Search Bar */}
      <div className="relative flex items-center shadow-lg">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 z-10" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search for ideas, topics, or creators..."
            className="w-full pl-12 pr-6 py-4 bg-gray-900/60 border border-gray-700/60 rounded-xl text-white text-base placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500/60 focus:border-gray-500/60 transition-all duration-300 backdrop-blur-md hover:bg-gray-900/70 focus:bg-gray-900/80"
          />
        </div>
      </div>
      
      {/* Category Filters */}
      <div className="mt-5">
        <div className="flex flex-wrap gap-3 justify-center">
          {categories.map((category) => (
            <button 
              key={category.value}
              type="button"
              onClick={() => {
                if (selectedCategory === category.value) {
                  onCategoryChange('') // Reset filter
                } else {
                  onCategoryChange(category.value)
                }
              }}
              className={`px-4 py-2.5 text-sm font-medium rounded-full border transition-all duration-300 transform hover:scale-105 active:scale-95 ${
                selectedCategory === category.value
                  ? 'bg-white/25 text-white border-white/50 shadow-lg shadow-white/10'
                  : 'bg-gray-900/40 text-gray-300 border-gray-700/60 hover:border-gray-600/70 hover:bg-gray-800/50 hover:text-gray-200'
              }`}
            >
              <span className="flex items-center gap-2">
                {category.label}
              </span>
            </button>
          ))}
          {/* Optionally, add an "All" button for clarity */}
          {/* 
          <button
            type="button"
            onClick={() => onCategoryChange('')}
            className={`px-4 py-2.5 text-sm font-medium rounded-full border transition-all duration-300 ${
              selectedCategory === '' 
                ? 'bg-white/25 text-white border-white/50 shadow-lg shadow-white/10'
                : 'bg-gray-900/40 text-gray-300 border-gray-700/60 hover:border-gray-600/70 hover:bg-gray-800/50 hover:text-gray-200'
            }`}
          >
            All
          </button>
          */}
        </div>
      </div>
    </div>
  )
}

export default SearchComponent