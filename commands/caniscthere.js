const { MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
  name: 'caniscthere',
  description: 'Can I supercruise there?',
  async execute(interaction) {
    const row = new MessageActionRow().addComponents(
      new MessageButton()
        .setStyle('LINK')
        .setLabel('Click Me to find out if you can supercruise there.')
        .setURL('http://caniflytothenextstarinelitedangero.us/')
    );
    await interaction.reply({
      content: 'Click the button below.',
      components: [row],
    });
  },
};
