import { YouTubeVideo } from 'play-dl'

export type Song = {
  details: YouTubeVideo
  username: string
}

export type SongRequest = {
  username: string
  query: string
}
