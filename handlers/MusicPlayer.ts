import { AudioPlayer, AudioPlayerStatus, VoiceConnection } from '@discordjs/voice'
import Queue from '../util/Queue'
import AudioResourceProvider from '../util/AudioResourceProvider'
import { Song, SongRequest } from '../types'
import { YouTubeVideo } from 'play-dl'
import { ActivityType, ClientPresence, PresenceData, PresenceUpdateStatus } from 'discord.js'
import MyClient from '../MyClient'

export default class MusicPlayer {
  private readonly audioPlayer: AudioPlayer
  private readonly queue: Queue<Song> = new Queue<Song>()
  private readonly audioResourceClient = new AudioResourceProvider()
  private readonly client: MyClient
  private playing: boolean = false
  private currentSong?: Song

  constructor(client: MyClient) {
    this.client = client
    this.audioPlayer = new AudioPlayer({ debug: true })
    this.audioPlayer.on('stateChange', (oldState, newState) => {
      const currentlyIdle = newState.status === AudioPlayerStatus.Idle
      const wasPlaying = oldState.status === AudioPlayerStatus.Playing
      console.log(`${oldState.status} -> ${newState.status}`)

      if (currentlyIdle) {
        this.client.changePresence({
          activities: [
            {
              name: 'your requests!',
              type: ActivityType.Listening,
            },
          ],
          afk: false,
          status: PresenceUpdateStatus.Online,
        })
      } else if (newState && newState.status === AudioPlayerStatus.Playing) {
        this.client.changePresence({
          activities: [
            {
              name: this.currentSong?.details.title || 'music!',
              type: ActivityType.Streaming,
            },
          ],
          afk: false,
          status: PresenceUpdateStatus.Online,
        })
      }

      const autopaused = newState.status === AudioPlayerStatus.AutoPaused
      if (!(currentlyIdle && wasPlaying) || autopaused) {
        return
      }

      // If queue is not empty, play the next song
      if (!this.queue.isEmpty()) {
        this.skip()
        // Else queue is empty, stop playing
      } else {
        this.playing = false
      }
    })
  }

  /**
   * Plays the next song in the queue, if nothing is playing
   * @returns The song that just started playing
   */
  public async play(): Promise<Song> {
    return this.playing ? this.currentSong! : this.skip()
  }

  /**
   * Pauses the current song
   */
  public pause(): void {
    this.audioPlayer.pause()
    this.playing = false
  }

  /**
   * Skips the current song and plays the next one in the queue
   * @returns The song that just started playing
   * @throws Error if the queue is empty
   */
  public async skip(): Promise<Song> {
    const next = this.queue.dequeue()
    this.currentSong = next
    if (!next) {
      this.playing = false
      throw new Error('Queue is empty')
    }
    const stream = await this.audioResourceClient.generateAudioResource(next.details.url)
    if (!stream) {
      console.error('Stream generation failed')
      return this.skip()
    }
    this.playing = true
    this.audioPlayer.play(stream)
    return next
  }

  /**
   * Stops the current song and completely removes it
   */
  public stop(): void {
    this.audioPlayer.stop()
    this.playing = false
  }

  /**
   * Adds a song to the queue if it is a valid song. If the queue is empty, it will start playing the song.
   * @param request The song request, the query can be an youtube url or a search query
   * @returns The song that was added to the queue
   * @throws Error if the song is invalid
   */
  public async enqueue(request: SongRequest): Promise<Song> {
    const song = await this.generateSong(request)
    this.queue.enqueue(song)
    if (!this.playing) {
      this.play()
    }
    return song
  }

  /**
   * Adds a connection to the audio player. One connection represents a voice channel.
   * Multiple connections can be added to the audio player.
   * @param connection The voice connection to add
   */
  public addConnection(connection: VoiceConnection): void {
    connection.subscribe(this.audioPlayer)
  }

  /**
   * Generages a song from a song request. The song request can be a youtube url or a search query.
   * @param request The song request
   * @returns The song that was generated
   * @throws Error if no results were found for the query
   */
  private async generateSong(request: SongRequest): Promise<Song> {
    const details = (await this.audioResourceClient.searchYoutube(request.query))[0]
    return {
      details,
      username: request.username,
    }
  }

  /**
   * Get the songs in the queue
   * @returns The songs in the queue
   */
  public getQueue(): Song[] {
    return this.queue.getQueue()
  }

  /**
   * Get the current song
   * @returns The current song
   */
  public getCurrentSong(): Song | undefined {
    return this.currentSong
  }

  public async search(query: string): Promise<YouTubeVideo[]> {
    return this.audioResourceClient.searchYoutube(query, 5)
  }
}
