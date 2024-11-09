const { photos } = require('../data')

module.exports = {
  totalPhotos: () => photos.length,
  allPhotos: (parent, args) => {
    if (args.after) {
      return photos.filter((photo) => new Date(photo.created).getTime() > args.after.getTime())
    }
    return photos
  },
}
