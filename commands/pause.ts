import { SlashCommandBuilder } from 'discord.js'
import { MusicBotCommand } from '../types'

const pause: MusicBotCommand = {
  data: new SlashCommandBuilder().setName('pause').setDescription('Pause the current song'),
  execute: async (interaction, context) => {
    context.player.pause()
    const embed = context.factory.pauseEmbed()
    interaction.reply({ embeds: [embed] })
  },
}

module.exports = pause
