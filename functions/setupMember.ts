import { GuildMember, MessageEmbed, TextChannel } from 'discord.js';
import { JoinRequest, Platform } from '../models/joinRequest';

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
  const roles = await member.guild.roles.fetch();
  const pcRole = roles.find((role) => role.name === 'PC');
  const xbRole = roles.find((role) => role.name === 'Xbox');
  const psRole = roles.find((role) => role.name === 'Playstation');
  const memberRole = roles.find((role) => role.name === 'Cadet');
  const ambassadorRole = roles.find((role) => role.name === 'Ambassador');
  const guestRole = roles.find((role) => role.name === 'Guest');
  const newRole = roles.find((role) => role.name === 'New Member');

  const cmdrName = joinRequest.cmdr;
  const platform = joinRequest.platform;
  const type = joinRequest.type;

  member.setNickname(`CMDR ${cmdrName}`, 'auto-setup');

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

  if (pcRole && xbRole && psRole) {
    switch (platform) {
      case Platform.PC:
        member.roles.add(pcRole, 'auto-setup');
        break;
      case Platform.Xbox:
        member.roles.add(xbRole, 'auto-setup');
        break;
      case Platform.PS:
        member.roles.add(psRole, 'auto-setup');
        break;
    }
  }

  if (newRole) member.roles.remove(newRole, 'auto-setup complete');

  if (joiningChannel) {
    const message = new MessageEmbed()
      .setTitle('Automated Setup Complete')
      .setDescription(
        `Automated setup complete for ${member}\n\n` +
          'Final manual verification needed. `/admin setup_member finalize` will remove dissociate and add Fleet Member if applicable.'
      );
    await joiningChannel.send({ embeds: [message] });
  }
};
