import { ClientEvents, GuildMember } from 'discord.js';

export const event: IEvent = {
  name: 'guildMemberRemove',
  once: false,
  needsClient: false,
  execute: (member: GuildMember): Promise<void> => {},
};

interface IEvent {
  name: keyof ClientEvents;
  once: boolean;
  needsClient: boolean;
  execute: (...args: unknown[]) => Promise<void>;
}
