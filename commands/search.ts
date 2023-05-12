import { SlashCommandBuilder } from 'discord.js'
import { MusicBotCommand, Search } from '../types'
import { ComponentEmbed } from '../util/EmbedFactory'

const search: MusicBotCommand = {
  data: new SlashCommandBuilder()
    .setName('search')
    .setDescription('Search for a song')
    .addStringOption((option) =>
      option.setName('query').setDescription('The song you want to search for').setRequired(true),
    ) as SlashCommandBuilder,
  execute: async (interaction, context) => {
    const query = interaction.options.getString('query')
    if (!query) {
      return
    }
    try {
      const results = await context.player.search(query)
      const search: Search = {
        query,
        results,
        origin: interaction,
        updatedAt: Date.now(),
        index: 0,
      }
      context.active_searches.set(interaction.user.username, search)
      setTimeout(() => {
        context.active_searches.delete(interaction.user.username)
      }, 15 * 60 * 1000)
      const reply: ComponentEmbed = context.factory.componentEmbed(results[0])

      interaction.reply({ embeds: [reply.embed], components: [reply.component], ephemeral: true })
    } catch (error: any) {
      const embed = context.factory.infoEmbed('Search failed', error.message)
      interaction.reply({ embeds: [embed], ephemeral: true })
    }
  },
}

module.exports = search
