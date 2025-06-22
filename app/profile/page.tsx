"use client"
import { useSession } from 'next-auth/react'
import { User, Mail, Github, Edit, Plus } from 'lucide-react'
import { useState, useEffect } from 'react'
import { createUserBio, getUserBio, updateUserBio } from '../../lib/actions'
import Navbar from '@/components/Navbar'

const ProfilePage = () => {
  const { data: session, status } = useSession()
  const [showBioForm, setShowBioForm] = useState(false)
  const [bio, setBio] = useState('')
  const [existingBio, setExistingBio] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (session?.user?.githubId) {
      loadUserBio()
    }
  }, [session])

  const loadUserBio = async () => {
    if (session?.user?.githubId) {
      const userBio = await getUserBio(session.user.githubId)
      setExistingBio(userBio)
      if (userBio) {
        setBio(userBio.bio)
      }
    }
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Please sign in to view your profile</div>
      </div>
    )
  }

  const handleBioSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      if (existingBio) {
        // Update existing bio
        const result = await updateUserBio(existingBio._id, bio)
        if (result.success) {
          await loadUserBio()
          setShowBioForm(false)
        }
      } else {
        // Create new bio
        const formData = new FormData()
        formData.append('bio', bio)
        formData.append('authorId', session?.user?.githubId || '')
        formData.append('authorName', session?.user?.name || '')
        
        const result = await createUserBio(formData)
        if (result.success) {
          await loadUserBio()
          setShowBioForm(false)
        }
      }
    } catch (error) {
      console.error('Error saving bio:', error)
    } finally {
      setIsLoading(false)
    }
  }
  console.log(session.user)
  return (
    <div className="">
    <Navbar/>
    <div className="min-h-screen bg-black py-8">
        
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gray-900 border border-gray-800 rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gray-800 border-b border-gray-700 px-6 py-8">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-gray-700 border border-gray-600 rounded-full flex items-center justify-center">
                {session.user?.image ? (
                  <img 
                    src={session.user.image} 
                    alt="Profile" 
                    className="w-20 h-20 rounded-full"
                  />
                ) : (
                  <User className="h-10 w-10 text-gray-400" />
                )}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">
                  {session.user?.name || 'Anonymous User'}
                </h1>
                <p className="text-gray-400">Developer & Innovator</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-white mb-4">Personal Information</h2>
                
                {session.user?.email && (
                  <div className="flex items-center space-x-3 text-gray-300">
                    <Mail className="h-5 w-5" />
                    <span>{session.user.email}</span>
                  </div>
                )}

                {session.user?.githubId && (
                  <div className="flex items-center space-x-3 text-gray-300">
                    <Github className="h-5 w-5" />
                    <span>GitHub ID: {session.user.githubId}</span>
                  </div>
                )}
              </div>

              {/* Account Details */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-white mb-4">Account Details</h2>
                
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-400 mb-2">Session Status</h3>
                  <p className="text-green-400">Active</p>
                </div>

                <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-400 mb-2">Account Type</h3>
                  <p className="text-white">GitHub User</p>
                </div>
              </div>
            </div>

            {/* Bio Section */}
            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-white">Bio</h2>
                    {!existingBio && (
                  <button
                    onClick={() => setShowBioForm(true)}
                    className="flex items-center space-x-2 bg-white text-black px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Create Bio</span>
                  </button>
                )}
              </div>

              {showBioForm ? (
                <form onSubmit={handleBioSubmit} className="space-y-4">
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell us about yourself..."
                    className="w-full h-32 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-gray-500 focus:outline-none"
                    required
                    disabled={isLoading}
                  />
                  <div className="flex space-x-3">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="bg-white text-black px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                    >
                      {isLoading ? 'Saving...' : existingBio ? 'Update Bio' : 'Save Bio'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowBioForm(false)
                        setBio(existingBio?.bio || '')
                      }}
                      disabled={isLoading}
                      className="bg-gray-800 border border-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                  {existingBio ? (
                    <div>
                      <p className="text-white">{existingBio.bio}</p>
                      <button
                        onClick={() => setShowBioForm(true)}
                        className="mt-3 flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                        <span>Edit Bio</span>
                      </button>
                    </div>
                  ) : (
                    <p className="text-gray-400">No bio added yet. Click "Create Bio" to add one.</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
    
  )
}

export default ProfilePage