const { Client } = require('discord.js')
const path = require('path')
const fs = require('fs')

const bot = new Client()
const { token, volume, roomId, showSongName } = require('./config.json')

const getRandomTrack = () => playlist[~~(playlist.length * Math.random())]

let prevTrack = ''
let playlist = {}

const musicFormats = ['flac', 'mp3', 'wav']

const getPlaylist = () => 
  fs.readdir('./music/', (err, files) => {
    if (err) throw err

    const musicFiles = files.filter(f => musicFormats.includes(f.split('.').pop()))
    if (musicFiles.length <= 0) throw "Didn't get any music :c\nPut music files inside 'music' folder."

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
  console.log(`[${new Date().toUTCString()}] ⏯ ${newTrack}`)

  dispatcher.on('end', () => joinChannel(roomId))
  dispatcher.on('error', () => joinChannel(roomId))

  if (showSongName) {
    bot.user.setActivity(newTrack.slice(0, newTrack.lastIndexOf('.')), { type: 'LISTENING' }).catch(console.error)
  }
}

const joinChannel = ch => {
  let connection = bot.voiceConnections.get(ch)
  if (connection) {
    playMusic(connection)
  } else {
    bot.channels.get(ch).join().then(playMusic).catch(console.error)
  }
}

bot
  .once('ready', () => {
    console.log(`[Discord-Podcaster] ${bot.user.username} is ready!`)

    getPlaylist()
    joinChannel(roomId)
  })
  .once('disconnect', () => {
    console.log('[Discord-Podcaster] Disconnected!')
    process.exit(1)
  })
  .on('error', console.error)
  .on('warn', console.warn)

bot.login(token).catch(console.error)
