const { Client } = require('discord.js')
const path = require('path')
const fs = require('fs')
const log = require('./src/log')
const musicFormats = require('./src/getMusicFormats')
// const getPlaylist = require('./src/getPlaylist')
const { token, volume, roomId, showSongName } = require('./config.json')

const bot = new Client()

let prevTrack = ''
let playlist = []
let voiceChannel = null
let channelId = roomId

const getPlaylist = () =>
  fs.readdir('./music/', (err, files) => {
    if (err) throw err

    let musicFiles = files.filter(f =>
      musicFormats.includes(f.split('.').pop()))

    if (musicFiles.length <= 0) throw new ReferenceError("Didn't get any music :c\nPut music files inside the 'music' folder.")

    playlist = musicFiles
    return musicFiles
  })

const getRandomTrack = () => {
  if (!playlist.length) throw new Error('Playlist is empty!')
  let rand = ~~(playlist.length * Math.random())
  return (rand !== prevTrack) ? (prevTrack = rand) : getRandomTrack()
}

const playMusic = conn => {
  let track = playlist[getRandomTrack()]
  console.log(`[${new Date().toUTCString()}] ⏯ ${track}`)

  let file = path.resolve(__dirname, `./music/${track}`)
  let dispatcher = conn.playFile(file, { volume })

  dispatcher.on('end', () => initChannel(channelId))
  dispatcher.on('error', () => initChannel(channelId))

  if (showSongName || true) {
    bot.user.setActivity(track.slice(0, track.lastIndexOf('.')), { type: 'LISTENING' }).catch(console.error)
  }
}

const initChannel = async ch => {
  const connection = await bot.voiceConnections.get(ch)
  if (!playlist.length) playlist = getPlaylist()
  if (connection) {
    playMusic(connection)
  } else {
    voiceChannel = await bot.channels.get(ch)
    voiceChannel.join().then(playMusic).catch(console.error)
  }
}

bot
  .once('ready', () => {
    log(`Logged as ${bot.user.tag}!`)
    getPlaylist()
    initChannel(channelId)
  })
  .once('disconnect', () => {
    log('Disconnected!')
    process.exit(1)
  })
  .on('voiceStateUpdate', (oldMember, newMember) => {
    if (!oldMember.user.bot || !newMember.user.bot) return

    let oldChannel = oldMember.voiceChannel
    let newChannel = newMember.voiceChannel

    if (newChannel) {
      if (newMember.id === bot.user.id) {
        let newChannelId = newChannel.id
        if (oldChannel && oldChannel.id === newChannelId || channelId === newChannelId) return

        channelId = newChannelId
        voiceChannel = bot.channels.get(channelId)
      }
    }
  })
  .on('error', console.error)
  .on('warn', console.warn)
  .login(token)

process.on('SIGINT', () => {
  log('Shut down!')

  if (voiceChannel) voiceChannel.leave()
  process.exit(1)
})
