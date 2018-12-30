import { YouTubePlaylist, YouTubeVideo, Song, PlaylistObject } from "./types";
import ytdl from 'ytdl-core'
import { getDispatcher, getFileDispatcher } from './shared/getDispatcher'
import { setActivity } from './shared/activity'
import { Client, VoiceConnection } from "discord.js";
import log from './shared/log'
import path from 'path'

export const playYouTubePlaylist = (bot: Client, YTplaylist: YouTubePlaylist, conn: VoiceConnection) => {
  let currentTrack = YTplaylist.getRandomTrack()
  let streamObject = ytdl(currentTrack.url, {
    filter: 'audioonly'
  })

  console.log(`[${new Date().toUTCString()}] ► ${currentTrack.name}`)
  setActivity(bot, currentTrack.name).catch(console.error)
  return getDispatcher(conn, streamObject)
}

export const playYouTubeVideo = (bot: Client, stream: YouTubeVideo, conn: VoiceConnection) => {
  let streamObject = ytdl(stream.url, {
    filter: 'audioonly'
  })

  console.log(`[${new Date().toUTCString()}] Starting the stream...`)
  stream.setActivity(bot).catch(console.error)
  return getDispatcher(conn, streamObject)
}

export const playAudioFiles = (bot: Client, playlist: PlaylistObject, conn: VoiceConnection) => {
  log('\'stream\' option not found in config.json. Trying to search music inside \'./music\' folder ...')
  let track: Song = playlist.getRandomTrack()

  console.log(`[${new Date().toUTCString()}] ► ${track}`)
  let file = path.resolve(__dirname, `./music/${track}`)

  let trackTitleToShow = track.slice(0, track.lastIndexOf('.'))
  setActivity(bot, trackTitleToShow)
  return getFileDispatcher(conn, track)
}