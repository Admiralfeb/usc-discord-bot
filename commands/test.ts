import { TextChannel } from 'discord.js';
import { setupMember } from '../functions/setupMember';
import { IBotCommand } from '../models/botCommand';
import { getJoinRequest } from '../utils/mongodb';
export const command: IBotCommand = {
  name: 'test',
  description: `Test Commands. Only available to Admiralfeb`,
  options: [
    {
      name: 'join-request',
      description: 'Tests the Join Request Event',
      type: 'SUB_COMMAND',
      options: [
        {
          name: 'messageid',
          description: 'id of message',
          type: 'STRING',
          required: true,
        },
      ],
    },
  ],
  execute: async (interaction) => {
    await interaction.deferReply({ ephemeral: true });
    const messageID = interaction.options.getString('messageid', true);
    const message = await interaction.channel?.messages.fetch(messageID);
    if (message) {
      console.log({ message });

      const text = message.embeds[0].description ?? '';
      const index = text.indexOf('has');
      const userName = text.slice(0, index).replace(/\*/g, '').trim();
      if (userName) {
        console.log({ userName });
        // const guild = await message.guild?.fetch();
        const guild = interaction.guild;
        console.log({ guild });
        if (guild) {
          const members = await guild.members.fetch();
          for (const m of members) {
            const tag = m[1].user.tag;
            const name = m[1].displayName;
            const nick = m[1].nickname;
            console.log({ tag, name, nick });
          }
          const member = members.find(
            (x) => x.user.tag.toLowerCase() === userName.toLowerCase()
          );
          console.log({ member });
          if (member) {
            const joiningChannel = guild.channels.cache.get(
              '708038933132476537'
            ) as TextChannel;
            const joinRequest = await getJoinRequest(member.user.tag);
            console.log({ joinRequest });

            if (joinRequest) {
              await setupMember(member, joinRequest, joiningChannel);
            }
          }
        }
      }
    }
  },
};
export default command;
