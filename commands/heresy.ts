import { CommandInteraction } from 'discord.js';
import { BotCommand } from '../models/botCommand';

const name = 'heresy';
const description = 'Stop your heresy';
const execute = async (interaction: CommandInteraction): Promise<void> => {
  await interaction.reply(
    'https://tenor.com/view/cease-your-heresy-warhammer-40k-gif-19005947'
  );
};

export const command: BotCommand = { name, description, execute };
export default command;
