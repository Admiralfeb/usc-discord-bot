import {
  ApplicationCommandPermissionData,
  ChatInputApplicationCommandData,
  CommandInteraction,
} from 'discord.js';

export interface IBotCommand extends ChatInputApplicationCommandData {
  permissions?: ApplicationCommandPermissionData[];
  isDev?: boolean;
  execute: (interaction: CommandInteraction) => Promise<void>;
}
