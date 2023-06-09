import {
  APIActionRowComponent,
  APIMessageActionRowComponent,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} from 'discord.js'
import { Song } from '../types'
import { YouTubeVideo } from 'play-dl'

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

  public queueEmptyEmbed(): EmbedBuilder {
    return this.infoEmbed('Queue Empty', "Try adding some songs with '/enqueue'")
  }

  private parseThumbnailUrl(url: string): string {
    const videoId = url.split('v=')[1].split('&')[0]
    return `http://i3.ytimg.com/vi/${videoId}/hqdefault.jpg`
  }

  public componentEmbed(video: YouTubeVideo): ComponentEmbed {
    const embed = this.baseEmbed()
      .setTitle('Song')
      .setDescription(`🎵 - ${video.title} - 🎵`)
      .setThumbnail(this.parseThumbnailUrl(video.url))
      .setFields([
        {
          name: 'Duration',
          value: this.parseDuration(video.durationInSec),
        },
      ])
    const component = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setStyle(ButtonStyle.Primary)
          .setLabel('Previous')
          .setCustomId('previous'),
        new ButtonBuilder().setStyle(ButtonStyle.Primary).setLabel('Next').setCustomId('next'),
        new ButtonBuilder().setStyle(ButtonStyle.Success).setLabel('Select').setCustomId('select'),
      )
      .toJSON() as APIActionRowComponent<APIMessageActionRowComponent>

    return { embed, component }
  }
}

export type ComponentEmbed = {
  embed: EmbedBuilder
  component: APIActionRowComponent<APIMessageActionRowComponent>
}
