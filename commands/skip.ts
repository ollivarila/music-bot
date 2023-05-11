import { SlashCommandBuilder } from 'discord.js'
import { MusicBotCommand } from '../types'

const skip: MusicBotCommand = {
  data: new SlashCommandBuilder().setName('skip').setDescription('Skip the current song'),
  execute: async (interaction, context) => {
    try {
      const song = await context.player.skip()
      const embed = context.factory.songEmbed(song)
      interaction.reply({ embeds: [embed] })
    } catch (error: any) {
      const embed = context.factory.queueEmptyEmbed()
      interaction.reply({ embeds: [embed] })
    }
  },
}

module.exports = skip
