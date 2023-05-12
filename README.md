# Music bot

This is a discord music bot built as a fun side project for a discord server for me and my friends. It uses **discord.js**, **@discordjs/voice** and **play-dl** packages for the main functionalities.

So far this bot works only on one server at a time. (You can have it on multiple servers but the track queue is global)

This app is deployed to fly.io. But can be run as a container if you build an image with the dockerfile.

## Features

### Rich presence

The bot shows if it is waiting for song requests or if it is currently playing something.
The currently playing song is displayed under the bots name as an activity.

### Slash commands

- current - shows the currently playing song
- enqueue - add a track to the queue
- join - join the voice channel where the user is
- leave - leaves the voice channel where the user is
- pause - pauses the currently playing track
- play - same as enqueue
- queue - shows all tracks in the queue
- search - interactively search for a track with given query and enqueue it (uses message components)
- skip - skips the currently playing song
- stop - stops playback and removes the currently playing track
- unpause - unpauses playback
- seek - coming soon

### Auto-disconnect

Automatically destroys connections if no music is being played for some period of time.

## Useful resources

- [discord.js](https://discord.js.org/#/)
- [discord.js - voice](https://discordjs.guide/voice/)
- [discord docs](https://discord.com/developers/docs/intro)
- [play-dl](https://github.com/play-dl/play-dl)

## Setup

If you wish to run this on your own machine follow these steps.

1. Clone the repo
2. Install dependencies with

```
npm install
```

3. Create .env file and place [required](#required-environment-variables) variables there
4. You can run as dev if you have nodemon installed with

```
npm run dev
```

5. Alternatively you can build the project with

```
npm run build
```

and then start with

```
npm start
```

## Required environment variables

```
TOKEN # discord token
CLIENT_ID # discord client id
```

## Architecture

All commands are located in the `commands` directory. Commands are separated into their own files. See more [here](./commands/commands_doc.md)

`componentHandlers` folder contains handlers for message components. These are used when browsing search results. More [here](./componentHandlers/componentHandlers_doc.md)

`handlers` folder contains a handler for all interactions and the MusicPlayer. More [here](./handlers/handlers_doc.md)

`app.ts` is the main entrypoint for the app. It starts the **Client** imported from `MyClient.ts` and creates a basic http server for health checks.

`commands.ts` contains a script for updating all of the commands. This can be used with

```
npm run update:commands
```

`MyClient.ts` is a custom client that extends the discord.js Client class.

## TODOS

- some testing
- track visualizer
- seek
- docs
