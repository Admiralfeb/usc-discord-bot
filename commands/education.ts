import { CommandInteraction, MessageEmbed } from 'discord.js';
import RankData from '../data/ranks';
import { IBotCommand } from '../models/botCommand';

const INFORMATION_SENT = 'Information sent to user.';

export const command: IBotCommand = {
  name: 'edu',
  description: "Bot's education functions",
  options: [
    {
      name: 'combat-logging',
      description: 'What is combat logging?',
      type: 'SUB_COMMAND',
      options: [
        {
          name: 'user',
          description: 'discord user to send to',
          type: 'USER',
          required: false,
        },
      ],
    },
    {
      name: 'engineers-fox',
      description: "Fox's Guide to unlock engineers",
      type: 'SUB_COMMAND',
      options: [
        {
          name: 'user',
          description: 'discord user to send to',
          type: 'USER',
          required: false,
        },
      ],
    },
    {
      name: 'engineers-inara',
      description: 'Engineer List on Inara',
      type: 'SUB_COMMAND',
      options: [
        {
          name: 'user',
          description: 'discord user to send to',
          type: 'USER',
          required: false,
        },
      ],
    },
    {
      name: 'fsd-booster',
      description:
        "Link to Exegious' video on how to unlock the Guardian FSD Booster",
      type: 'SUB_COMMAND',
      options: [
        {
          name: 'user',
          description: 'discord user to send to',
          type: 'USER',
          required: false,
        },
      ],
    },
    {
      name: 'neutron',
      description: 'How to use Neutron Highway',
      type: 'SUB_COMMAND',
      options: [
        {
          name: 'option',
          description:
            "Choose what you'd like to know about the Neutron Highway",
          type: 'STRING',
          required: true,
          choices: [
            { value: 'img', name: 'Image Tutorial' },
            { value: 'spansh', name: "Spansh's Website" },
          ],
        },
        {
          name: 'user',
          description: 'discord user to send to',
          type: 'USER',
          required: false,
        },
      ],
    },
    {
      name: 'promotions',
      description: 'How do I get promoted?',
      type: 'SUB_COMMAND',
      options: [
        {
          name: 'user',
          description: 'discord user to send to',
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
    {
      name: 'scoopable',
      description: 'What stars can I scoop?',
      type: 'SUB_COMMAND',
      options: [
        {
          name: 'user',
          description: 'discord user to send to',
          type: 'USER',
          required: false,
        },
      ],
    },
    {
      name: 'websites',
      description: 'gives a list of 3rd party websites',
      type: 'SUB_COMMAND',
      options: [
        {
          name: 'user',
          description: 'discord user to send to',
          type: 'USER',
          required: false,
        },
      ],
    },
  ],
  execute: async (interaction) => {
    console.log(interaction.options);

    switch (interaction.options.getSubcommand()) {
      case 'combat-logging':
        await combatLogging(interaction);
        break;
      case 'engineers-fox':
        await engineersFox(interaction);
        break;
      case 'engineers-inara':
        await engineersInara(interaction);
        break;
      case 'fsd-booster':
        await fsdBooster(interaction);
        break;
      case 'neutron':
        await neutron(interaction);
        break;
      case 'promotions':
        await promotions(interaction);
        break;
      case 'ranks':
        await ranks(interaction);
        break;
      case 'scoopable':
        await scoopable(interaction);
        break;
      case 'websites':
        await websites(interaction);
        break;
      default:
        await interaction.editReply({
          content: 'Error in educational interaction',
        });
        break;
    }
  },
};
export default command;

const combatLogging = async (
  interaction: CommandInteraction
): Promise<void> => {
  const description =
    'Combat Logging is improperly exiting gameplay (via menu, alt+F4, pulling a plug, etc) while in combat.\n\n' +
    'FDev is very strict on this and it can result in a ban.\n\n' +
    "While FDev does not consider logging to menu as 'Combat Logging', the Elite: Dangerous community does.\n\n" +
    'Combat Logging is against the rules of USC and can result in a kick or ban.';
  const embed = new MessageEmbed()
    .setTitle('What is Combat Logging?')
    .setDescription(description);

  const user = interaction.options.getUser('user');
  if (user) {
    user.send({ embeds: [embed] });
    interaction.reply({ content: INFORMATION_SENT, ephemeral: true });
  } else await interaction.reply({ embeds: [embed] });
};

const engineersFox = async (interaction: CommandInteraction): Promise<void> => {
  const message =
    "Find Fox's Guide to unlocking engineers: https://www.reddit.com/r/EliteDangerous/comments/merpky/foxs_comprehensive_guide_to_engineer_unlocking/";

  const user = interaction.options.getUser('user');
  if (user) {
    await user.send(message);
    await interaction.reply({
      content: INFORMATION_SENT,
      ephemeral: true,
    });
  } else await interaction.reply(message);
};

const engineersInara = async (
  interaction: CommandInteraction
): Promise<void> => {
  const message =
    'Find where and what each engineer does at: https://inara.cz/galaxy-engineers/';

  const user = interaction.options.getUser('user');
  if (user) {
    await user.send(message);
    await interaction.reply({
      content: INFORMATION_SENT,
      ephemeral: true,
    });
  } else await interaction.reply(message);
};

const fsdBooster = async (interaction: CommandInteraction): Promise<void> => {
  const message =
    "Here's how to unlock the guardian fsd booster: https://youtu.be/J9C9a00-rkQ";

  const user = interaction.options.getUser('user');
  if (user) {
    await user.send(message);
    await interaction.reply({
      content: INFORMATION_SENT,
      ephemeral: true,
    });
  } else await interaction.reply(message);
};

const neutron = async (interaction: CommandInteraction): Promise<void> => {
  const option = interaction.options.getString('option', true);

  let message = '';
  switch (option) {
    case 'img':
      message = 'https://i.imgur.com/gg6n5VM.jpg';
      break;
    case 'spansh':
      message =
        'Plot neutron highway routes online here: https://www.spansh.co.uk/plotter';
      break;
    default:
      interaction.reply({
        content: `The ${option} does not exist.`,
        ephemeral: true,
      });
      return;
  }

  const user = interaction.options.getUser('user');
  if (user) {
    await user.send(message);
    await interaction.reply({ content: INFORMATION_SENT, ephemeral: true });
  } else await interaction.reply(message);
};

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
      content: INFORMATION_SENT,
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
      content: INFORMATION_SENT,
      ephemeral: true,
    });
  } else {
    await interaction.reply({ embeds: [rankEmbed] });
  }
};

const scoopable = async (interaction: CommandInteraction): Promise<void> => {
  const message =
    'Learn to filter the galaxy map for scoopable stars at: https://confluence.fuelrats.com/pages/releaseview.action?pageId=1507609\n\nOther languages available at: https://confluence.fuelrats.com/display/public/FRKB/KGBFOAM';

  const user = interaction.options.getUser('user');
  if (user) {
    await user.send(message);
    await interaction.reply({
      content: INFORMATION_SENT,
      ephemeral: true,
    });
  } else await interaction.reply(message);
};

const websites = async (interaction: CommandInteraction): Promise<void> => {
  const message =
    'Find mostly anything related to trading, combat and player stats at: https://inara.cz\nFind accurate trading data at: https://eddb.io\nFind accurate exploration data at: https://edsm.net\nBuild ships virtually and test their stats at: https://coriolis.io and https://edsy.org\nFind mining hotspots and sell locations at: https://edtools.cc/miner\nNeutron highway and road to riches at: https://spansh.co.uk\nUseful material finding, fleet carrier calculators, and more at: https://cmdrs-toolbox.com/\nNeed fuel? https://fuelrats.com';

  const user = interaction.options.getUser('user');
  if (user) {
    await user.send(message);
    await interaction.reply({
      content: INFORMATION_SENT,
      ephemeral: true,
    });
  } else await interaction.reply(message);
};
