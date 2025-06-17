import {DocumentTextIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const ideaType = defineType({
  name: 'idea',
  title: 'Idea',
  type: 'document',
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: {
        source: 'title',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          {title: 'Technology', value: 'technology'},
          {title: 'Business', value: 'business'},
          {title: 'Creative', value: 'creative'},
          {title: 'Health', value: 'health'},
          {title: 'Education', value: 'education'},
          {title: 'Entertainment', value: 'entertainment'},
          {title: 'Other', value: 'other'},
        ]
      }
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'object',
      fields: [
        defineField({
          name: 'id',
          title: 'User ID',
          type: 'string',
        }),
        defineField({
          name: 'name',
          title: 'Name',
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'notes',
      title: 'Notes',
      type: 'text',
      description: 'Additional notes in markdown format',
    }),
    defineField({
      name: 'mainImage',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
        })
      ]
    }),
    defineField({
      name: 'publishedAt',
      type: 'datetime',
    }),
    defineField({
      name: 'body',
      type: 'array',
      of: [
        {
          type: 'block',
        },
        {
          type: 'image',
          options: {
            hotspot: true,
          },
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      media: 'mainImage',
      publishedAt: 'publishedAt',
      category: 'category',
      authorName: 'author.name',
    },
    prepare(selection) {
      const {publishedAt, category, authorName} = selection
      return {
        ...selection, 
        subtitle: `${authorName || 'Unknown'} • ${category || 'No category'} • ${publishedAt ? new Date(publishedAt).toLocaleDateString() : 'No date'}`
      }
    },
  },
})