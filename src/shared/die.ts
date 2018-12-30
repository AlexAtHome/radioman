import { VoiceChannel, Channel } from 'discord.js'

export default (voiceChannel?: VoiceChannel | Channel, error?: any): void => {
  if (error) console.error(error)
  if (voiceChannel && voiceChannel instanceof VoiceChannel) voiceChannel.leave()
  return process.exit(1)
}