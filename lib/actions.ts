'use server'

import { createClient } from '@sanity/client'
import { revalidatePath } from 'next/cache'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  token: process.env.SANITY_API_TOKEN, // This stays secure on the server
  useCdn: false,
  apiVersion: '2025-06-17'
})

async function fetchGitHubUserName(githubId: string): Promise<string | null> {
  try {
    if (githubId === 'anonymous') return null
    
    if (githubId.includes('@')) {
      return githubId.split('@')[0]
    }
    
    const response = await fetch(`https://api.github.com/user/${githubId}`, {
      headers: {
        'User-Agent': 'Ideas-App',
        ...(process.env.GITHUB_TOKEN && {
          'Authorization': `token ${process.env.GITHUB_TOKEN}`
        })
      }
    })
    
    if (response.ok) {
      const userData = await response.json()
      return userData.name || userData.login || null
    }
    
    return null
  } catch (error) {
    console.error('Error fetching GitHub user:', error)
    return null
  }
}

export async function createIdea(formData: FormData) {
  try {
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const category = formData.get('category') as string
    const notes = formData.get('notes') as string
    const authorId = formData.get('authorId') as string
    const authorName = formData.get('authorName') as string
    
    if (!title || !description) {
      return { error: 'Title and description are required' }
    }

    const generateSlug = (title: string) => {
      return title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .trim()
    }

    const slug = generateSlug(title)
    
    const newIdea = {
      _type: 'idea',
      title,
      slug: {
        _type: 'slug',
        current: slug
      },
      body: [
        {
          _type: 'block',
          _key: 'description',
          style: 'normal',
          children: [
            {
              _type: 'span',
              _key: 'span1',
              text: description,
              marks: []
            }
          ],
          markDefs: []
        }
      ],
      notes: notes || '',
      author: {
        id: authorId || 'anonymous',
        name: authorName || 'Anonymous User'
      },
      publishedAt: new Date().toISOString(),
      category: category || 'other'
    }

    const result = await client.create(newIdea)
    
    revalidatePath('/') // Refresh the page to show new idea
    return { success: true, idea: result }
    
  } catch (error) {
    console.error('Error creating idea:', error)
    return { error: 'Failed to create idea. Please try again.' }
  }
}

export async function createUserBio(formData: FormData) {
  try {
    const bio = formData.get('bio') as string
    const authorId = formData.get('authorId') as string
    const authorName = formData.get('authorName') as string
    
    if (!bio || !authorId) {
      return { error: 'Bio and author ID are required' }
    }

    const newBio = {
      _type: 'bio',
      bio,
      author: {
        id: authorId,
        name: authorName || 'Anonymous User'
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    const result = await client.create(newBio)
    
    revalidatePath('/profile')
    return { success: true, bio: result }
    
  } catch (error) {
    console.error('Error creating bio:', error)
    return { error: 'Failed to create bio. Please try again.' }
  }
}

export async function getUserBio(authorId: string) {
  try {
    const query = `*[_type == "bio" && author.id == "${authorId}"][0]`
    const bio = await client.fetch(query)
    return bio
  } catch (error) {
    console.error('Error fetching bio:', error)
    return null
  }
}

export async function updateUserBio(bioId: string, newBio: string) {
  try {
    const result = await client
      .patch(bioId)
      .set({ 
        bio: newBio,
        updatedAt: new Date().toISOString()
      })
      .commit()
    
    revalidatePath('/profile')
    return { success: true, bio: result }
    
  } catch (error) {
    console.error('Error updating bio:', error)
    return { error: 'Failed to update bio. Please try again.' }
  }
}

export async function updateIdea(ideaId: string, formData: { title: string; description: string; category: string; notes: string }) {
  try {
    const { title, description, category, notes } = formData
    
    if (!title || !description) {
      return { error: 'Title and description are required' }
    }

    const generateSlug = (title: string) => {
      return title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .trim()
    }

    const slug = generateSlug(title)
    
    const updateData = {
      title,
      slug: {
        _type: 'slug',
        current: slug
      },
      body: [
        {
          _type: 'block',
          _key: 'description',
          style: 'normal',
          children: [
            {
              _type: 'span',
              _key: 'span1',
              text: description,
              marks: []
            }
          ],
          markDefs: []
        }
      ],
      notes: notes || '',
      category: category || 'other',
      updatedAt: new Date().toISOString()
    }

    const result = await client
      .patch(ideaId)
      .set(updateData)
      .commit()
    
    revalidatePath('/my-ideas')
    return { success: true, idea: result }
    
  } catch (error) {
    console.error('Error updating idea:', error)
    return { error: 'Failed to update idea. Please try again.' }
  }
}

export async function addComment(ideaId: string, text: string, authorId: string, providedAuthorName?: string) {
  try {
    if (!text.trim()) {
      return { error: 'Comment text is required' }
    }

    let authorName = 'Anonymous'
    
    // If user provided a name (from session), use it
    // Otherwise try to fetch from GitHub API
    if (providedAuthorName && providedAuthorName !== 'Anonymous') {
      authorName = providedAuthorName
    } else if (authorId !== 'anonymous') {
      // Try to fetch the real name from GitHub
      const githubName = await fetchGitHubUserName(authorId)
      if (githubName) {
        authorName = githubName
      }
    }

    const newComment = {
      _type: 'comment',
      ideaId,
      text: text.trim(),
      author: {
        id: authorId,
        name: authorName
      },
      createdAt: new Date().toISOString()
    }

    const result = await client.create(newComment)
    revalidatePath(`/idea/${ideaId}`)
    return { success: true, comment: result }
  } catch (error) {
    console.error('Error adding comment:', error)
    return { error: 'Failed to add comment. Please try again.' }
  }
}
