import { createClient } from '@sanity/client'

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  useCdn: true,
  apiVersion: '2025-06-17'
})

export async function getIdeas(limit: number = 12, offset: number = 0, searchQuery?: string, category?: string) {
  let filterConditions = ['_type == "idea"']
  
  // Add search condition
  if (searchQuery && searchQuery.trim()) {
    filterConditions.push(`(title match "*${searchQuery}*" || body[].children[].text match "*${searchQuery}*" || author.name match "*${searchQuery}*")`)
  }
  
  // Add category condition
  if (category && category.trim()) {
    filterConditions.push(`category == "${category}"`)
  }
  
  const filter = filterConditions.join(' && ')
  
  const query = `*[${filter}] | order(publishedAt desc) [${offset}...${offset + limit}] {
    _id,
    title,
    slug,
    category,
    notes,
    publishedAt,
    author,
    "text": body[0].children[0].text,
    "likesCount": count(*[_type == "like" && ideaId == ^._id]),
    "commentsCount": count(*[_type == "comment" && ideaId == ^._id])
  }`
  
  return await client.fetch(query)
}

export async function getTotalIdeasCount(searchQuery?: string, category?: string) {
  let filterConditions = ['_type == "idea"']
  
  // Add search condition
  if (searchQuery && searchQuery.trim()) {
    filterConditions.push(`(title match "*${searchQuery}*" || body[].children[].text match "*${searchQuery}*" || author.name match "*${searchQuery}*")`)
  }
  
  // Add category condition
  if (category && category.trim()) {
    filterConditions.push(`category == "${category}"`)
  }
  
  const filter = filterConditions.join(' && ')
  const query = `count(*[${filter}])`
  
  return await client.fetch(query)
}

export async function getIdeaById(id: string) {
  const query = `*[_type == "idea" && _id == "${id}"][0] {
    _id,
    title,
    slug,
    category,
    notes,
    publishedAt,
    author,
    body,
    "text": body[0].children[0].text
  }`
  
  return await client.fetch(query)
}

export async function getIdeasByAuthor(authorId: string, limit: number = 50, offset: number = 0) {
  const query = `*[_type == "idea" && author.id == "${authorId}"] | order(publishedAt desc) [${offset}...${offset + limit}] {
    _id,
    title,
    slug,
    category,
    notes,
    publishedAt,
    author,
    "text": body[0].children[0].text
  }`
  
  return await client.fetch(query)
}

export async function getAuthorIdeasCount(authorId: string) {
  const query = `count(*[_type == "idea" && author.id == "${authorId}"])`
  return await client.fetch(query)
}

export async function getAuthorInfo(authorId: string) {
  const query = `*[_type == "idea" && author.id == "${authorId}"][0] {
    author
  }`
  
  const result = await client.fetch(query)
  return result?.author || null
}

export async function getUserBio(authorId: string) {
  const query = `*[_type == "bio" && author.id == "${authorId}"][0]`
  return await client.fetch(query)
}

export async function getLikesForIdea(ideaId: string) {
  const query = `*[_type == "like" && ideaId == "${ideaId}"] | order(createdAt desc) {
    _id,
    author,
    createdAt
  }`
  
  return await client.fetch(query)
}

// Fetch all comments for an idea, sorted oldest first (for full history)
export async function getAllCommentsForIdea(ideaId: string) {
  const query = `*[_type == "comment" && ideaId == "${ideaId}"] | order(createdAt asc) {
    _id,
    text,
    author,
    createdAt
  }`
  return await client.fetch(query)
}

// Existing function (kept for compatibility, but sorts newest first)
export async function getCommentsForIdea(ideaId: string) {
  const query = `*[_type == "comment" && ideaId == "${ideaId}"] | order(createdAt desc) {
    _id,
    text,
    author,
    createdAt
  }`
  
  return await client.fetch(query)
}

export async function checkUserLiked(ideaId: string, authorId: string) {
  const query = `*[_type == "like" && ideaId == "${ideaId}" && author.id == "${authorId}"][0]`
  const result = await client.fetch(query)
  return !!result
}

export async function getLikeCount(ideaId: string) {
  const query = `count(*[_type == "like" && ideaId == "${ideaId}"])`
  return await client.fetch(query)
}

export async function getCommentCount(ideaId: string) {
  const query = `count(*[_type == "comment" && ideaId == "${ideaId}"])`
  return await client.fetch(query)
}

export async function getEngagementCounts(ideaIds: string[]) {
  if (ideaIds.length === 0) return []
  
  const query = `*[_type == "idea" && _id in [${ideaIds.map(id => `"${id}"`).join(', ')}]] {
    _id,
    "likesCount": count(*[_type == "like" && ideaId == ^._id]),
    "commentsCount": count(*[_type == "comment" && ideaId == ^._id])
  }`
  
  return await client.fetch(query)
}

export async function getIdeasWithUserLikes(limit: number = 12, offset: number = 0, searchQuery?: string, category?: string, userId?: string) {
  let filterConditions = ['_type == "idea"']
  
  // Add search condition
  if (searchQuery && searchQuery.trim()) {
    filterConditions.push(`(title match "*${searchQuery}*" || body[].children[].text match "*${searchQuery}*" || author.name match "*${searchQuery}*")`)
  }
  
  // Add category condition
  if (category && category.trim()) {
    filterConditions.push(`category == "${category}"`)
  }
  
  const filter = filterConditions.join(' && ')
  
  const query = `*[${filter}] | order(publishedAt desc) [${offset}...${offset + limit}] {
    _id,
    title,
    slug,
    category,
    notes,
    publishedAt,
    author,
    "text": body[0].children[0].text,
    "likesCount": count(*[_type == "like" && ideaId == ^._id]),
    "commentsCount": count(*[_type == "comment" && ideaId == ^._id]),
    "userLiked": ${userId ? `count(*[_type == "like" && ideaId == ^._id && author.id == "${userId}"]) > 0` : 'false'}
  }`
  
  return await client.fetch(query)
}

export async function checkMultipleUserLikes(ideaIds: string[], userId: string) {
  if (ideaIds.length === 0 || !userId) return []
  
  const query = `*[_type == "like" && ideaId in [${ideaIds.map(id => `"${id}"`).join(', ')}] && author.id == "${userId}"] {
    ideaId
  }`
  
  const likes = await client.fetch(query)
  return likes.map((like: any) => like.ideaId)
}
