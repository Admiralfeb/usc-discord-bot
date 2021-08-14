import { ClientEvents } from 'discord.js';

export interface IBotEvent {
  name: keyof ClientEvents;
  once: boolean;
  needsClient: boolean;
  execute: (...params: never) => Promise<void>;
}
