import { ApplicationCommandData, Collection } from 'discord.js';
import { BotCommand } from '../models/botCommand';

export const getCommandData = (
  commandCollection: Collection<string, BotCommand>
): ApplicationCommandData[] => {
  let commands: ApplicationCommandData[] = [];
  for (const command of commandCollection) {
    const data = command[1];
    commands = [
      ...commands,
      { name: data.name, description: data.description, options: data.options },
    ];
  }
  return commands;
};
