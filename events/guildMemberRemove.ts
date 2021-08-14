import { GuildMember } from 'discord.js';
import { IBotEvent } from '../models/botEvent';

export const event: IBotEvent = {
  name: 'guildMemberRemove',
  once: false,
  needsClient: false,
  execute: async (member: GuildMember) => {
    return;
  },
};
