import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'comment',
  title: 'Comment',
  type: 'document',
  fields: [
    defineField({
      name: 'ideaId',
      title: 'Idea ID',
      type: 'string',
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'text',
      title: 'Comment Text',
      type: 'text',
      validation: (Rule) => Rule.required().min(1).max(500)
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
  initialValue: {
    createdAt: new Date().toISOString()
  },
  preview: {
    select: {
      text: 'text',
      authorName: 'author.name',
      createdAt: 'createdAt'
    },
    prepare({ text, authorName, createdAt }) {
      return {
        title: `${authorName || 'Anonymous'}: ${text.substring(0, 50)}${text.length > 50 ? '...' : ''}`,
        subtitle: new Date(createdAt).toLocaleDateString()
      }
    }
  }
})
      