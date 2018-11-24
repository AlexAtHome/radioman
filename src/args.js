const argv = require('yargs').argv

module.exports = {
  token: argv.token || process.env.token,
  roomId: argv.roomId || process.env.roomId,
  volume: argv.volume || process.env.volume,
  showSongName: argv.showSongName || process.env.showSongName,
  stream: argv.stream || process.env.stream
}
