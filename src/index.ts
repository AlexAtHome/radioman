import { Client, VoiceConnection, StreamDispatcher, Snowflake, VoiceChannel, Channel } from 'discord.js'
import * as path from 'path'
import log from './shared/log'
import ytdl from 'ytdl-core'

import * as cfg from './shared/args'
import { getPlaylist } from './getPlaylist'
import { getRandomTrack } from './getRandomTrack'
import { Song, Playlist, YouTubeVideo, YouTubePlaylist } from './types';
import die from './shared/die'
import { setActivity } from './shared/activity'
import { getDispatcher } from './shared/getDispatcher'

const bot = new Client()
let playlist: Playlist
let YTplaylist: YouTubePlaylist
let channelId: Snowflake = cfg.roomId

let voiceChannel: VoiceChannel | Channel | undefined
let prevTrack: Song = ''

const playMusic = async (conn: VoiceConnection) => {
  let dispatcher: StreamDispatcher | undefined

  if (cfg.streamPlaylist) {
    try {
      YTplaylist = await new YouTubePlaylist(cfg.streamPlaylist)
      await YTplaylist.fetchTracks()
      let currentTrack = YTplaylist.getRandomTrack()

      let streamObject = ytdl(currentTrack.url, {
        filter: 'audioonly'
      })

      console.log(`[${new Date().toUTCString()}] ► ${currentTrack.name}`)
      dispatcher = getDispatcher(conn, streamObject)
      await setActivity(bot, currentTrack.name)
    } catch (error) {
      die(voiceChannel, error)
    }

  } else if (cfg.stream) {
    let video = new YouTubeVideo(cfg.stream)

    let streamObject = ytdl(video.url, {
      filter: 'audioonly'
    })

    console.log(`[${new Date().toUTCString()}] Starting the stream...`)
    dispatcher = getDispatcher(conn, streamObject)
    try {
      await video.setActivity(bot)
    } catch (error) {
      console.error(error)
    }

  } else {
    log('\'stream\' option not found in config.json. Trying to search music inside \'./music\' folder ...')
    let track: Song = getRandomTrack(playlist, prevTrack)
    prevTrack = track

    console.log(`[${new Date().toUTCString()}] ► ${track}`)
    let file = path.resolve(__dirname, `./music/${track}`)
    dispatcher = conn.playFile(file, {
      volume: cfg.volume
    })

    let trackTitleToShow = track.slice(0, track.lastIndexOf('.'))
    await setActivity(bot, trackTitleToShow)
  }

  if (dispatcher instanceof StreamDispatcher) {
    dispatcher.on('end', () => initChannel(channelId))
    dispatcher.on('error', () => initChannel(channelId))
  }
}

const initChannel = async (ch: Snowflake) => {
  const connection: VoiceConnection | undefined = await bot.voiceConnections.get(ch)

  if (!connection) {
    throw new Error(`Failed to find the channel with id ${ch}! It possibly doesn't exist!`)
  }

  if (cfg.streamPlaylist) {
    log(`Found a 'playlist' option. Going to start the music from it!`)
  } else if (cfg.stream) {
    log(`Found a 'stream' option. Going to start the stream from it!`)
  } else {
    playlist = getPlaylist()
  }

  if (connection) {
    playMusic(connection)
  } else {
    try {
      voiceChannel = await bot.channels.get(ch)
      if (voiceChannel instanceof VoiceChannel) {
        let conn = await voiceChannel.join()
        log('Connected to the room!')
        playMusic(conn)
      }
    } catch (error) {
      die(voiceChannel, error)
    }
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

    let oldChannel: VoiceChannel = oldMember.voiceChannel
    let newChannel: VoiceChannel = newMember.voiceChannel

    if (newChannel) {
      if (newMember.id === bot.user.id) {
        let newChannelId: Snowflake = newChannel.id
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
  die(voiceChannel)
})
