import { GuildMember, MessageEmbed, TextChannel } from 'discord.js';
import { IBotEvent } from '../models/botEvent';

export const event: IBotEvent = {
  name: 'guildMemberRemove',
  once: false,
  needsClient: false,
  execute: async (member: GuildMember) => {
    const roles = member.roles.cache.reduce((acc, val) => acc + ` ${val}`, '');

    const embed = new MessageEmbed()
      .setTitle('Member Left')
      .setDescription(`${member} ${member.user.tag}`)
      .addField('Roles', roles)
      .setFooter(member.id)
      .setTimestamp();
    const joiningChannel = member.guild.channels.cache.get(
      '708038933132476537'
    ) as TextChannel;
    if (joiningChannel) {
      await joiningChannel.send({ embeds: [embed] });
    }
  },
};
