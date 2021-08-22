import { IBotCommand } from '../models/botCommand';
import { setEmail } from '../utils/mongodb';

export const command: IBotCommand = {
  name: 'set-email',
  description:
    'Sets your email in the CMDR system to allow you to log into the USC Website',
  options: [
    {
      name: 'email',
      description: 'Email to add to your CMDR entry',
      type: 'STRING',
      required: true,
    },
  ],
  execute: async (interaction) => {
    await interaction.deferReply({ ephemeral: true });
    const email = interaction.options.getString('email', true);
    const tag = interaction.user.tag;

    try {
      await setEmail(tag, email);
      await interaction.editReply({ content: 'Your email has been set.' });
    } catch (e) {
      if (e.message === 'Cmdr not found')
        await interaction.editReply({
          content:
            'Discord tag not found in CMDR system. Please contact Command to verify that your Discord tag is entered correctly.',
        });
      else await interaction.editReply({ content: e.message });
    }
  },
};
