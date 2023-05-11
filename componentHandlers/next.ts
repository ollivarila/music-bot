import { MessageComponentHandler } from '../MyClient'

const next: MessageComponentHandler = {
  customId: 'next',
  execute: async (interaction, context) => {
    const username = interaction.user.username
    const search = context.active_searches.get(username)
    if (search) {
      search.index = (search.index + 1) % search.results.length
      const { origin, index, results } = search
      const { embed, component } = context.factory.componentEmbed(results[index])
      origin.editReply({ embeds: [embed], components: [component] })
    }
  },
}

module.exports = next
