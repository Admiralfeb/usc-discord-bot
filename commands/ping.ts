import { IBotCommand } from '../models/botCommand';

export const command: IBotCommand = {
  name: 'ping',
  description: 'Replies with Pong',
  execute: async (interaction) =>
    await interaction.reply({ content: 'Pong!', ephemeral: true }),
};
export default command;
