import { Client } from 'discord.js';
import { guildId } from '../config';
import { getCommandData } from '../functions/getCommandData';
import { IBotClient } from '../models/botClient';
import { IBotEvent } from '../models/botEvent';

export const event: IBotEvent = {
  name: 'ready',
  once: true,
  needsClient: true,
  execute: async (client: Client, bot: IBotClient) => {
    console.log(`Ready! Logged in as ${client.user?.tag}`);

    await client.guilds.cache
      .get(guildId)
      ?.commands.set(getCommandData(bot.commands));
  },
};
export default event;
