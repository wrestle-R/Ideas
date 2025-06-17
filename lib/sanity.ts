import { createClient } from '@sanity/client'

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  useCdn: true,
  apiVersion: '2025-06-17'
})

export async function getIdeas(limit: number = 12, offset: number = 0) {
  const query = `*[_type == "idea"] | order(publishedAt desc) [${offset}...${offset + limit}] {
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

export async function getTotalIdeasCount() {
  const query = `count(*[_type == "idea"])`
  return await client.fetch(query)
}
