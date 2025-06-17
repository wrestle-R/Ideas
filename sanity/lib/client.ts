import { createClient } from 'next-sanity'

import { apiVersion, dataset, projectId } from '../env'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false, 
  token: process.env.SANITY_API_TOKEN// Set to false if statically generating pages, using ISR or tag-based revalidation
})
