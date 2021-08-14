import { Message, TextChannel } from 'discord.js';
import { setupMember } from '../functions/setupMember';
import { IBotEvent } from '../models/botEvent';
import { getJoinRequest } from '../utils/mongodb';

export const event: IBotEvent = {
  name: 'messageCreate',
  once: false,
  needsClient: false,
  execute: async (message: Message) => {
    if (message.channelId === '708038933132476537') {
      const webhook = await message.fetchWebhook();
      if (webhook) {
        if (webhook.name === 'Application System') {
          const text = message.embeds[0].description ?? '';
          const index = text.indexOf('has');
          const userName = text.slice(0, index);
          if (userName) {
            const member = message.guild?.members.cache.find(
              (x) => x.user.tag.toLowerCase() === userName.trim().toLowerCase()
            );
            if (member) {
              const joiningChannel = member.guild.channels.cache.get(
                '708038933132476537'
              ) as TextChannel;
              const joinRequest = await getJoinRequest(member.user.tag);

              if (joinRequest) {
                await setupMember(member, joinRequest, joiningChannel);
              }
            }
          }
        }
      }
    }
  },
};

export default event;
