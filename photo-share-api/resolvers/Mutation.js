const { ObjectId } = require('mongodb')

const { authorizeWithGithub } = require('../lib')

module.exports = {
  async postPhoto(parent, { input }, { db, currentUser }) {
    if (!currentUser) {
      throw new Error('only an authorized user can post a photo')
    }

    const newPhoto = {
      ...input,
      userID: currentUser.githubLogin,
      created: new Date(),
    }

    const { insertedId } = await db.collection('photos').insertOne(newPhoto)
    newPhoto.id = insertedId

    return newPhoto
  },

  async tagPhoto(parent, { userID, photoID }, { db }) {
    await db.collection('tags')
      .replaceOne({ userID, photoID }, { userID, photoID }, { upsert: true })

    return db.collection('photos')
      .findOne({ _id: ObjectId.createFromHexString(photoID) })
  },

  async githubAuth(parent, { code }, { db }) {
    let {
      message,
      access_token,
      avatar_url,
      login,
      name,
    } = await authorizeWithGithub({
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code,
    })

    if (message) {
      throw new Error(message)
    }

    let latestUserInfo = {
      name,
      githubLogin: login,
      githubToken: access_token,
      avatar: avatar_url,
    }

    const user = await db
      .collection('users')
      .findOneAndReplace({ githubLogin: login }, latestUserInfo, { upsert: true, returnDocument: 'after' })

    return { user, token: access_token }
  },

  async addFakeUsers(parent, { count }, { db }) {
    const randomUserApi = `https://randomuser.me/api/?results=${count}`

    const { results } = await fetch(randomUserApi)
      .then(res => res.json())

    const users = results.map((r) => ({
      githubLogin: r.login.username,
      name: `${r.name.first} ${r.name.last}`,
      avatar: r.picture.thumbnail,
      githubToken: r.login.sha1,
    }))

    await db.collection('users').insertMany(users)

    return users
  },

  async fakeUserAuth(parent, { githubLogin }, { db }) {
    const user = await db.collection('users').findOne({ githubLogin })

    if (!user) {
      throw new Error(`Cannot find user with githubLogin "${githubLogin}"`)
    }

    return {
      token: user.githubToken,
      user,
    }
  },
}
