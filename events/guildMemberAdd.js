const Discord = require('discord.js')

module.exports = {
    run: (member) => {
        if (member.guild) {
            client.inviteManager.update(member.guild)
        }
    }
};