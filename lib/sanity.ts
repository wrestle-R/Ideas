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
    "text": body[0].children[0].text
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
