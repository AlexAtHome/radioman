const fs = require('fs')
const argument = require('yargs').argv
const config = fs.existsSync('../config.json')
  ? require('./config.json')
  : {}

module.exports = {
  token: argument.token || config.token || process.env.token,
  roomId: argument.roomId || config.roomId || process.env.roomId,
  volume: argument.volume || config.volume || process.env.volume,
  showSongName: argument.showSongName || config.showSongName || process.env.showSongName,
  stream: argument.stream || config.stream || process.env.stream
}
