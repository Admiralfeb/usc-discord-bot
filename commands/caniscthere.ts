import { MessageActionRow, MessageButton } from 'discord.js';
import { IBotCommand } from '../models/botCommand';

export const command: IBotCommand = {
  name: 'caniscthere',
  description: 'Can I supercruise there?',
  execute: async (interaction) => {
    const row = new MessageActionRow().addComponents(
      new MessageButton()
        .setStyle('LINK')
        .setLabel('Click Me to find out if you can supercruise there.')
        .setURL('http://caniflytothenextstarinelitedangero.us/')
    );
    await interaction.reply({
      content: 'Click the button below.',
      components: [row],
    });
  },
};
export default command;
