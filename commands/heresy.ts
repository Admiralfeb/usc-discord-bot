import { IBotCommand } from '../models/botCommand';

export const command: IBotCommand = {
  name: 'heresy',
  description: 'Stop your heresy',
  execute: async (interaction) =>
    await interaction.reply(
      'https://tenor.com/view/cease-your-heresy-warhammer-40k-gif-19005947'
    ),
};
export default command;
