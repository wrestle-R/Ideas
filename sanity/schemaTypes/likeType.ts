import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'like',
  title: 'Like',
  type: 'document',
  fields: [
    defineField({
      name: 'ideaId',
      title: 'Idea ID',
      type: 'string',
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'object',
      fields: [
        {
          name: 'id',
          title: 'GitHub ID',
          type: 'string',
          validation: (Rule) => Rule.required()
        },
        {
          name: 'name',
          title: 'Name',
          type: 'string'
        }
      ],
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'createdAt',
      title: 'Created At',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      validation: (Rule) => Rule.required()
    })
  ],
  // Prevent duplicate likes from same user on same idea
  initialValue: {
    createdAt: new Date().toISOString()
  },
  preview: {
    select: {
      authorName: 'author.name',
      ideaId: 'ideaId',
      createdAt: 'createdAt'
    },
    prepare({ authorName, ideaId, createdAt }) {
      return {
        title: `${authorName || 'Anonymous'} liked idea`,
        subtitle: `Idea: ${ideaId} • ${new Date(createdAt).toLocaleDateString()}`
      }
    }
  }
})
