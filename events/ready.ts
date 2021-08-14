import { Client, ClientEvents } from 'discord.js';
import { guildId } from '../config';
import { getCommandData } from '../functions/getCommandData';
import { BotClient } from '../models/botClient';
const name: keyof ClientEvents = 'ready';
const once = true;
const needsClient = true;
const execute = async (client: Client, bot: BotClient): Promise<void> => {
  console.log(`Ready! Logged in as ${client.user?.tag}`);

  await client.guilds.cache
    .get(guildId)
    ?.commands.set(getCommandData(bot.commands));
};

export const event = { name, once, needsClient, execute };
export default event;
