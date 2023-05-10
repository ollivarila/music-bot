import { ChatInputCommandInteraction, Client, EmbedBuilder, GuildMember } from 'discord.js'
import { joinVoiceChannel, getVoiceConnection } from '@discordjs/voice'
import MusicPlayer from './MusicPlayer'
import { EmbedFactory } from '../util/EmbedFactory'
import { Song, SongRequest } from '../types'

export default class InteractionHandler {
  private readonly client: Client
  private readonly player: MusicPlayer = new MusicPlayer()
  private readonly embedFactory: EmbedFactory = new EmbedFactory()

  constructor(client: Client) {
    this.client = client
  }

  async chatInputCommand(interaction: ChatInputCommandInteraction): Promise<void> {
    switch (interaction.commandName) {
      case 'join':
        this.handleJoin(interaction)
        break
      case 'leave':
        this.handleLeave(interaction)
        break
      case 'play':
        this.handlePlay(interaction)
        break
      case 'pause':
        this.handlePause(interaction)
        break
      case 'unpause':
        this.handleUnpause(interaction)
        break
      case 'skip':
        this.handleSkip(interaction)
        break
      case 'stop':
        this.handleStop(interaction)
        break
      case 'queue':
        this.handleQueue(interaction)
        break
      case 'clear':
        this.handleLeave(interaction)
        break
      case 'enqueue':
        this.handlePlay(interaction)
        break
      default:
        await interaction.reply('Unknown command')
        break
    }
  }

  private async errorReply(
    interaction: ChatInputCommandInteraction,
    message: string,
  ): Promise<void> {
    await interaction.reply({ embeds: [this.embedFactory.errorEmbed(message)] })
  }

  private async handleQueue(interaction: ChatInputCommandInteraction): Promise<void> {
    const queue = this.player.getQueue()
    if (queue.length === 0) {
      this.queueEmptyReply(interaction)
      return
    }
    const embeds: EmbedBuilder[] = queue.map((song, index) =>
      this.embedFactory.singleSongEmbed(song, index),
    )
    await interaction.reply({ embeds })
  }

  private handleStop(interaction: ChatInputCommandInteraction): void {
    this.player.stop()
    interaction.reply({ embeds: [this.embedFactory.stopEmbed()] })
  }

  private queueEmptyReply(interaction: ChatInputCommandInteraction): void {
    interaction.reply({
      embeds: [
        this.embedFactory.infoEmbed('Queue is empty', "Try adding some songs with '/enqueue'"),
      ],
    })
  }

  private async handleSkip(interaction: ChatInputCommandInteraction): Promise<void> {
    try {
      const current: Song = await this.player.skip()
      interaction.reply({ embeds: [this.embedFactory.songEmbed(current)] })
    } catch (error: any) {
      this.queueEmptyReply(interaction)
    }
  }

  private async handleUnpause(interaction: ChatInputCommandInteraction): Promise<void> {
    try {
      const details = await this.player.play()
      interaction.reply({ embeds: [this.embedFactory.unpauseEmbed(details)] })
    } catch (error: any) {
      this.errorReply(interaction, error.message)
    }
  }

  private handlePause(interaction: ChatInputCommandInteraction): void {
    this.player.pause()
    interaction.reply({ embeds: [this.embedFactory.pauseEmbed()] })
  }

  private async handlePlay(interaction: ChatInputCommandInteraction): Promise<void> {
    const connection = getVoiceConnection(interaction.guildId!)
    if (!connection) {
      await this.handleJoin(interaction, true)
    }
    const query = interaction.options.getString('song', true)
    const details = await this.player.enqueue({ query, username: interaction.user.username })
    interaction.reply({ embeds: [this.embedFactory.enqueueEmbed(details)] })
  }

  private async handleJoin(
    interaction: ChatInputCommandInteraction,
    silent: boolean = false,
  ): Promise<void> {
    const { guildId, guild } = interaction
    const member = interaction.member as GuildMember
    const voiceChannelId = member.voice.channel?.id
    if (!voiceChannelId) {
      if (!silent) {
        interaction.reply('Not in a voice channel')
      }
      return
    }
    const connection = joinVoiceChannel({
      channelId: voiceChannelId,
      guildId: guildId!,
      adapterCreator: guild?.voiceAdapterCreator!,
      selfDeaf: false,
      selfMute: false,
    })
    this.player.addConnection(connection)
    if (!silent) {
      interaction.reply('Joined voice channel')
    }
  }

  private async handleLeave(interaction: ChatInputCommandInteraction): Promise<void> {
    const connection = getVoiceConnection(interaction.guildId!)
    if (!connection) {
      interaction.reply('Not in a voice channel')
      return
    }

    connection.destroy()
    interaction.reply('Left voice channel')
  }
}
