import { GuildMember, SlashCommandBuilder } from 'discord.js'
import { MusicBotCommand } from '../types'
import joinVoice from '../util/joinVoice'

const join: MusicBotCommand = {
  data: new SlashCommandBuilder().setName('join').setDescription('Join a voice channel'),
  execute: async (interaction, context) => {
    try {
      const connection = joinVoice(interaction)
      context.player.addConnection(connection)
      interaction.reply('Joined voice channel')
    } catch (error: any) {
      interaction.reply(error.message)
    }
  },
}

module.exports = join
