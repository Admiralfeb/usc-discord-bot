import {
  CommandInteraction,
  MessageActionRow,
  MessageButton,
} from 'discord.js';
import { getInaraCmdr } from '../functions/getInaraCmdr';
import { IBotCommand } from '../models/botCommand';
export const command: IBotCommand = {
  name: 'inara',
  description: `Inara Commands`,
  options: [
    {
      name: 'cmdr',
      description: 'Get your Cmdr data',
      type: 'SUB_COMMAND',
      options: [
        {
          name: 'cmdr',
          description: 'CMDR name',
          type: 'STRING',
          required: true,
        },
      ],
    },
    {
      name: 'squadron',
      description: 'Get the inara squad link',
      type: 'SUB_COMMAND',
    },
  ],
  execute: async (interaction) => {
    await interaction.deferReply();
    const command = interaction.options.getSubcommand();

    switch (command) {
      case 'cmdr':
        await inaraCmdr(interaction);
        break;
      case 'squadron':
        await inaraSquad(interaction);
        break;
      default:
        break;
    }
  },
};
export default command;

const inaraCmdr = async (interaction: CommandInteraction) => {
  const cmdr = interaction.options.getString('cmdr', true);
  const user = interaction.user.tag;

  const response = await getInaraCmdr(cmdr, user);
  await interaction.editReply(response);
};

const inaraSquad = async (interaction: CommandInteraction) => {
  await interaction.editReply({
    content: 'Inara Squadron',
    components: [
      new MessageActionRow().addComponents(
        new MessageButton()
          .setLabel('United Systems Cooperative')
          .setStyle('LINK')
          .setURL('https://inara.cz/squadron/7028/')
      ),
    ],
  });
};
