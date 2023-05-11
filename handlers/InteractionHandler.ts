import { ChatInputCommandInteraction, Client, EmbedBuilder, GuildMember } from 'discord.js'
import { joinVoiceChannel, getVoiceConnection } from '@discordjs/voice'
import MusicPlayer from './MusicPlayer'
import { EmbedFactory } from '../util/EmbedFactory'
import { Context, Song, SongRequest } from '../types'
import MyClient from '../MyClient'

export default class InteractionHandler {
  private readonly client: MyClient
  private readonly player: MusicPlayer = new MusicPlayer()
  private readonly embedFactory: EmbedFactory = new EmbedFactory()
  private readonly context: Context = {
    player: this.player,
    factory: this.embedFactory,
  }

  constructor(client: MyClient) {
    this.client = client
  }

  async chatInputCommand(interaction: ChatInputCommandInteraction): Promise<void> {
    const command = this.client.commands.get(interaction.commandName)
    if (command) {
      await command.execute(interaction, this.context)
    } else {
      await interaction.reply('Unknown command')
    }
  }
}
