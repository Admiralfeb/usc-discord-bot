import {
  GuildMember,
  MessageActionRow,
  MessageButton,
  MessageEmbed,
  TextChannel,
} from 'discord.js';
import { setupMember } from '../functions/setupMember';
import { IBotEvent } from '../models/botEvent';
import { getJoinRequest } from '../utils/mongodb';

export const event: IBotEvent = {
  name: 'guildMemberAdd',
  once: false,
  needsClient: false,
  execute: async (member: GuildMember) => {
    console.log(member);
    const joiningChannel = member.guild.channels.cache.get(
      '708038933132476537'
    ) as TextChannel;
    const joinRequest = await getJoinRequest(member.user.tag);
    const roles = member.guild.roles.cache;
    const disassociateRole = roles.find(
      (role) => role.name === 'Dissociate Member'
    );
    const newRole = roles.find((role) => role.name === 'New Member');

    if (disassociateRole) member.roles.add(disassociateRole, 'auto-setup');
    if (newRole) member.roles.add(newRole, 'auto-setup');

    if (joinRequest) {
      await setupMember(member, joinRequest, joiningChannel);
    } else {
      await requestJoinRequest(member, joiningChannel);
    }
  },
};

const requestJoinRequest = async (
  member: GuildMember,
  joiningChannel: TextChannel
): Promise<void> => {
  const welcomeMessage = new MessageEmbed()
    .setTitle(
      '<:phoenixlogoplain:833150738413781062> Welcome to United Systems Cooperative'
    )
    .setDescription(
      'You have not yet put in a request on unitedsystems.org. As such, the USC Bot cannot perform automated setup.\n\n' +
        'Please click the button below to fill out the USC form.\n\n' +
        'If you have already filled out the form or need assistance, please contact someone in High Command'
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
  if (joiningChannel) {
    const embed = new MessageEmbed()
      .setTitle('Awaiting Join Request')
      .setDescription(
        `Awaiting join request from ${member} before performing auto-setup.`
      );
    await joiningChannel.send({ embeds: [embed] });
  }
};

export default event;
