const Discord = require('discord.js')

module.exports = {
    run: (member) => {
        if (member.user.bot) {
            return
        }
        
        client.inviteManager.update(member.guild)
    }
};