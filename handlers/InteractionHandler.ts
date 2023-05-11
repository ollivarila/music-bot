import { ChatInputCommandInteraction, Collection, MessageComponentInteraction } from 'discord.js'
import MusicPlayer from './MusicPlayer'
import { EmbedFactory } from '../util/EmbedFactory'
import { Context, MusicBotCommand, Search, Username } from '../types'
import MyClient, { MessageComponentHandler } from '../MyClient'

export default class InteractionHandler {
  private readonly client: MyClient
  private readonly context: Context = {
    player: new MusicPlayer(),
    factory: new EmbedFactory(),
    active_searches: new Collection<Username, Search>(),
  }

  constructor(client: MyClient) {
    this.client = client
    const searches = this.context.active_searches as Collection<Username, Search>
    const FIFTEEN_MINUTES = 15 * 60 * 1000
    setInterval(() => clearOldSearches(searches), FIFTEEN_MINUTES)
  }

  async chatInputCommand(interaction: ChatInputCommandInteraction): Promise<void> {
    const command = this.client.commands.get(interaction.commandName)
    if (command) {
      this.executeCommandGracefully(command, interaction)
    } else {
      await interaction.reply('Unknown command')
    }
  }

  async messageComponent(interaction: MessageComponentInteraction): Promise<void> {
    if (!interaction.replied || !interaction.deferred) {
      await interaction.deferUpdate()
    }

    if (interaction.isButton()) {
      const handler = this.client.componentHandlers.get(interaction.customId)
      if (handler) {
        this.executeHandlerGracefully(handler, interaction)
      } else {
        await interaction.reply({ content: 'Unknown button', ephemeral: true })
      }
    }
  }

  private async executeCommandGracefully(
    command: MusicBotCommand,
    interaction: ChatInputCommandInteraction,
  ): Promise<void> {
    try {
      await command.execute(interaction, this.context)
    } catch (error: any) {
      console.error(error)
      if (interaction.deferred || interaction.replied) {
        await interaction.followUp({ content: 'Command failed', ephemeral: true })
      } else {
        const embed = this.context.factory.infoEmbed('Command failed', error.message)
        interaction.reply({ embeds: [embed], ephemeral: true })
      }
    }
  }

  private async executeHandlerGracefully(
    handler: MessageComponentHandler,
    interaction: MessageComponentInteraction,
  ): Promise<void> {
    try {
      await handler.execute(interaction, this.context)
    } catch (error: any) {
      console.error(error)
      if (interaction.deferred || interaction.replied) {
        await interaction.followUp({ content: 'Command failed', ephemeral: true })
      } else {
        const embed = this.context.factory.infoEmbed('Command failed', error.message)
        interaction.reply({ embeds: [embed], ephemeral: true })
      }
    }
  }
}

function clearOldSearches(searches: Collection<Username, Search>): void {
  searches.forEach((search, username) => {
    if (searchIsExpired(search)) {
      searches.delete(username)
    }
  })
}

function searchIsExpired(search: Search): boolean {
  const now = Date.now()
  const diff = now - search.updatedAt
  return diff > 60 * 1000 * 15
}
