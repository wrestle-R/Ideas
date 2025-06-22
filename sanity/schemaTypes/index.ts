import { type SchemaTypeDefinition } from 'sanity'

import {ideaType} from './ideaType'
import {bioType} from './bioType'
import commentType from './commentType'
import voteType from './voteType'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [ ideaType, bioType, commentType, voteType]
}

