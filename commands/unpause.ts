import { SlashCommandBuilder } from 'discord.js'
import { MusicBotCommand, Song } from '../types'

const unpause: MusicBotCommand = {
  data: new SlashCommandBuilder().setName('unpause').setDescription('Resume the current song'),
  execute: async (interaction, context) => {
    try {
      const song: Song = await context.player.play()
      const embed = context.factory.unpauseEmbed(song)
      interaction.reply({ embeds: [embed] })
    } catch (error: any) {
      const embed = context.factory.errorEmbed(error.message)
      interaction.reply({ embeds: [embed] })
    }
  },
}

module.exports = unpause
