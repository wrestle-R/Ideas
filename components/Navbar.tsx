"use client"
import { useSession, signIn, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function Navbar() {
  const { data: session, status } = useSession()
  const router = useRouter()

  return (
    <nav className="bg-black border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Title */}
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold text-white">Ideas</h1>
          </div>

          {/* Auth Section */}
          <div className="flex items-center space-x-4">
            {status === "loading" ? (
              <div className="text-gray-500">Loading...</div>
            ) : session ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-300">
                  Welcome, {session.user?.name || session.user?.email}
                </span>
                <button
                  onClick={() => router.push("/idea/create")}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
                >
                  Create Idea
                </button>
                <button
                  onClick={() => signOut()}
                  className="bg-white hover:bg-gray-200 text-black font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
                >
                  Sign Out
                </button>
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