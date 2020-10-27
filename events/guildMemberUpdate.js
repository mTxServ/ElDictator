const Discord = require('discord.js')

module.exports = {
    run: (oldmember, newmember) => {
        if (client.isMainGuild(newmember.guild.id)
            && null === oldmember.premiumSince
            && null !== newmember.premiumSince) {

            console.log(`${newmember.username} boosted ${newmember.guild.name}`)

            client.provider.set(isDev ? 'giveaway_boost_dev' : 'giveaway_boost_msg', newmember.id, newmember.premiumSinceTimestamp)
        }
    }
};