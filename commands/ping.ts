import { CommandInteraction } from 'discord.js';
import { BotCommand } from '../models/botCommand';

const name = 'ping';
const description = 'Replies with Pong';
const execute = async (interaction: CommandInteraction): Promise<void> => {
  await interaction.reply({ content: 'Pong!', ephemeral: true });
};

export const command: BotCommand = { name, description, execute };
export default command;
