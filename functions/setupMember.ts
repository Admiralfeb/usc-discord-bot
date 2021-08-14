import { GuildMember, MessageEmbed, TextChannel } from 'discord.js';
import { JoinRequest } from '../models/joinRequest';

/**
 * Sets up a member in the server.
 * @param member
 * @param joinRequest
 * @param joiningChannel
 */
export const setupMember = async (
  member: GuildMember,
  joinRequest: JoinRequest,
  joiningChannel?: TextChannel
): Promise<void> => {
  const roles = member.guild.roles.cache;
  const pcRole = roles.find((role) => role.name === 'PC');
  const xbRole = roles.find((role) => role.name === 'Xbox');
  const psRole = roles.find((role) => role.name === 'Playstation');
  const memberRole = roles.find((role) => role.name === 'Cadet');
  const ambassadorRole = roles.find((role) => role.name === 'Ambassador');
  const guestRole = roles.find((role) => role.name === 'Guest');
  const newRole = roles.find((role) => role.name === 'New Member');

  const cmdrName = joinRequest.cmdr;
  const platforms = joinRequest.platforms;
  const type = joinRequest.type;

  member.setNickname(cmdrName, 'auto-setup');

  switch (type) {
    case 'join':
      if (memberRole) member.roles.add(memberRole, 'auto-setup');
      break;
    case 'guest':
      if (guestRole) member.roles.add(guestRole, 'auto-setup');
      break;
    case 'ambassador':
      if (ambassadorRole) member.roles.add(ambassadorRole, 'auto-setup');
      break;
    default:
      break;
  }

  if (pcRole && platforms.pc === true) member.roles.add(pcRole, 'auto-setup');
  if (xbRole && platforms.xbox === true) member.roles.add(xbRole, 'auto-setup');
  if (psRole && platforms.ps === true) member.roles.add(psRole, 'auto-setup');

  if (newRole) member.roles.remove(newRole, 'auto-setup complete');

  if (joiningChannel) {
    const message = new MessageEmbed()
      .setTitle('Automated Setup Complete')
      .setDescription(
        `Automated setup complete for ${member}\n\n` +
          'Final manual verification needed. `/admin setup_member finalize` will remove dissociate and add Fleet Member if applicable.'
      );
    joiningChannel.send({ embeds: [message] });
  }
};
