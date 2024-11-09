const { GraphQLScalarType } = require('graphql')

const { users, photos, tags } = require('../data')

module.exports = {
  Photo: {
    url: (parent) => `http://example.com/img/${parent.id}.jpg`,
    postedBy: (parent) => users.find((user) => user.githubLogin === parent.githubUser),
    taggedUsers: (parent) =>
      tags
        .filter((tag) => tag.photoID === parent.id)
        .map((tag) => tag.userID)
        .map((userID) => users.find((user) => user.githubLogin === userID)),
  },
  User: {
    postedPhotos: (parent) => photos.filter((photo) => photo.githubUser === parent.githubLogin),
    inPhotos: (parent) =>
      tags
        .filter((tag) => tag.userID === parent.id)
        .map((tag) => tag.photoID)
        .map((photoID) => photos.find((photo) => photo.id === photoID)),
  },
  DateTime: new GraphQLScalarType({
    name: 'DateTime',
    description: 'A valid date time value.',
    serialize: (value) => new Date(value).toISOString(),
    parseValue: (value) => new Date(value),
    parseLiteral: (ast) => ast.value,
  }),
}
