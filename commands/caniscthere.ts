import {
  CommandInteraction,
  MessageActionRow,
  MessageButton,
} from 'discord.js';
import { BotCommand } from '../models/botCommand';

const name = 'caniscthere';
const description = 'Can I supercruise there?';
const execute = async (interaction: CommandInteraction): Promise<void> => {
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
};

export const command: BotCommand = { name, description, execute };
export default command;
