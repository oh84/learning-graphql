const { photos, users } = require('../data')
let { _id } = require('../data')

module.exports = {
  postPhoto(parent, args) {
    const newPhoto = {
      id: _id++,
      ...args.input,
      created: new Date(),
    }
    photos.push(newPhoto)
    return newPhoto
  }
}
