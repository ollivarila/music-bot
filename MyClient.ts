import {
  Client,
  Collection,
  GatewayIntentBits,
  MessageComponentInteraction,
  ActivityType,
  PresenceUpdateStatus,
  PresenceData,
} from 'discord.js'
import InteractionHandler from './handlers/InteractionHandler'
import dotenv from 'dotenv'
import { Context, MusicBotCommand, Song } from './types'
import path from 'path'
import fs from 'fs'

dotenv.config()

export type MessageComponentHandler = {
  customId: string
  execute: (interaction: MessageComponentInteraction, context: Context) => Promise<void>
}

export default class MyClient extends Client {
  private handler!: InteractionHandler
  public commands: Collection<string, MusicBotCommand> = new Collection()
  public componentHandlers: Collection<string, MessageComponentHandler> = new Collection()

  constructor() {
    const intents: number[] = [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.GuildVoiceStates,
    ]
    super({ intents })
    this.init()
  }

  private init(): void {
    this.on('ready', () => {
      this.user?.setPresence({
        activities: [
          {
            name: 'your requests!',
            type: ActivityType.Listening,
          },
        ],
        afk: false,
        status: PresenceUpdateStatus.Online,
      })

      this.on('newSong', (song: Song) => {
        if (!song) {
          console.log('No song found')
          this.user?.setPresence({
            activities: [
              {
                name: 'your requests!',
                type: ActivityType.Listening,
              },
            ],
            afk: false,
            status: PresenceUpdateStatus.Online,
          })
          return
        }
        console.log('Song found')
        this.user?.setPresence({
          activities: [
            {
              name: song.details.title || 'music!',
              type: ActivityType.Streaming,
            },
          ],
          afk: false,
          status: PresenceUpdateStatus.Online,
        })
      })
      this.handler = new InteractionHandler(this)
      console.log('Ready!')
    })

    this.on('interactionCreate', async (interaction) => {
      if (interaction.isChatInputCommand()) {
        this.handler.chatInputCommand(interaction)
      }

      if (interaction.isMessageComponent()) {
        this.handler.messageComponent(interaction)
      }
    })
    this.loadCommands()
    this.loadComponentHandlers()
  }

  public changePresence(data: PresenceData): void {
    this.user?.setPresence(data)
  }

  private loadCommands(): void {
    this.commands = new Collection()
    const commandsPath = path.join(__dirname, 'commands')
    const commandFiles = fs
      .readdirSync(commandsPath)
      .filter((file) => file.endsWith('.ts') || file.endsWith('.js'))

    for (const file of commandFiles) {
      const filePath = path.join(commandsPath, file)
      const command = require(filePath) as MusicBotCommand
      // Set a new item in the Collection with the key as the command name and the value as the exported module
      if ('data' in command && 'execute' in command) {
        this.commands.set(command.data.name, command)
      } else {
        console.log(
          `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`,
        )
        throw new Error('Command loading failed')
      }
    }
    console.log('Commands loaded successfully')
  }

  private loadComponentHandlers(): void {
    this.componentHandlers = new Collection()
    const handlersPath = path.join(__dirname, 'componentHandlers')
    const files = fs
      .readdirSync(handlersPath)
      .filter((file) => file.endsWith('.ts') || file.endsWith('.js'))

    for (const file of files) {
      const filePath = path.join(handlersPath, file)
      const handler = require(filePath) as MessageComponentHandler
      if ('customId' in handler && 'execute' in handler) {
        this.componentHandlers.set(handler.customId, handler)
      } else {
        console.log(
          `[WARNING] The command at ${filePath} is missing a required "customId" or "execute" property.`,
        )
        throw new Error('Handler loading failed')
      }
    }
    console.log('Handlers loaded successfully')
  }

  public start(): void {
    this.login(process.env.TOKEN)
  }
}
