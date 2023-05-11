import { SlashCommandBuilder } from 'discord.js'
import { MusicBotCommand } from '../types'
import { getVoiceConnection } from '@discordjs/voice'

const leave: MusicBotCommand = {
  data: new SlashCommandBuilder().setName('leave').setDescription('Leaves the voice channel'),
  execute: async (interaction, context) => {
    const connection = getVoiceConnection(interaction.guildId!)
    if (!connection) {
      interaction.reply('Not in a voice channel')
      return
    }

    connection.destroy()
    interaction.reply('Left voice channel')
  },
}

module.exports = leave
