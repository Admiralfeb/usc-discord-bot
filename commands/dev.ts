import { MessageActionRow, MessageButton } from 'discord.js';
import { ownerId } from '../config';
import { IBotCommand } from '../models/botCommand';

export const command: IBotCommand = {
  name: 'dev',
  description: "Bot's dev functions",
  options: [
    {
      name: 'github',
      description: 'Lists github pages for development',
      type: 'SUB_COMMAND_GROUP',
      options: [
        {
          name: 'bot',
          description: "List the bot's github",
          type: 'SUB_COMMAND',
        },
        {
          name: 'website',
          description: "List the website's github",
          type: 'SUB_COMMAND',
        },
      ],
    },
    {
      name: 'shutdown',
      description: 'shuts down the bot. Only Admiralfeb can perform this.',
      type: 'SUB_COMMAND',
    },
  ],
  execute: async (interaction) => {
    switch (interaction.options.getSubcommand()) {
      case 'bot':
        await interaction.reply(buildBotResponse());
        break;
      case 'website':
        await interaction.reply(buildWebsiteResponse());
        break;
      case 'shutdown':
        if (interaction.user.id === ownerId) {
          await interaction.reply({
            content: 'Bot will shutdown in a moment.',
          });
          interaction.client.destroy();
        } else
          interaction.reply({
            content: 'you are not the owner.',
            ephemeral: true,
          });
        break;
      default:
        break;
    }
  },
};
export default command;

const buildBotResponse = (): {
  content: string;
  components: MessageActionRow[];
} => {
  const message = "Click the button below for the bot's github.";
  const row = new MessageActionRow().addComponents(
    new MessageButton()
      .setStyle('LINK')
      .setLabel("Click me for the bot's github")
      .setURL('https://github.com/admiralfeb/usc-discord-bot-js')
  );
  return { content: message, components: [row] };
};

const buildWebsiteResponse = (): {
  content: string;
  components: MessageActionRow[];
} => {
  const message = "Click the button below for the websites's github.";
  const row = new MessageActionRow().addComponents(
    new MessageButton()
      .setStyle('LINK')
      .setLabel("Click me for the website's github")
      .setURL('https://github.com/admiralfeb/usc-website')
  );
  return { content: message, components: [row] };
};
