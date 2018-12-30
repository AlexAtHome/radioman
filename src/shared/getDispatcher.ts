import { Readable } from "stream";
import { VoiceConnection } from "discord.js";
import { volume } from "./args";

export const getDispatcher = (conn: VoiceConnection, streamObject: Readable) =>
  conn.playStream(streamObject, {
    seek: 0,
    bitrate: 'auto',
    volume: volume || 1
  })