import { SlashCommandBuilder } from 'discord.js'
import { MusicBotCommand } from '../types'

const stop: MusicBotCommand = {
  data: new SlashCommandBuilder().setName('stop').setDescription('Stop the current song'),
  execute: async (interaction, context) => {
    context.player.stop()
    const embed = context.factory.stopEmbed()
    interaction.reply({ embeds: [embed] })
  },
}

module.exports = stop
