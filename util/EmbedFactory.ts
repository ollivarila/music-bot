import { EmbedBuilder } from 'discord.js'
import { Song } from '../types'

export class EmbedFactory {
  constructor() {}

  private baseEmbed(): EmbedBuilder {
    return new EmbedBuilder()
      .setColor('#8a00c2')
      .setTimestamp()
      .setFooter({ text: 'Made with ❤️ by Crea' })
  }

  public infoEmbed(title: string, desc: string): EmbedBuilder {
    return this.baseEmbed().setDescription(desc).setTitle(title)
  }

  public singleSongEmbed(song: Song, index: number): EmbedBuilder {
    const { details } = song
    const thumbnailUrl = this.parseThumbnailUrl(details.url)
    return this.baseEmbed()
      .setTitle(`Song ${index + 1}`)
      .setDescription(`🎵 - ${details.title} - 🎵`)
      .addFields([
        {
          name: 'Duration',
          value: this.parseDuration(details.durationInSec),
          inline: true,
        },
        {
          name: 'Requested by',
          value: song.username,
          inline: true,
        },
      ])
      .setThumbnail(thumbnailUrl)
  }

  public enqueueEmbed(song: Song): EmbedBuilder {
    const { details } = song
    const thumbnailUrl = this.parseThumbnailUrl(details.url)
    return this.baseEmbed()
      .setTitle('Enqueued')
      .setDescription(`🎵 - ${details.title} - 🎵`)
      .addFields([
        {
          name: 'Duration',
          value: this.parseDuration(details.durationInSec),
          inline: true,
        },
        {
          name: 'Requested by',
          value: song.username,
          inline: true,
        },
      ])
      .setThumbnail(thumbnailUrl)
  }

  public songEmbed(request: Song) {
    const { details } = request
    const thumbnailUrl = this.parseThumbnailUrl(details.url)
    return this.baseEmbed()
      .setTitle('Now Playing')
      .setDescription(`🎵 - ${details.title} - 🎵`)
      .addFields([
        {
          name: 'Duration',
          value: this.parseDuration(details.durationInSec),
          inline: true,
        },
        {
          name: 'Requested by',
          value: request.username,
          inline: true,
        },
      ])
      .setThumbnail(thumbnailUrl)
  }

  private parseDuration(duration: number): string {
    const minutes = Math.floor(duration / 60)
    const seconds = duration - minutes * 60
    return `${minutes}:${seconds}`
  }

  public errorEmbed(error: string) {
    return this.baseEmbed().setTitle('Error').setDescription(error)
  }

  public pauseEmbed(): EmbedBuilder {
    return this.baseEmbed().setTitle('Paused')
  }

  public stopEmbed(): EmbedBuilder {
    return this.baseEmbed().setTitle('Stopped')
  }

  public unpauseEmbed(request: Song): EmbedBuilder {
    return this.songEmbed(request).setTitle('Unpaused -- Now Playing')
  }

  private parseThumbnailUrl(url: string): string {
    const videoId = url.split('v=')[1].split('&')[0]
    return `http://i3.ytimg.com/vi/${videoId}/hqdefault.jpg`
  }
}
