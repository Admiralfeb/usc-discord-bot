import {
  ApplicationCommandOption,
  CommandInteraction,
  GuildMember,
} from 'discord.js';
import { AuthUser } from '../models/authUser';
import { BotCommand } from '../models/botCommand';
import { getValue, setValue } from '../utils/mongodb';

const checkAuth = (
  userId: string,
  authUsers: { id: string; name: string; discriminator: string }[]
): boolean => {
  if (authUsers) {
    const authed_user = authUsers.find((x) => x.id === userId.toString());
    if (authed_user) {
      return true;
    }
  }
  return false;
};

const name = 'admin';
const description = "Bot's admin functions";
const options: ApplicationCommandOption[] = [
  {
    name: 'auth_users',
    description: 'Controls the authorized admin users',
    type: 'SUB_COMMAND_GROUP',
    options: [
      {
        name: 'add',
        description: 'Add authorized admin user',
        type: 'SUB_COMMAND',
        options: [
          {
            name: 'user',
            description: 'User you wish to add.',
            type: 'USER',
            required: true,
          },
        ],
      },
      {
        name: 'delete',
        description: 'Delete authorized admin user',
        type: 'SUB_COMMAND',
        options: [
          {
            name: 'user',
            description: 'User you wish to delete.',
            type: 'USER',
            required: true,
          },
        ],
      },
      {
        name: 'list',
        description: 'List authorized admin users',
        type: 'SUB_COMMAND',
      },
    ],
  },
  {
    name: 'setup_member',
    description: 'Setup a new member',
    type: 'SUB_COMMAND',
    options: [
      {
        name: 'user',
        description: 'discord user to change',
        type: 'USER',
        required: true,
      },
      {
        name: 'name',
        description: 'name to change to - WITHOUT CMDR',
        type: 'STRING',
        required: true,
      },
      {
        name: 'platform',
        type: 'STRING',
        description: 'platform the user plays on',
        required: true,
        choices: [
          {
            name: 'PC',
            value: 'PC',
          },
          {
            name: 'Xbox One',
            value: 'Xbox',
          },
          {
            name: 'PlayStation 4',
            value: 'PS4',
          },
        ],
      },
    ],
  },
];
const execute = async (interaction: CommandInteraction): Promise<void> => {
  console.log(interaction.options);
  const userId = interaction.user.id;
  interaction.deferReply({ ephemeral: true });
  const authUsers = (await getValue('authorized_users')) as AuthUser[];

  if (checkAuth(userId, authUsers) === false) {
    await interaction.editReply({
      content: 'Unauthorized to use admin functions',
    });
    return;
  }

  if (interaction.options.getSubcommandGroup() === 'auth_users') {
    switch (interaction.options.getSubcommand()) {
      case 'add':
        await addAuthUser(interaction, authUsers);
        break;
      case 'delete':
        await deleteAuthUser(interaction, authUsers);
        break;
      case 'list':
        await listAuthUsers(interaction, authUsers);
        return;
      default:
        await interaction.editReply({
          content: 'Error in admin/auth_users interaction',
        });
        break;
    }
  } else if (interaction.options.getSubcommand() === 'setup_member') {
    await setupMember(interaction);
  } else {
    await interaction.editReply({
      content: 'Error in admin interaction',
    });
  }
};

export const command: BotCommand = { name, description, options, execute };
export default command;

const addAuthUser = async (
  interaction: CommandInteraction,
  authUsers: { id: string; name: string; discriminator: string }[]
): Promise<void> => {
  const addUser = interaction.options.getUser('user');
  if (addUser) {
    const new_user = {
      id: addUser.id.toString(),
      name: addUser.username,
      discriminator: addUser.discriminator,
    };
    if (authUsers.find((x) => x.id === addUser.id.toString())) {
      await interaction.editReply({
        content: `${addUser.username} is already an authorized user.`,
      });
      return;
    }
    const newUserList = [...authUsers, new_user];
    await setValue('authorized_users', newUserList);
    await interaction.editReply({
      content: `${addUser.username} added successfully.`,
    });
  }
};

const deleteAuthUser = async (
  interaction: CommandInteraction,
  authUsers: { id: string; name: string; discriminator: string }[]
): Promise<void> => {
  const deleteUser = interaction.options.getUser('user');
  if (deleteUser) {
    if (authUsers.length === 1) {
      await interaction.editReply({
        content: 'Unable to remove user as they are the last authorized user.',
      });
      return;
    }

    const index = authUsers.findIndex((x) => x.id === deleteUser.id.toString());
    authUsers.splice(index, 1);

    await setValue('authorized_users', authUsers);
    await interaction.editReply({
      content: `Removed ${deleteUser.username} from authorized users`,
    });
  }
};

const listAuthUsers = async (
  interaction: CommandInteraction,
  authUsers: { id: string; name: string; discriminator: string }[]
): Promise<void> => {
  let user_string = '';
  for (const u of authUsers) {
    user_string += `${u.name}#${u.discriminator}\n`;
  }
  await interaction.editReply({
    content: user_string,
  });
};

const setupMember = async (interaction: CommandInteraction): Promise<void> => {
  const user = interaction.options.getMember('user') as GuildMember;
  const nickname = interaction.options.getString('name');
  const platform = interaction.options.getString('platform');

  await user.setNickname(`CMDR ${nickname}`, 'Cmdr Setup');

  console.log({ user, nickname, platform });
};
