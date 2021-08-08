import { Client, Collection } from 'discord.js';
import { BotCommand } from './botCommand';

export interface BotClient {
  client: Client;
  commands: Collection<string, BotCommand>;
}
