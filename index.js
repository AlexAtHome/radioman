const { token, volume, roomId, showSongName } = require('./config.json')
const Discord = require('discord.js')
const path = require('path')
const fs = require('fs')
const client = new Discord.Client()

const getRandomTrack = () => playlist[~~(playlist.length * Math.random())]

let prevTrack
let playlist

const getPlaylist = () =>
  fs.readdir('./music/', (err, files) => {
    if (err) throw err
    playlist = files
  })

const playMusic = conn => {
  let newTrack = getRandomTrack()
  while (newTrack === prevTrack) {
    newTrack = getRandomTrack()
  }

  let stream = path.resolve(__dirname, `./music/${newTrack}`)
  let dispatcher = conn.playStream(stream, { volume })
  prevTrack = newTrack
  console.log(`[${new Date().toUTCString()}] ⏯  ${newTrack}`)

  dispatcher.on('end', () => joinChannel(roomId))
  dispatcher.on('error', () => joinChannel(roomId))

  if (showSongName) {
    client.user.setActivity(newTrack.slice(0, newTrack.lastIndexOf('.')), { type: 'LISTENING' }).catch(console.error)
  }
}

const joinChannel = ch => {
  let connection = client.voiceConnections.get(ch)
  if (connection) {
    playMusic(connection)
  } else {
    client.channels.get(ch).join().then(playMusic)
  }
}

client.on('ready', () => {
  console.log('Discord-Podcast is ready.')
  getPlaylist()
  joinChannel(roomId)
})
client.on('error', err => {
  console.error(err)
})
client.on('disconnect', () => {
  console.log('sorry, connection problems')
  return client.destroy()
})

client.login(token)
