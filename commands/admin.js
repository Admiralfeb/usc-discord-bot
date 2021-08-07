/* eslint-disable no-case-declarations */
const { getValue, setValue } = require('../utils/mongodb');

const checkAuth = (userId, authUsers) => {
  if (authUsers) {
    const authed_user = authUsers.find((x) => x.id === userId.toString());
    if (authed_user) {
      return true;
    }
  }
  return false;
};

module.exports = {
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
  ],
  async execute(interaction) {
    console.log(interaction.options);
    const userId = interaction.user.id;
    interaction.deferReply({ ephemeral: true });
    const authUsers = await getValue('authorized_users');

    if (checkAuth(userId, authUsers) === false) {
      await interaction.editReply({
        content: 'Unauthorized to use admin functions',
        ephemeral: true,
      });
      return;
    }

    if (interaction.options._group === 'auth_users') {
      switch (interaction.options._subcommand) {
        case 'add':
          const addUser = interaction.options.getUser('user');
          const new_user = {
            id: addUser.id.toString(),
            name: addUser.username,
            discriminator: addUser.discriminator,
          };
          if (authUsers.find((x) => x.id === addUser.id.toString())) {
            await interaction.editReply({
              content: `${addUser.username} is already an authorized user.`,
              ephemeral: true,
            });
            return;
          }
          const newUserList = [...authUsers, new_user];
          await setValue('authorized_users', newUserList);
          await interaction.editReply({
            content: `${addUser.username} added successfully.`,
            ephemeral: true,
          });
          break;
        case 'delete':
          const deleteUser = interaction.options.getUser('user');
          if (authUsers.length === 1) {
            await interaction.editReply({
              content:
                'Unable to remove user as they are the last authorized user.',
              ephemeral: true,
            });
            return;
          }

          const index = authUsers.findIndex(
            (x) => x.id === deleteUser.id.toString()
          );
          authUsers.splice(index, 1);

          await setValue('authorized_users', authUsers);
          await interaction.editReply({
            content: `Removed ${deleteUser.username} from authorized users`,
            ephemeral: true,
          });
          break;
        case 'list':
          let user_string = '';
          for (const u of authUsers) {
            user_string += `${u.name}#${u.discriminator}\n`;
          }
          await interaction.editReply({
            content: user_string,
            ephemeral: true,
          });
          return;
        default:
          await interaction.editReply({
            content: 'Error in admin/auth_users interaction',
            ephemeral: true,
          });
          break;
      }
    } else if (interaction.options._subcommand === 'setup_member') {
      const user = interaction.options.getUser('user');
      const nickname = interaction.options.getString('name');
      const platform = interaction.options.getString('platform');
      console.log({ user, nickname, platform });
    } else {
      await interaction.editReply({
        content: 'Error in admin interaction',
        ephemeral: true,
      });
    }
  },
};
