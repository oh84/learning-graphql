const { ObjectId } = require("mongodb");

module.exports = {
  me: (parent, args, { currentUser }) =>
    currentUser,

  totalPhotos: (parent, args, { db }) =>
    db.collection('photos')
      .estimatedDocumentCount(),

  allPhotos: (parent, args, { db }) =>
    db.collection('photos')
      .find()
      .toArray(),

  Photo: (parent, { id }, { db }) =>
    db.collection('photos')
      .findOne({ _id: ObjectId.createFromHexString(id) }),

  totalUsers: (parent, args, { db }) =>
    db.collection('users')
      .estimatedDocumentCount(),

  allUsers: (parent, args, { db }) =>
    db.collection('users')
      .find()
      .toArray(),

  User: (parent, { githubLogin }, { db }) =>
    db.collection('users')
      .findOne({ githubLogin }),
}
