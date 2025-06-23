import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'vote',
  title: 'Vote',
  type: 'document',
  fields: [
    defineField({
      name: 'ideaId',
      title: 'Idea ID',
      type: 'string',
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'voteType',
      title: 'Vote Type',
      type: 'string',
      options: {
        list: [
          { title: 'Upvote', value: 'upvote' },
          { title: 'Downvote', value: 'downvote' }
        ]
      },
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'object',
      fields: [
        defineField({
          name: 'id',
          title: 'ID',
          type: 'string',
          validation: (Rule) => Rule.required()
        }),
        defineField({
          name: 'name',
          title: 'Name',
          type: 'string'
        })
      ],
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'createdAt',
      title: 'Created At',
      type: 'datetime',
      validation: (Rule) => Rule.required()
    })
  ]
})