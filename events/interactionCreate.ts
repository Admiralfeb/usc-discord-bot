import { Interaction } from 'discord.js';
import { IBotClient } from '../models/botClient';
import { IBotEvent } from '../models/botEvent';

export const event: IBotEvent = {
  name: 'interactionCreate',
  once: false,
  needsClient: true,
  execute: async (interaction: Interaction, client: IBotClient) => {
    if (!interaction.isCommand()) return;

    if (
      interaction.channel?.type === 'GUILD_TEXT' ||
      interaction.channel?.type === 'GUILD_NEWS_THREAD' ||
      interaction.channel?.type === 'GUILD_PUBLIC_THREAD' ||
      interaction.channel?.type === 'GUILD_PRIVATE_THREAD' ||
      interaction.channel?.type === 'GUILD_NEWS'
    ) {
      console.log(
        `${interaction.user.tag} in #${interaction.channel?.name} triggered an interaction.`
      );
    }

    try {
      await client.commands.get(interaction.commandName)?.execute(interaction);
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content: 'There was an error while executing this command!',
        ephemeral: true,
      });
    }
  },
};

export default event;
