/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  ClientEvents,
  GuildMember,
  MessageActionRow,
  MessageButton,
  MessageEmbed,
} from 'discord.js';
import { zeneration_guild } from '../config';
import { BotClient } from '../models/botClient';
import { getJoinRequest } from '../utils/mongodb';

const name: keyof ClientEvents = 'guildMemberAdd';
const once = false;
const execute = async (member: GuildMember, bot: BotClient): Promise<void> => {
  console.log(member);
  const client = bot.client;
  const roles = await client.guilds.cache.get(zeneration_guild)?.roles.fetch();
  const pcRole = roles?.find((role) => role.name === 'PC');
  const xbRole = roles?.find((role) => role.name === 'Xbox');
  const psRole = roles?.find((role) => role.name === 'Playstation');
  const memberRole = roles?.find((role) => role.name === 'Cadet');
  const ambassadorRole = roles?.find((role) => role.name === 'Ambassador');
  const guestRole = roles?.find((role) => role.name === 'Guest');

  const disassociateRole = roles?.find(
    (role) => role.name === 'Disassociate Member'
  );
  member.roles.add(disassociateRole!, 'auto-setup');

  const joinRequest = await getJoinRequest(member.user.tag);
  if (joinRequest) {
    const cmdrName = joinRequest.cmdr;
    const platforms = joinRequest.platforms;
    const type = joinRequest.type;

    member.setNickname(cmdrName, 'auto-setup');

    switch (type) {
      case 'join':
        member.roles.add(memberRole!, 'auto-setup');
        break;
      case 'guest':
        member.roles.add(guestRole!, 'auto-setup');
        break;
      case 'ambassador':
        member.roles.add(ambassadorRole!, 'auto-setup');
        break;
      default:
        break;
    }

    if (platforms.pc === true) member.roles.add(pcRole!, 'auto-setup');
    if (platforms.xbox === true) member.roles.add(xbRole!, 'auto-setup');
    if (platforms.ps === true) member.roles.add(psRole!, 'auto-setup');
  } else {
    const welcomeMessage = new MessageEmbed()
      .setTitle(
        '<:phoenixlogoplain:833150738413781062> Welcome to United Systems Cooperative'
      )
      .setDescription(
        'You have not yet put in a request on unitedsystems.org. As such, the USC Bot cannot perform automated setup.\n\n' +
          'Please click the button below to fill out the USC form.\n\n' +
          'If you have already filled out the form or need assistance, please contact <@&708389814453665852>'
      );

    const joinRow = new MessageActionRow().addComponents(
      new MessageButton()
        .setLabel('Fill out Join Form')
        .setStyle('LINK')
        .setURL('https://unitedsystems.org/join')
    );

    await member.send({
      embeds: [welcomeMessage],
      components: [joinRow],
    });
  }
};

export const event = { name, once, execute };
export default event;
