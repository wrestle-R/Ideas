import { type SchemaTypeDefinition } from 'sanity'

import {ideaType} from './ideaType'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [ ideaType],
}
