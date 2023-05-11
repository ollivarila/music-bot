import {
  SlashCommandBuilder,
  SlashCommandOptionsOnlyBuilder,
  SlashCommandStringOption,
} from 'discord.js'
import { MusicBotCommand } from '../types'
import { getVoiceConnection } from '@discordjs/voice'
import joinVoice from '../util/joinVoice'

const play: MusicBotCommand = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Play a song, adds song to queue if already playing')
    .addStringOption((option: SlashCommandStringOption) => {
      return option
        .setName('song')
        .setDescription('The song to play (YouTube URL or search query)')
        .setRequired(true)
    }) as SlashCommandBuilder,
  execute: async (interaction, context) => {
    try {
      const connection = getVoiceConnection(interaction.guildId!)
      if (!connection) {
        const conn = joinVoice(interaction)
        context.player.addConnection(conn)
      }
      const query = interaction.options.getString('song', true)
      const details = await context.player.enqueue({ query, username: interaction.user.username })
      interaction.reply({ embeds: [context.factory.enqueueEmbed(details)] })
    } catch (error: any) {
      const embed = context.factory.errorEmbed(error.message)
      interaction.reply({ embeds: [embed] })
    }
  },
}

module.exports = play
