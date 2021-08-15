import {
  Collection,
  CommandInteraction,
  GuildMember,
  Message,
  MessageEmbed,
  Role,
  TextChannel,
} from 'discord.js';
import { IAuthUser } from '../models/authUser';
import { IBotCommand } from '../models/botCommand';
import { getValue, setValue } from '../utils/mongodb';

export const command: IBotCommand = {
  name: 'admin',
  description: "Bot's admin functions",
  options: [
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
      type: 'SUB_COMMAND_GROUP',
      options: [
        {
          name: 'finalize',
          description: 'Finalize user after Bot has started process',
          type: 'SUB_COMMAND',
          options: [
            {
              name: 'user',
              description: 'discord user to change',
              type: 'USER',
              required: true,
            },
          ],
        },
        {
          name: 'manual',
          description: 'Setup a new user manually',
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
              name: 'type',
              type: 'STRING',
              description: 'What type of user?',
              required: true,
              choices: [
                {
                  name: 'Fleet Member',
                  value: 'Fleet Member',
                },
                {
                  name: 'Ambassador',
                  value: 'Ambassador',
                },
                {
                  name: 'Guest',
                  value: 'Guest',
                },
              ],
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
      ],
    },
    {
      name: 'gankers',
      description: 'controls the ganker listing',
      type: 'SUB_COMMAND_GROUP',
      options: [
        {
          name: 'add',
          description: 'Add a ganker to the list',
          type: 'SUB_COMMAND',
          options: [
            {
              name: 'cmdr-name',
              description: 'Name of ganker to add',
              type: 'STRING',
              required: true,
            },
          ],
        },
        {
          name: 'remove',
          description: 'remove a ganker to the list',
          type: 'SUB_COMMAND',
          options: [
            {
              name: 'cmdr-name',
              description: 'Name of ganker to remove',
              type: 'STRING',
              required: true,
            },
          ],
        },
        {
          name: 'update',
          description: 'Updates the ganker list from the database',
          type: 'SUB_COMMAND',
        },
      ],
    },
  ],
  defaultPermission: false,
  permissions: [{ id: '708389814453665852', type: 'ROLE', permission: true }],
  execute: async (interaction) => {
    console.log(interaction.options);
    const userId = interaction.user.id;
    interaction.deferReply({ ephemeral: true });
    const authUsers = (await getValue('authorized_users')) as IAuthUser[];

    if (checkAuth(userId, authUsers) === false) {
      await interaction.editReply({
        content: 'Unauthorized to use admin functions',
      });
      return;
    }

    switch (interaction.options.getSubcommandGroup()) {
      case 'auth_users':
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
        break;
      case 'setup_member':
        switch (interaction.options.getSubcommand()) {
          case 'finalize':
            await finalizeMember(interaction);
            break;
          case 'manual':
            await setupMember(interaction);
            break;
          default:
            await interaction.editReply({
              content: 'Error in admin/setup_member interaction',
            });
            break;
        }
        break;
      case 'gankers':
        switch (interaction.options.getSubcommand()) {
          case 'add':
            await addGanker(interaction);
            break;
          case 'remove':
            await removeGanker(interaction);
            break;
          case 'update':
            await updateGankers(interaction);
            break;
          default:
            await interaction.editReply({
              content: 'Error in ganker interaction',
            });
            break;
        }
        break;
      default:
        await interaction.editReply({
          content: 'Error in admin interaction',
        });
        break;
    }
  },
};
export default command;

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

const finalizeMember = async (
  interaction: CommandInteraction
): Promise<void> => {
  try {
    const user = interaction.options.getMember('user', true) as GuildMember;
    const isCadet = user.roles.cache.some((x) => x.name === 'Cadet');

    const roles = await interaction.guild?.roles.fetch();
    if (roles) {
      if (isCadet) {
        const fleetMemberRole = roles.find(
          (role) => role.name === 'Fleet Member'
        );
        if (fleetMemberRole)
          await user.roles.add(fleetMemberRole, 'finalize member');
      }

      const disassociateRole = roles.find(
        (role) => role.name === 'Dissociate Member'
      );
      const newRole = roles.find((role) => role.name === 'New Member');

      if (disassociateRole)
        await user.roles.remove(disassociateRole, 'finalize member');
      if (newRole) await user.roles.remove(newRole, 'finalize member');
    }
    await interaction.editReply({
      content: `${user.displayName}'s setup has been finalized.`,
    });
  } catch (e) {
    console.error(e.message);
    await interaction.editReply({
      content: 'There was an issue finalizing the member.',
    });
  }
};

const setupMember = async (interaction: CommandInteraction): Promise<void> => {
  const user = interaction.options.getMember('user', true) as GuildMember;
  const nickname = interaction.options.getString('name', true);
  const platform = interaction.options.getString('platform', true);
  const type = interaction.options.getString('type', true);
  console.log({ user, nickname, platform });

  // set nickname
  await user.setNickname(`CMDR ${nickname}`, 'Cmdr Setup');

  // set roles
  const roles = await interaction.guild?.roles.fetch();
  if (roles) {
    const dissociateRole = roles.find((x) => x.name === 'Dissociate Member');
    try {
      switch (type) {
        case 'Fleet Member':
          await setRole(user, roles, 'Fleet Member');
          await setRole(user, roles, 'Cadet');
          break;
        case 'Ambassador':
          await setRole(user, roles, 'Ambassador');
          break;
        case 'Guest':
          await setRole(user, roles, 'Guest');
          break;
        default:
          throw new Error('Improper member type');
      }
      if (dissociateRole) await user.roles.remove(dissociateRole);
    } catch (e) {
      if (e.message) {
        await interaction.editReply({ content: `Error: ${e.message}` });
      }
    }
  }
  await interaction.editReply({
    content: 'User setup complete.',
  });
};

const setRole = async (
  member: GuildMember,
  collection: Collection<string, Role>,
  roleName: string
): Promise<void> => {
  const role = collection.find((x) => x.name === roleName);
  if (role) await member.roles.add(role);
  else throw new Error('Role not found');
};

const addGanker = async (interaction: CommandInteraction): Promise<void> => {
  const newGanker = interaction.options.getString('cmdr-name', true);
  const gankers = (await getValue<string[]>('gankers')) ?? [];

  const foundGanker = gankers.find(
    (x) => x.toLowerCase() === newGanker.toLowerCase()
  );
  if (foundGanker) {
    await interaction.editReply({ content: 'Ganker is already in list' });
    return;
  }

  const newGankers = [...gankers, newGanker];
  await setValue('gankers', newGankers);

  const embed = generateGankerEmbed(newGankers);
  const message = await getBaseGankMessage(interaction);
  if (message) {
    await message.edit({ embeds: [embed] });
  } else {
    await interaction.editReply({
      content: 'Ganker list was updated, but the message could not be edited.',
    });
    return;
  }

  await interaction.editReply({ content: 'Successfully updated ganker list' });
};
const removeGanker = async (interaction: CommandInteraction): Promise<void> => {
  const newGanker = interaction.options.getString('cmdr-name', true);
  const gankers = (await getValue<string[]>('gankers')) ?? [];

  const foundGanker = gankers.find(
    (x) => x.toLowerCase() === newGanker.toLowerCase()
  );
  if (!foundGanker) {
    await interaction.editReply({
      content: 'Ganker list unchanged. Unable to find ganker in list.',
    });
    return;
  }

  const index = gankers.indexOf(foundGanker);
  const newGankers = [...gankers.slice(0, index), ...gankers.slice(index + 1)];

  await setValue('gankers', newGankers);

  const embed = generateGankerEmbed(newGankers);
  const message = await getBaseGankMessage(interaction);
  if (message) {
    await message.edit({ embeds: [embed] });
  } else {
    await interaction.editReply({
      content: 'Ganker list was updated, but the message could not be edited.',
    });
    return;
  }

  await interaction.editReply({
    content: 'Successfully updated ganker list',
  });
};
const updateGankers = async (
  interaction: CommandInteraction
): Promise<void> => {
  const gankers = (await getValue<string[]>('gankers')) ?? [];
  const embed = generateGankerEmbed(gankers);
  const message = await getBaseGankMessage(interaction);

  if (message) {
    await message.edit({ embeds: [embed] });
    await interaction.editReply({
      content: 'Successfully updated ganker list',
    });
  } else {
    await interaction.editReply({
      content: 'Message not found. Unable to update list',
    });
  }
};
const getBaseGankMessage = async (
  interaction: CommandInteraction
): Promise<Message | undefined> => {
  const channelId = await getValue<string>('gank_report_channel');
  console.log({ channelId });
  const messageId = await getValue<string>('gank_report_message');
  console.log({ messageId });
  const channel = (await interaction.client.channels.fetch(
    channelId
  )) as TextChannel;
  console.log({ channel });
  if (channel) {
    const message = await channel.messages.fetch(messageId);
    console.log({ message });
    return message;
  }
};
const generateGankerEmbed = (gankers: string[]): MessageEmbed => {
  const reversed = gankers.reverse();
  const str = reversed.join('\n');
  const embed = new MessageEmbed()
    .setTitle('Known Gankers')
    .setDescription(str);
  return embed;
};
