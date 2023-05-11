import { SlashCommandBuilder } from 'discord.js'
import { MusicBotCommand } from '../types'

const enqueue: MusicBotCommand = {
  data: new SlashCommandBuilder()
    .setName('enqueue')
    .setDescription('Add a song to the queue')
    .addStringOption((option) => {
      return option
        .setName('song')
        .setDescription('The song to play (YouTube URL or search query)')
        .setRequired(true)
    }) as SlashCommandBuilder,
  execute: async (interaction, context) => {
    try {
      const query = interaction.options.getString('song', true)
      const details = await context.player.enqueue({ query, username: interaction.user.username })
      interaction.reply({ embeds: [context.factory.enqueueEmbed(details)] })
    } catch (error: any) {
      const embed = context.factory.errorEmbed(error.message)
      interaction.reply({ embeds: [embed] })
    }
  },
}

module.exports = enqueue
