import { EmbedBuilder, SlashCommandBuilder } from 'discord.js'
import { MusicBotCommand, Song } from '../types'

const queue: MusicBotCommand = {
  data: new SlashCommandBuilder().setName('queue').setDescription('Show the current queue'),
  execute: async (interaction, context) => {
    const queue: Song[] = context.player.getQueue()
    if (queue.length === 0) {
      const embed = context.factory.queueEmptyEmbed()
      interaction.reply({ embeds: [embed] })
      return
    }
    const embeds: EmbedBuilder[] = []
    queue.forEach((song, index) => {
      const embed = context.factory.songEmbed(song)
      embed.setTitle(`Song ${index + 1}.`)
      embeds.push(embed)
    })

    interaction.reply({ embeds })
  },
}

module.exports = queue
