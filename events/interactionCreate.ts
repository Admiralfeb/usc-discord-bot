import { Interaction } from 'discord.js';
import { BotClient } from '../models/botClient';

const name = 'interactionCreate';
const execute = async (
  interaction: Interaction,
  client: BotClient
): Promise<void> => {
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
};

export const event = { name, once: false, execute };
export default event;
