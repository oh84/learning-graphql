const { GraphQLScalarType } = require('graphql')
const { ObjectId } = require('mongodb')

module.exports = {
  Photo: {
    id: (parent) => parent.id || parent._id,

    url: (parent) => `/img/photos/${parent._id}.jpg`,

    postedBy: (parent, args, { db }) =>
      db.collection('users')
        .findOne({ githubLogin: parent.userID }),

    taggedUsers: async (parent, args, { db }) => {
      const tags = await db.collection('tags').find().toArray()
      const userIDs = tags
        .filter((tag) => tag.photoID === parent._id.toString())
        .map((tag) => tag.userID)

      return db.collection('users')
        .find({ githubLogin: { $in: userIDs } })
        .toArray()
    },
  },

  User: {
    postedPhotos: (parent, args, { db }) =>
      db.collection('photos')
        .find({ userID: parent.githubLogin })
        .toArray(),

    inPhotos: async (parent, args, { db }) => {
      const tags = await db.collection('tags').find().toArray()
      const photoIDs = tags
        .filter((tag) => tag.userID === parent.githubLogin)
        .map((tag) => ObjectId.createFromHexString(tag.photoID))

      return db.collection('photos')
        .find({ _id: { $in: photoIDs } })
        .toArray()
    },
  },

  DateTime: new GraphQLScalarType({
    name: 'DateTime',
    description: 'A valid date time value.',
    serialize: (value) => new Date(value).toISOString(),
    parseValue: (value) => new Date(value),
    parseLiteral: (ast) => ast.value,
  }),
}
