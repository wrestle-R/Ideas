export default {
  name: "vote",
  title: "Vote",
  type: "document",
  fields: [
    {
      name: "post",
      title: "Post",
      type: "reference",
      to: [{ type: "idea" }]
    },
    {
      name: "count",
      title: "Vote Count",
      type: "number",
      initialValue: 0
    },
    {
      name: "users",
      title: "Users",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "githubId",
              title: "GitHub ID",
              type: "string"
            },
            {
              name: "name",
              title: "Name",
              type: "string"
            },
            {
              name: "voteType",
              title: "Vote Type",
              type: "string",
              options: {
                list: [
                  { title: "Upvote", value: "upvote" },
                  { title: "Downvote", value: "downvote" }
                ],
                layout: "radio"
              }
            }
          ]
        }
      ]
    },
    {
      name: "createdAt",
      title: "Created At",
      type: "datetime"
    },
    {
      name: "updatedAt",
      title: "Updated At",
      type: "datetime"
    }
  ]
}