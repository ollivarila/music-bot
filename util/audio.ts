import { createReadStream } from 'fs'
import { Readable } from 'stream'
import path from 'path'
import { createAudioResource, demuxProbe, AudioResource } from '@discordjs/voice'

export async function createAudio(filename: string): Promise<AudioResource> {
  const filepath = path.join(__dirname, '..', 'audio', filename)
  console.log(filepath)
  const stream = createReadStream(filepath)
  const { type } = await demuxProbe(stream)
  return createAudioResource(stream, { inputType: type })
}

export async function audioResourceFrom(stream: Readable): Promise<AudioResource> {
  const { type } = await demuxProbe(stream)
  return createAudioResource(stream, { inputType: type })
}
