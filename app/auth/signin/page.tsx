"use client"
import { signIn, getSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { 
  Github, 
  Lightbulb, 
  Sparkles,
  ArrowLeft,
  Star
} from "lucide-react"
import Link from "next/link"

export default function SignIn() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const checkSession = async () => {
      const session = await getSession()
      if (session) {
        router.push('/')
      }
    }
    checkSession()
  }, [router])

  const handleSignIn = async (provider: string) => {
    setIsLoading(true)
    try {
      await signIn(provider, { callbackUrl: '/' })
    } catch (error) {
      console.error('Sign in error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-8 left-8 w-16 h-16 rounded-full bg-gray-900/30 blur-xl"></div>
      <div className="absolute bottom-8 right-8 w-20 h-20 rounded-full bg-gray-800/30 blur-xl"></div>
      <div className="absolute top-1/4 right-1/3 w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
      <div className="absolute top-3/4 left-1/4 w-1 h-1 bg-gray-500 rounded-full animate-pulse"></div>
      <div className="absolute top-1/2 left-1/5 w-1 h-1 bg-gray-400 rounded-full"></div>
      <div className="absolute bottom-1/3 right-1/5 w-1 h-1 bg-gray-500 rounded-full"></div>

      {/* Floating particles */}
      {/* <div className="absolute inset-0">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-gray-600 rounded-full opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
      </div> */}

      <div className="relative z-10 w-full max-w-md mx-auto px-6">
        {/* Back to home link */}
        <Link 
          href="/"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-gray-300 transition-colors mb-8 group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Back to home
        </Link>

        {/* Main card */}
        <div className="bg-gray-900/50 border border-gray-800/50 rounded-2xl p-8 backdrop-blur-sm hover:border-gray-700/50 transition-all duration-300 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-800/50 rounded-full mb-4 border border-gray-700/50">
              <Lightbulb className="h-8 w-8 text-white" />
            </div>
            
            <h1 className="text-3xl font-bold text-white mb-2">
              Welcome Back
            </h1>
            
            <p className="text-gray-400 leading-relaxed">
              Sign in to share your brilliant ideas and connect with creative minds
            </p>
          </div>

          {/* Benefits */}
          <div className="space-y-3 mb-8">
            <div className="flex items-center gap-3 text-gray-300">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span className="text-sm">Share unlimited ideas</span>
            </div>
            <div className="flex items-center gap-3 text-gray-300">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span className="text-sm">Connect with innovators</span>
            </div>
            <div className="flex items-center gap-3 text-gray-300">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span className="text-sm">Get feedback and collaborate</span>
            </div>
          </div>

          {/* Sign in button */}
          <button
            onClick={() => handleSignIn('github')}
            disabled={isLoading}
            className="w-full bg-white hover:bg-gray-100 text-black font-semibold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 group"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-gray-400 border-t-black rounded-full animate-spin"></div>
            ) : (
              <>
                <Github className="h-5 w-5" />
                <span>Continue with GitHub</span>
                <Star className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </>
            )}
          </button>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              By signing in, you agree to our terms and privacy policy
            </p>
          </div>
        </div>

        {/* Bottom decoration */}
        <div className="text-center mt-8">
          <div className="inline-flex items-center gap-2 text-gray-600">
            <Sparkles className="h-3 w-3" />
            <span className="text-xs">Secure authentication powered by NextAuth</span>
            <Sparkles className="h-3 w-3" />
          </div>
        </div>
      </div>
    </div>
  )
}
