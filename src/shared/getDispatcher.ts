import { Readable } from "stream";
import { VoiceConnection } from "discord.js";
import { volume } from "./args";
import { Song } from "../types";

export const getDispatcher = (conn: VoiceConnection, streamObject: Readable) =>
  conn.playStream(streamObject, {
    seek: 0,
    bitrate: 'auto',
    volume: volume || 1
  })

export const getFileDispatcher = (conn: VoiceConnection, file: Song) =>
  conn.playFile(file, {
    seek: 0,
    bitrate: 'auto',
    volume: volume || 1
  })