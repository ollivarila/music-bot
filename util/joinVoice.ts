import { VoiceConnection, joinVoiceChannel } from '@discordjs/voice'
import { GuildMember, Interaction } from 'discord.js'

/**
 * Joins a voice channel and returns the connection for a given interaction
 * @param interaction The interaction that will be used to join the voice channel
 * @returns The voice connection
 * @throws An error if the user is not in a voice channel
 */
export default function joinVoice(interaction: Interaction): VoiceConnection {
  const { guildId, guild } = interaction
  const member = interaction.member as GuildMember
  const voiceChannelId = member.voice.channel?.id
  if (!voiceChannelId) {
    throw new Error('Not in a voice channel')
  }
  return joinVoiceChannel({
    channelId: voiceChannelId,
    guildId: guildId!,
    adapterCreator: guild?.voiceAdapterCreator!,
    selfDeaf: false,
    selfMute: false,
  })
}
