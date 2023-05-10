import { Client, GatewayIntentBits } from 'discord.js'
import InteractionHandler from './handlers/InteractionHandler'
import dotenv from 'dotenv'

dotenv.config()

export default class MyClient extends Client {
  private readonly handler: InteractionHandler

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
  }

  public start(): void {
    this.login(process.env.TOKEN)
  }
}
