import {
  ApplicationCommandData,
  ApplicationCommandPermissionData,
  CommandInteraction,
} from 'discord.js';

export interface IBotCommand extends ApplicationCommandData {
  permissions?: ApplicationCommandPermissionData[];
  execute: (interaction: CommandInteraction) => Promise<void>;
}
