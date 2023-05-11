import { Client, Collection, GatewayIntentBits } from 'discord.js'
import InteractionHandler from './handlers/InteractionHandler'
import dotenv from 'dotenv'
import { MusicBotCommand } from './types'
import path from 'path'
import fs from 'fs'

dotenv.config()

export default class MyClient extends Client {
  private readonly handler: InteractionHandler
  public commands: Collection<string, MusicBotCommand> = new Collection()

  constructor() {
    const intents: number[] = [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.GuildVoiceStates,
    ]
    super({ intents })

    this.handler = new InteractionHandler(this)

    this.init()
  }

  private init(): void {
    this.on('ready', () => {
      console.log('Ready')
    })

    this.on('interactionCreate', async (interaction) => {
      if (interaction.isChatInputCommand()) {
        this.handler.chatInputCommand(interaction)
      }
    })
    this.loadCommands()
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

  public start(): void {
    this.login(process.env.TOKEN)
  }
}
