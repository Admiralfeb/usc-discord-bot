import {
  ApplicationCommandOption,
  CommandInteraction,
  Message,
  MessageEmbed,
  TextChannel,
} from 'discord.js';
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
  {
    name: 'show',
    description: 'Display results of poll',
    type: 'SUB_COMMAND',
    options: [
      {
        name: 'channel',
        description: 'channel where poll exists',
        required: true,
        type: 'CHANNEL',
      },
      {
        name: 'messageid',
        description: 'Message ID of the poll',
        required: true,
        type: 'STRING',
      },
    ],
  },
];

const execute = async (interaction: CommandInteraction): Promise<void> => {
  switch (interaction.options.getSubcommand()) {
    case 'create':
      await createPoll(interaction);
      break;
    case 'show':
      await showPoll(interaction);
      break;
    default:
      break;
  }
};

export const command: BotCommand = { name, description, options, execute };
export default command;

const createPoll = async (interaction: CommandInteraction) => {
  const username = interaction.user.tag;
  const timestamp = interaction.createdAt;
  const question = interaction.options.getString('question', true);
  const choice1 = interaction.options.getString('choice1', true);
  const choice2 = interaction.options.getString('choice2', true);
  const choice3 = interaction.options.getString('choice3');
  const choice4 = interaction.options.getString('choice4');
  const choice5 = interaction.options.getString('choice5');
  const choice6 = interaction.options.getString('choice6');
  const choice7 = interaction.options.getString('choice7');
  const choice8 = interaction.options.getString('choice8');
  const choice9 = interaction.options.getString('choice9');
  const choice10 = interaction.options.getString('choice10');

  let messageBody = `:one: ${choice1}` + `\n:two: ${choice2}`;
  messageBody = choice3 ? messageBody + `\n:three: ${choice3}` : messageBody;
  messageBody = choice4 ? messageBody + `\n:four: ${choice4}` : messageBody;
  messageBody = choice5 ? messageBody + `\n:five: ${choice5}` : messageBody;
  messageBody = choice6 ? messageBody + `\n:six: ${choice6}` : messageBody;
  messageBody = choice7 ? messageBody + `\n:seven: ${choice7}` : messageBody;
  messageBody = choice8 ? messageBody + `\n:eight: ${choice8}` : messageBody;
  messageBody = choice9 ? messageBody + `\n:nine: ${choice9}` : messageBody;
  messageBody = choice10
    ? messageBody + `\n:keycap_ten: ${choice10}`
    : messageBody;

  const embed = new MessageEmbed()
    .setTitle(question)
    .setFooter(`Poll by ${username}`)
    .setTimestamp(timestamp)
    .setDescription(messageBody);

  const message = (await interaction.reply({
    embeds: [embed],
    fetchReply: true,
  })) as Message;
  await message.react('1️⃣');
  await message.react('2️⃣');
  if (choice3) await message.react('3️⃣');
  if (choice4) await message.react('4️⃣');
  if (choice5) await message.react('5️⃣');
  if (choice6) await message.react('6️⃣');
  if (choice7) await message.react('7️⃣');
  if (choice8) await message.react('8️⃣');
  if (choice9) await message.react('9️⃣');
  if (choice10) await message.react('🔟');
};

const showPoll = async (interaction: CommandInteraction) => {
  const channel = interaction.options.getChannel('channel', true);
  const messageId = interaction.options.getString('messageid', true);
  if (
    channel.type === 'GUILD_VOICE' ||
    channel.type === 'GUILD_STAGE_VOICE' ||
    channel.type === 'GUILD_CATEGORY' ||
    channel.type === 'GUILD_STORE'
  ) {
    interaction.reply({
      content: 'Channel provided is not a text channel',
      ephemeral: true,
    });
    return;
  }
  const textChannel = channel as TextChannel;
  const message = await textChannel.messages.fetch(messageId);
  const reactions = message.reactions.cache;

  let labels: string[] = [];
  let counts: number[] = [];
  for (const react of reactions.values()) {
    labels = [...labels, react.emoji.toString()];
    counts = [...counts, react.count - 1];
  }
  const chart = {
    type: 'bar',
    data: {
      labels,
      datasets: [{ label: 'votes', data: counts }],
    },
  };
  const encodedChart = encodeURIComponent(JSON.stringify(chart));
  const chartURL = `https://quickchart.io/chart?c=${encodedChart}`;
  await interaction.reply({ content: chartURL });
};
