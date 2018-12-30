import fs from 'fs'
const musicFormats: string[] = require('./musicFormats')

import { Playlist } from './types'

/**
 * Gets the playlist
 */
export const getPlaylist = (): Playlist => {
  const playlist: Playlist = []
  fs.readdir('./music/', (err: any, files: string[]) => {
    if (err) throw err

    files.forEach((file: string) => {
      let format: string = file.split('.').pop() || ''
      if (!musicFormats.includes(format)) return void
      playlist.push(file)
    })

    if (playlist.length <= 0) throw new ReferenceError("Didn't get any music :c\nPut music files inside the 'music' folder or specify the YouTube video link!")

  })
  return playlist
}