module.exports = {
  name: 'heresy',
  description: 'Stop your heresy',
  async execute(interaction) {
    await interaction.reply(
      'https://tenor.com/view/cease-your-heresy-warhammer-40k-gif-19005947'
    );
  },
};
