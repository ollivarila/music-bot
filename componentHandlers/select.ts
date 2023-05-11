import { MessageComponentHandler } from '../MyClient'

const select: MessageComponentHandler = {
  customId: 'select',
  execute: async (interaction, context) => {
    const username = interaction.user.username
    const search = context.active_searches.get(username)
    const selection = search?.results[search.index]
    if (!selection) {
      context.active_searches.delete(username)
      const embed = context.factory.errorEmbed(
        'Something went wrong with selection, maybe try again',
      )
      interaction.editReply({ embeds: [embed] })
      return
    }
    try {
      const song = await context.player.enqueue({ query: selection.url, username })
      const embed = context.factory.enqueueEmbed(song)
      search?.origin.deleteReply()
      interaction.followUp({ embeds: [embed], ephemeral: false })
      context.active_searches.delete(username)
    } catch (error: any) {
      search?.origin.deleteReply()
      context.active_searches.delete(username)
      const embed = context.factory.errorEmbed(error.message)
      interaction.editReply({ embeds: [embed] })
    }
  },
}

module.exports = select
