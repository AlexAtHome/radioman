import { Playlist, Song } from './types'

export const getRandomTrack = (playlist: Playlist, prevTrack: string = ''): Song => {
  const rand: number = ~~(playlist.length * Math.random())
  const nextTrack: Song = playlist[rand]
  if (nextTrack !== prevTrack) {
    return nextTrack
  } else {
    return getRandomTrack(playlist, prevTrack)
  }
}