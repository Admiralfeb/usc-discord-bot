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
    // await client.guilds.cache.get(guildId)?.commands.set([]);
    const commands = await client.guilds.cache
      .get(guildId)
      ?.commands.set(getCommandData(bot.commands));

    for (const cmd of bot.commands) {
      const permissionsToSet = cmd[1].permissions;
      if (permissionsToSet) {
        const setCmd = commands?.find((x) => x.name === cmd[1].name);
        await setCmd?.permissions.set({ permissions: permissionsToSet });
      }
    }
    console.log(`Ready! Logged in as ${client.user?.tag}`);
  },
};
export default event;
