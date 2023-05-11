import { ChatInputCommandInteraction, Interaction, SlashCommandBuilder } from 'discord.js'
import { YouTubeVideo } from 'play-dl'
import MusicPlayer from './handlers/MusicPlayer'
import { EmbedFactory } from './util/EmbedFactory'

export type Song = {
  details: YouTubeVideo
  username: string
}

export type SongRequest = {
  username: string
  query: string
}

export type Context = {
  player: MusicPlayer
  factory: EmbedFactory
  active_searches: Map<string, Search>
}

export type Search = {
  query: string
  results: YouTubeVideo[]
  updatedAt?: number
  origin: ChatInputCommandInteraction
  index: number
}

export type MusicBotCommand = {
  data: SlashCommandBuilder
  execute: (interaction: ChatInputCommandInteraction, context: Context) => Promise<void>
}
