import { Client } from 'discord.js';
import { zeneration_guild } from '../config';
import { getCommandData } from '../functions/getCommandData';
import { BotClient } from '../models/botClient';
const name = 'ready';
const once = true;
const execute = async (client: Client, bot: BotClient): Promise<void> => {
  console.log({ client, bot });
  console.log(`Ready! Logged in as ${client.user?.tag}`);

  await client.guilds.cache
    .get(zeneration_guild)
    ?.commands.set(getCommandData(bot.commands));
};

export const event = { name, once, execute };
export default event;
