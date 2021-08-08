import { ApplicationCommandOption, CommandInteraction } from 'discord.js';
import { BotCommand } from '../models/botCommand';

const name = 'poll';
const description = 'handles polls';
const options: ApplicationCommandOption[] = [
  {
    name: 'create',
    description: 'Create a poll',
    type: 'SUB_COMMAND',
    options: [
      {
        name: 'question',
        description: 'What is the question?',
        type: 'STRING',
        required: true,
      },
      {
        name: 'choice1',
        description: 'choice 1',
        type: 'STRING',
        required: true,
      },
      {
        name: 'choice2',
        description: 'choice 2',
        type: 'STRING',
        required: true,
      },
      {
        name: 'choice3',
        description: 'choice 3',
        type: 'STRING',
        required: false,
      },
      {
        name: 'choice4',
        description: 'choice 4',
        type: 'STRING',
        required: false,
      },
      {
        name: 'choice5',
        description: 'choice 5',
        type: 'STRING',
        required: false,
      },
      {
        name: 'choice6',
        description: 'choice 6',
        type: 'STRING',
        required: false,
      },
      {
        name: 'choice7',
        description: 'choice 7',
        type: 'STRING',
        required: false,
      },
      {
        name: 'choice8',
        description: 'choice 8',
        type: 'STRING',
        required: false,
      },
      {
        name: 'choice9',
        description: 'choice 9',
        type: 'STRING',
        required: false,
      },
      {
        name: 'choice10',
        description: 'choice 10',
        type: 'STRING',
        required: false,
      },
    ],
  },
];

const execute = async (interaction: CommandInteraction): Promise<void> => {
  switch (interaction.options.getSubcommand()) {
    case 'create':
      createPoll(interaction);
      break;
    case 'show':
      break;
    default:
      break;
  }
};

export const command: BotCommand = { name, description, options, execute };
export default command;

const createPoll = (interaction: CommandInteraction) => {
  const question = interaction.options.getString('question');
  const choice1 = interaction.options.getString('choice1');
  const choice2 = interaction.options.getString('choice2');
  const choice3 = interaction.options.getString('choice3');
  const choice4 = interaction.options.getString('choice4');
  const choice5 = interaction.options.getString('choice5');
  const choice6 = interaction.options.getString('choice6');
  const choice7 = interaction.options.getString('choice7');
  const choice8 = interaction.options.getString('choice8');
  const choice9 = interaction.options.getString('choice9');
  const choice10 = interaction.options.getString('choice10');
};
