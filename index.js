const { Client } = require('discord.js')
const path = require('path')
const fs = require('fs')
const log = require('./src/log')
const musicFormats = require('./src/getMusicFormats')
const cfg = fs.existsSync('./config.json')
  ? require('./config.json')
  : require('./src/args')

const bot = new Client()

let prevTrack = ''
let playlist = []
let voiceChannel = null
let channelId = cfg.roomId

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
  let dispatcher

  if (cfg.stream) {
    console.log(`[${new Date().toUTCString()}] Starting the stream...`)
    let ytdl = require('ytdl-core')
    let streamObject = ytdl(cfg.stream, { filter: 'audioonly' })

    dispatcher = conn.playStream(streamObject, {
      seek: 0,
      bitrate: 'auto',
      volume: cfg.volume
    })
  } else {
    log('\'stream\' option not found in config.json. Trying to search music inside \'./music\' folder ...')

    let track = playlist[getRandomTrack()]
    console.log(`[${new Date().toUTCString()}] ► ${track}`)

    let file = path.resolve(__dirname, `./music/${track}`)
    dispatcher = conn.playFile(file, { volume: cfg.volume })

    if (cfg.showSongName) {
      bot.user
        .setActivity(track.slice(0, track.lastIndexOf('.')), {
          type: 'LISTENING'
        })
        .catch(console.error)
    }
  }

  dispatcher.on('end', () => initChannel(channelId))
  dispatcher.on('error', () => initChannel(channelId))
}

const initChannel = async ch => {
  const connection = await bot.voiceConnections.get(ch)
  if (cfg.stream) {
    log(`Found a 'stream' option in config.json. Going to start the stream from URL ${cfg.stream}!`)
  } else {
    getPlaylist()
  }

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
        if ((oldChannel && oldChannel.id === newChannelId) || (channelId === newChannelId)) return

        channelId = newChannelId
        voiceChannel = bot.channels.get(channelId)
      }
    }
  })
  .on('error', console.error)
  .on('warn', console.warn)
  .login(cfg.token)

process.on('SIGINT', () => {
  log('Shut down!')

  if (voiceChannel) voiceChannel.leave()
  process.exit(1)
})
