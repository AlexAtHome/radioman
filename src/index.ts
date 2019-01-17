import { Client, VoiceConnection, StreamDispatcher, Snowflake, VoiceChannel, Channel, GuildMember } from 'discord.js'
import log from './shared/log'

import * as cfg from './shared/args'
import { YouTubeVideo, YouTubePlaylist, PlaylistObject } from './types'
import die from './shared/die'
import { playYouTubePlaylist, playYouTubeVideo, playAudioFiles } from './playMusic'

const bot = new Client()
let playlist: PlaylistObject
let YTplaylist: YouTubePlaylist
let videoToPlay: YouTubeVideo
let channelId: Snowflake = cfg.roomId

let voiceChannel: VoiceChannel | Channel | undefined

const playMusic = (conn: VoiceConnection) => {
  let dispatcher: StreamDispatcher | undefined =
    cfg.streamPlaylist
      ? playYouTubePlaylist(bot, YTplaylist, conn)
      : cfg.stream
        ? playYouTubeVideo(bot, videoToPlay, conn)
        : playAudioFiles(bot, playlist, conn)

  if (dispatcher) {
    dispatcher.on('end', () => initChannel(channelId))
    dispatcher.on('error', () => initChannel(channelId))
  }
}

const initChannel = async (ch: Snowflake) => {
  const connection: VoiceConnection | undefined = bot.voiceConnections.get(ch)

  if (!bot.channels.has(ch)) {
    throw new Error(`Failed to find the channel with id ${ch}! It possibly doesn't exist!`)
  }

  if (cfg.streamPlaylist) {
    log(`Found a 'playlist' option. Going to start the music from it!`)
    YTplaylist = new YouTubePlaylist(cfg.streamPlaylist)
    await YTplaylist.fetchTracks()
  } else if (cfg.stream) {
    log(`Found a 'stream' option. Going to start the stream from it!`)
    videoToPlay = new YouTubeVideo(cfg.stream)
  } else {
    playlist = new PlaylistObject()
  }

  if (connection) {
    playMusic(connection)
  } else {
    try {
      voiceChannel = bot.channels.get(ch)
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
  .on('voiceStateUpdate', (oldMember: GuildMember, newMember: GuildMember) => {
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

bot.login(cfg.token)

process.on('SIGINT', () => {
  log('Shut down!')
  die(voiceChannel)
})
