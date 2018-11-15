const { Client } = require('discord.js')
const path = require('path')
const fs = require('fs')

const bot = new Client()
const { token, volume, roomId, showSongName } = require('./config.json')

const getRandomTrack = () => {
  const rand = ~~(playlist.length * Math.random())
  return (rand !== prevTrack) ? (prevTrack = rand) : getRandomTrack()
}

let prevTrack = ''
let playlist = {}
let voiceChannel = null
let channelId = roomId

const musicFormats = ['flac', 'wav', 'ogg', 'mp3', 'mp4']
const getPlaylist = () =>
  fs.readdir('./music/', (err, files) => {
    if (err) throw err

    const musicFiles = files.filter(f => musicFormats.includes(f.split('.').pop()))
    if (musicFiles.length <= 0) throw new ReferenceError("Didn't get any music :c\nPut music files inside 'music' folder.")

    playlist = musicFiles
  })

const playMusic = conn => {
  const track = playlist[getRandomTrack()]
  console.log(`[${new Date().toUTCString()}] ⏯ ${track}`)

  const file = path.resolve(__dirname, `./music/${track}`)
  const dispatcher = conn.playFile(file, { volume })

  dispatcher.on('end', () => initChannel(channelId))
  dispatcher.on('error', () => initChannel(channelId))

  if (showSongName || true) {
    bot.user.setActivity(track.slice(0, track.lastIndexOf('.')), { type: 'LISTENING' }).catch(console.error)
  }
}

const initChannel = async ch => {
  const connection = await bot.voiceConnections.get(ch)
  if (connection) {
    playMusic(connection)
  } else {
    voiceChannel = await bot.channels.get(ch)
    voiceChannel.join().then(playMusic).catch(console.error)
  }
}

bot
  .once('ready', () => {
    console.log(`[Discord-Podcaster] ${bot.user.username} is ready!`)

    getPlaylist()
    initChannel(channelId)
  })
  .once('disconnect', () => {
    console.log('[Discord-Podcaster] Disconnected!')
    process.exit(1)
  })
  .on('voiceStateUpdate', (oldMember, newMember) => {
    if (!oldMember.user.bot || !newMember.user.bot) return

    const oldChannel = oldMember.voiceChannel
    const newChannel = newMember.voiceChannel

    if (newChannel) {
      if (newMember.id === bot.user.id) {
        const newChannelId = newChannel.id
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
  console.log('[Discord-Podcaster] Shut down!')

  if (voiceChannel) voiceChannel.leave()
  process.exit(1)
})
