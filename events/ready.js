const { zeneration_guild } = require("../config.json");
module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        console.log(`Ready! Logged in as ${client.user.tag}`);

        const commands = await client.guilds.cache.get(zeneration_guild)?.commands.set(client.commands);
    },
};
