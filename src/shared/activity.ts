import { Client } from 'discord.js'
import { showSongName } from './args'

export const setActivity = async (bot: Client, track: string) => {
  if (showSongName) {
    try {
      await bot.user
        .setActivity(track, { type: 'LISTENING' })
        .catch(console.error)
    } catch (error) {
      console.error(error)
    }
  }
}