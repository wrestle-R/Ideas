import { type SchemaTypeDefinition } from 'sanity'

import {ideaType} from './ideaType'
import {bioType} from './bioType'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [ ideaType, bioType ]
}
