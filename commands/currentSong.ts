import { SlashCommandBuilder } from 'discord.js'
import { MusicBotCommand } from '../types'

const currentSong: MusicBotCommand = {
  data: new SlashCommandBuilder().setName('current').setDescription('Shows the current song'),
  execute: async (interaction, context) => {
    const currentSong = context.player.getCurrentSong()
    if (!currentSong) {
      await interaction.reply({ embeds: [context.factory.errorEmbed('Nothing is playing')] })
      return
    }
    await interaction.reply({ embeds: [context.factory.songEmbed(currentSong)] })
  },
}

module.exports = currentSong
