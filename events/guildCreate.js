const GuildBotAdded = require('../handler/GuildBotAdded')

module.exports = {
    run: (guild) => {
        console.log(`Join the guild ${guild.name} #${guild.id}`)

        GuildBotAdded.handleEvent(guild)
    }
};
