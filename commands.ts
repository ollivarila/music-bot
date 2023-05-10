import { ApplicationCommandOption, REST, Routes, ApplicationCommandOptionType } from 'discord.js'
import dotenv from 'dotenv'

dotenv.config()

type Command = {
  name: string
  description: string
  options?: ApplicationCommandOption[]
}

const commands: Command[] = [
  {
    name: 'join',
    description: 'Join a voice channel',
  },
  {
    name: 'leave',
    description: 'Leave a voice channel',
  },
  {
    name: 'play',
    description: 'Play a song, adds song to queue if already playing',
    options: [
      {
        name: 'song',
        description: 'The song to play',
        type: ApplicationCommandOptionType.String,
        required: true,
      },
    ],
  },
  {
    name: 'pause',
    description: 'Pause the current song',
  },
  {
    name: 'unpause',
    description: 'Resume the current song',
  },
  {
    name: 'skip',
    description: 'Skip the current song',
  },
  {
    name: 'stop',
    description: 'Stop the current song',
  },
  {
    name: 'queue',
    description: 'Show the current queue',
  },
  {
    name: 'clear',
    description: 'Clear the current queue',
  },
  {
    name: 'enqueue',
    description: 'Add a song to the queue',
    options: [
      {
        name: 'song',
        description: 'The song to add',
        type: ApplicationCommandOptionType.String,
        required: true,
      },
    ],
  },
]

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN!)

async function update(): Promise<void> {
  try {
    console.log('Started refreshing application (/) commands.')

    await rest.put(Routes.applicationCommands(process.env.CLIENT_ID!), { body: commands })

    console.log('Successfully reloaded application (/) commands.')
  } catch (error) {
    console.error(error)
  }
}

update()
