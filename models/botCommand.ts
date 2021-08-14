import { ApplicationCommandData, CommandInteraction } from 'discord.js';

export interface IBotCommand extends ApplicationCommandData {
  execute: (interaction: CommandInteraction) => Promise<void>;
}
