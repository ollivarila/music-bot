import { AudioPlayer, VoiceConnection } from '@discordjs/voice'
import Queue from '../util/Queue'
import AudioResourceClient from '../util/AudioResourceClient'
import { Song, SongRequest } from '../types'

export default class MusicPlayer {
  private readonly audioPlayer: AudioPlayer
  private readonly queue: Queue<Song> = new Queue<Song>()
  private readonly audioResourceClient = new AudioResourceClient()
  private playing: boolean = false

  constructor() {
    this.audioPlayer = new AudioPlayer({ debug: true })
  }

  public async play(): Promise<Song> {
    if (this.playing) {
      throw new Error('Already playing')
    }
    this.playing = true
    return this.skip()
  }

  public pause(): void {
    this.audioPlayer.pause()
    this.playing = false
  }

  public async skip(): Promise<Song> {
    const next = this.queue.dequeue()
    if (!next) {
      throw new Error('Queue is empty')
    }
    const stream = await this.audioResourceClient.generateAudioResource(next.details.url)
    this.audioPlayer.play(stream)
    return next
  }

  public stop(): void {
    this.audioPlayer.stop()
    this.playing = false
  }

  public async enqueue(request: SongRequest): Promise<Song> {
    const song = await this.generateSong(request)
    this.queue.enqueue(song)
    if (!this.playing) {
      this.play()
    }
    return song
  }

  public addConnection(connection: VoiceConnection): void {
    connection.subscribe(this.audioPlayer)
  }

  private async generateSong(request: SongRequest): Promise<Song> {
    const details = await this.audioResourceClient.searchYoutube(request.query)
    return {
      details,
      username: request.username,
    }
  }

  public getQueue(): Song[] {
    return this.queue.getQueue()
  }
}
