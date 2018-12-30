import { existsSync } from 'fs'
import { argv } from 'yargs'

const config = existsSync('./config.json')
  ? require('./config.json')
  : {}

export const token = argv.token || config.token || process.env.token
export const roomId = argv.roomId || config.roomId || process.env.roomId
export const volume = argv.volume || config.volume || process.env.volume
export const showSongName = argv.showSongName || config.showSongName || process.env.showSongName
export const stream = argv.stream || config.stream || process.env.stream
export const streamPlaylist = argv.playlist || config.playlist || process.env.playlist
