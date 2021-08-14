import fs from 'fs';
import { Client, Collection, Intents } from 'discord.js';
import { token } from './config';
import { BotClient } from './models/botClient';
import { BotCommand } from './models/botCommand';

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    Intents.FLAGS.GUILD_MEMBERS,
  ],
  partials: ['MESSAGE', 'CHANNEL', 'REACTION', 'GUILD_MEMBER'],
});
const commands = new Collection<string, BotCommand>();

const botClient: BotClient = { client, commands };

export const startBot = (): void => {
  console.log(__dirname);
  const commandFiles = fs
    .readdirSync(`${__dirname}/commands`)
    .filter((file) => file.endsWith('.js'));
  for (const file of commandFiles) {
    // const command = require(`./commands/${file}`);
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { command } = require(`${__dirname}/commands/${file}`);
    // set a new item in the Collection
    // with the key as the command name and the value as the exported module
    botClient.commands.set(command.name, command);
  }

  const eventFiles = fs
    .readdirSync(`${__dirname}/events`)
    .filter((file) => file.endsWith('.js'));
  for (const file of eventFiles) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { event } = require(`${__dirname}/events/${file}`);
    if (event.needsClient === true) {
      if (event.once) {
        botClient.client.once(event.name, (...args: unknown[]) => {
          event.execute(...args, botClient);
        });
      } else {
        botClient.client.on(event.name, (...args: unknown[]) => {
          event.execute(...args, botClient);
        });
      }
    } else {
      if (event.once) {
        botClient.client.once(event.name, (...args: unknown[]) => {
          event.execute(...args);
        });
      } else {
        botClient.client.on(event.name, (...args: unknown[]) => {
          event.execute(...args);
        });
      }
    }
  }

  botClient.client.login(token);
};

export const stopBot = (): void => {
  botClient.client.destroy();
};
