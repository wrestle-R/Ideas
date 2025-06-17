export const bioType = {
  name: 'bio',
  title: 'Bio',
  type: 'document',
  fields: [
    {
      name: 'bio',
      title: 'Bio',
      type: 'text',
      validation: (Rule: any) => Rule.required().min(10).max(500)
    },
    {
      name: 'author',
      title: 'Author',
      type: 'object',
      fields: [
        {
          name: 'id',
          title: 'Author ID',
          type: 'string'
        },
        {
          name: 'name',
          title: 'Author Name',
          type: 'string'
        }
      ]
    },
    {
      name: 'createdAt',
      title: 'Created At',
      type: 'datetime'
    },
    {
      name: 'updatedAt',
      title: 'Updated At',
      type: 'datetime'
    }
  ]
}
