"use client"
import { useSession, signIn, signOut } from "next-auth/react"
import { useState } from "react"
import Link from "next/link"
import { ChevronDown, User, LogOut } from "lucide-react"
import  Lightbulb from "../public/icon_no_bg.png"
import Image from "next/image"

export default function Navbar() {
  const { data: session, status } = useSession()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  return (
    <nav className="bg-black border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Title */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center space-x-2">
              <Image
              src={Lightbulb} alt="Ideas Logo"
              className="h-8 w-8"
              />
              <h1 className="text-2xl font-bold text-white">Ideas</h1>
            </Link>
          </div>

          {/* Auth Section */}
          <div className="flex items-center space-x-4">
            {status === "loading" ? (
              <div className="text-gray-500">Loading...</div>
            ) : session ? (
              <div className="relative">
                {/* Profile Dropdown Button */}
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors duration-200 focus:outline-none"
                >
                  <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4" />
                  </div>
                  <span className="font-medium">{session.user?.name || session.user?.email}</span>
                  <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-gray-900 border border-gray-700 rounded-lg shadow-lg py-1 z-50">
                    <Link
                      href="/my-ideas"
                      className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors duration-200"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <Image
              src={Lightbulb} alt="Ideas Logo"
              className="h-4 w-4"
              />
                      My Ideas
                    </Link>
                    <Link
                      href="/profile"
                      className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors duration-200"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <User className="h-4 w-4 mr-3" />
                      View Profile
                    </Link>
                    <hr className="border-gray-700 my-1" />
                    <button
                      onClick={() => {
                        setIsDropdownOpen(false)
                        signOut()
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors duration-200"
                    >
                      <LogOut className="h-4 w-4 mr-3" />
                      Sign Out
                    </button>
                  </div>
                )}

                {/* Click outside to close dropdown */}
                {isDropdownOpen && (
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setIsDropdownOpen(false)}
                  />
                )}
              </div>
            ) : (
              <button
                onClick={() => signIn()}
                className="bg-white hover:bg-gray-200 text-black font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}