import { ApplicationCommandData, CommandInteraction } from 'discord.js';

export interface BotCommand extends ApplicationCommandData {
  execute: (interaction: CommandInteraction) => Promise<void>;
}
