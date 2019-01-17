import { UrlWithParsedQuery, parse as parseUrl } from 'url'
import { validateURL, getBasicInfo } from 'ytdl-core'
import { Client } from 'discord.js'
import { setActivity } from './shared/activity'
import fs from 'fs'
import musicFormats from './musicFormats'

// Must be imported this way
const ytlist = require('youtube-playlist')

export type Song = string

export type Playlist = Song[]

export class PlaylistObject {
  public list: Playlist = []
  private _previousTrack: Song

  constructor() {
    this.getPlaylist()
    this._previousTrack = ''
  }

  set previousTrack (song: Song) {
    this._previousTrack = song
  }

  get previousTrack (): Song {
    return this._previousTrack
  }

  getRandomTrack (): Song {
    const rand: number = ~~(this.list.length * Math.random())
    const nextTrack: Song = this.list[rand]
    if (nextTrack !== this.previousTrack) {
      return nextTrack
    } else {
      return this.getRandomTrack()
    }
  }

  getPlaylist () {
    fs.readdir('./music/', (err: any, files: string[]) => {
      if (err) throw err
      files.forEach((file: string) => {
        let format: string = file.split('.').pop() || ''
        if (!musicFormats.includes(format)) return void
        this.list.push(file)
      })
    })
    if (this.list.length <= 0) throw new ReferenceError("Didn't get any music :c\nPut music files inside the 'music' folder or specify the YouTube video link!")
  }
}

export class YouTubeVideo {
  public url: string

  constructor(link: string) {
    this.validate(link)
    this.url = link
  }

  async setActivity(bot: Client) {
    try {
      let info = await getBasicInfo(this.url)
      await setActivity(bot, info.title)
    } catch (error) {
      console.error(error)
    }
  }

  validate(link: string): boolean {
    if (validateURL(link)) {
      return true
    } else {
      throw new ReferenceError("Wrong YouTube video link!")
    }
  }
}

type YouTubeVideoInfo = {
  name: string,
  url: string
}

type YouTubeListResponse = {
  data: {
    playlist: YouTubeVideoInfo[]
  }
}

export class YouTubePlaylist {
  public url: string
  public list: YouTubeVideoInfo[] = []
  private previousTrack?: YouTubeVideoInfo

  constructor (link: string) {
    this.validate(link)
    this.url = link
  }

  async fetchTracks (link: string = this.url) {
    let response: YouTubeListResponse
    try {
      response = await ytlist(link, ['id', 'name', 'url'])
      this.list = response.data.playlist
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  validate(link: string): boolean {
    let urlInfo: UrlWithParsedQuery = parseUrl(link, true)
    if (urlInfo.hostname === 'youtube.com' && urlInfo.pathname === '/playlist' && ('list' in urlInfo.query)) {
      return true
    } else {
      throw new ReferenceError("Wrong YouTube playlist link!")
    }
  }

  getRandomTrack(): YouTubeVideoInfo {
    const rand: number = ~~(this.list.length * Math.random())
    const nextTrack: YouTubeVideoInfo = this.list[rand]
    if (nextTrack !== this.previousTrack) {
      return nextTrack
    } else {
      return this.getRandomTrack()
    }
  }
}