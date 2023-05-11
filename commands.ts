import {
  ApplicationCommandOption,
  REST,
  Routes,
  ApplicationCommandOptionType,
  SlashCommandBuilder,
} from 'discord.js'
import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'
import { MusicBotCommand } from './types'

dotenv.config()

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN!)

async function update(): Promise<void> {
  await fromCommandsFolder()
}

async function fromCommandsFolder(): Promise<void> {
  try {
    console.log('Started refreshing application (/) commands from commands folder.')

    const cmds = loadUpThatPlate()

    await rest.put(Routes.applicationCommands(process.env.CLIENT_ID!), { body: cmds })

    console.log('Successfully reloaded application (/) commands from commands folder.')
  } catch (error) {
    console.error(error)
  }
}

function loadUpThatPlate(): SlashCommandBuilder[] {
  const commands = [] as SlashCommandBuilder[]
  const commandsPath = path.join(__dirname, 'commands')
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith('.ts') || file.endsWith('.js'))

  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file)
    const command = require(filePath) as MusicBotCommand
    console.log(command)
    if ('data' in command) {
      commands.push(command.data)
    } else {
      console.log(
        `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`,
      )
      throw new Error('Missing data or execute property')
    }
  }
  return commands
}

update()
