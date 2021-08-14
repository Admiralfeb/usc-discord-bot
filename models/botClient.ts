import { Client, Collection } from 'discord.js';
import { IBotCommand } from './botCommand';

export interface IBotClient {
  client: Client;
  commands: Collection<string, IBotCommand>;
}
