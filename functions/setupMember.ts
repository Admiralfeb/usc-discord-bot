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
  const pcRole = roles.find((role) => role.id === '662768895643615252');
  const xbRole = roles.find((role) => role.id === '662769137721802773');
  const psRole = roles.find((role) => role.id === '662769168617177098');
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

  let failedPlatform = '';
  switch (platform) {
    case Platform.PC:
      if (pcRole) member.roles.add(pcRole, 'auto-setup');
      else failedPlatform = 'PC';
      break;
    case Platform.Xbox:
      if (xbRole) member.roles.add(xbRole, 'auto-setup');
      else failedPlatform = 'Xbox';
      break;
    case Platform.PS:
      if (psRole) member.roles.add(psRole, 'auto-setup');
      else failedPlatform = 'PS';
      break;
    default:
      failedPlatform = 'unknown';
  }

  if (newRole) member.roles.remove(newRole, 'auto-setup complete');

  if (joiningChannel) {
    let message = new MessageEmbed()
      .setTitle('Automated Setup Complete')
      .setDescription(
        `Automated setup complete for ${member}\n\n` +
          'Final manual verification needed. `/admin setup_member finalize` will remove dissociate and add Fleet Member if applicable.'
      );
    if (failedPlatform)
      message = message.addField(
        'Platform',
        `Failed adding platform role. Please add it when setting up the user. Platform: ${failedPlatform}`
      );
    await joiningChannel.send({ embeds: [message] });
  }
};
