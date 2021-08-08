/* eslint-disable no-case-declarations */
import {
  ApplicationCommandOption,
  CommandInteraction,
  MessageEmbed,
} from 'discord.js';
import RankData from '../data/ranks';
import { BotCommand } from '../models/botCommand';

const name = 'edu';
const description = "Bot's educational functions";
const options: ApplicationCommandOption[] = [
  {
    name: 'promotions',
    description: 'How do I get promoted?',
    type: 'SUB_COMMAND',
    options: [
      {
        name: 'user',
        description: 'discord user to change',
        type: 'USER',
        required: false,
      },
    ],
  },
  {
    name: 'ranks',
    description: "What are the Pilot's Federation or Navy Ranks?",
    type: 'SUB_COMMAND',
    options: [
      {
        name: 'rank_set',
        description: 'Rank to see',
        required: true,
        type: 'STRING',
        choices: [
          { name: 'Combat - Ship Only', value: 'combat' },
          { name: 'Trade - Ship Only', value: 'trade' },
          { name: 'Exploration - Ship Only', value: 'exploration' },
          { name: 'CQC - Ship Only', value: 'cqc' },
          { name: 'Exobiologist - Foot Only', value: 'exobiologist' },
          { name: 'Mercenary - Foot Only', value: 'mercenary' },
          { name: 'Imperial Navy', value: 'empire' },
          { name: 'Federation Navy', value: 'federation' },
        ],
      },
      {
        name: 'user',
        description: 'Send this to a cmdr instead of public',
        type: 'USER',
        required: false,
      },
    ],
  },
];

const execute = async (interaction: CommandInteraction): Promise<void> => {
  console.log(interaction.options);

  switch (interaction.options.getSubcommand()) {
    case 'promotions':
      await promotions(interaction);
      break;
    case 'ranks':
      await ranks(interaction);
      break;
    default:
      await interaction.editReply({
        content: 'Error in educational interaction',
      });
      break;
  }
};

export const command: BotCommand = { name, description, options, execute };
export default command;

const promotions = async (interaction: CommandInteraction): Promise<void> => {
  const promotionEmbed = new MessageEmbed()
    .setTitle('How do I get promoted?')
    .addFields(
      {
        name: 'Ensign',
        value:
          "You must have spent at least one week in squad and you've joined the squad in-game and in Discord",
      },
      {
        name: 'Lieutenant',
        value:
          "Ensign requirements + You've joined the Inara squad and have a good understanding of the game/engineers",
      },
      {
        name: 'Lt. Commander',
        value:
          'Lieutenant + joined the mentorship mission on Inara and have been approved by High Command',
      },
      {
        name: 'Captain + ',
        value:
          'Selected from the Lt. Cmdrs and offered the role of High Command.',
      }
    );
  const promotionUser = interaction.options.getUser('user');
  if (promotionUser) {
    await promotionUser.send({ embeds: [promotionEmbed] });
    await interaction.reply({
      content: 'Info sent to user',
      ephemeral: true,
    });
  } else {
    await interaction.reply({ embeds: [promotionEmbed] });
  }
};

const ranks = async (interaction: CommandInteraction): Promise<void> => {
  const rankSet = interaction.options.getString('rank_set', true);
  const rankList: string[] =
    RankData.find((x) => x.name === rankSet)?.ranks ?? [];
  if (rankList.length < 1) {
    await interaction.reply({
      content: 'That rank does not exist.',
      ephemeral: true,
    });
    return;
  }

  const rankEmbed = new MessageEmbed()
    .setTitle('Ranks')
    .setDescription('Listed from lowest to highest')
    .addField(
      rankSet.charAt(0).toUpperCase() + rankSet.slice(1),
      rankList.join('\n')
    );
  const rankUser = interaction.options.getUser('user');
  if (rankUser) {
    await rankUser.send({ embeds: [rankEmbed] });
    await interaction.reply({
      content: 'Info sent to user',
      ephemeral: true,
    });
  } else {
    await interaction.reply({ embeds: [rankEmbed] });
  }
};
