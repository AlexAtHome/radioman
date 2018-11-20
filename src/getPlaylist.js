const fs = require('fs')
const musicFormats = require('./getMusicFormats')

module.exports = () =>
  fs.readdir('./music/', (err, files) => {
    if (err) throw err

    let musicFiles = files.filter(f =>
      musicFormats.includes(f.split('.').pop()))

    if (musicFiles.length <= 0) throw new ReferenceError("Didn't get any music :c\nPut music files inside the 'music' folder.")

    return musicFiles
  })
