import play, { YouTubeVideo } from 'play-dl'
import dotenv from 'dotenv'
import { AudioResource, createAudioResource } from '@discordjs/voice'

dotenv.config()

export default class AudioResourceProvider {
  constructor() {
    // this.init()
  }

  private async init() {
    const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SOUNDCLOUD_CLIENT_ID } = process.env

    if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET) {
      throw new Error('Missing Spotify client ID or client secret')
    }

    await play.setToken({
      spotify: {
        client_id: SPOTIFY_CLIENT_ID,
        client_secret: SPOTIFY_CLIENT_SECRET,
        market: 'FI',
        refresh_token: 'TBA',
      },
    })
  }

  public async searchYoutube(query: string, resultLimit: number = 1): Promise<YouTubeVideo[]> {
    if (query.startsWith('https://')) {
      const info = await play.video_basic_info(query)
      return [info.video_details]
    }
    const searched = await play.search(query, { limit: resultLimit, source: { youtube: 'video' } })
    if (searched.length === 0) {
      throw new Error('No results found')
    }
    return searched
  }

  public async generateAudioResource(url: string): Promise<AudioResource> {
    const stream = await play.stream(url)
    return createAudioResource(stream.stream, { inputType: stream.type })
  }
}
