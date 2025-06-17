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
