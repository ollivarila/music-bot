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
}

export type MusicBotCommand = {
  data: SlashCommandBuilder
  execute: (interaction: ChatInputCommandInteraction, context: Context) => Promise<void>
}
