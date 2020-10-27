const Discord = require('discord.js')

module.exports = {
    run: (guild) => {

        console.log(`Join the guild ${guild.name} #${guild.id}`)

        const embed = new Discord.MessageEmbed()
            .setAuthor(`${client.user.tag}`, `${client.user.displayAvatarURL()}`, 'https://mtxserv.com')
            .setColor('BLUE')
            .setDescription(`Thanks for adding me, i successfully joined your server \`${guild.name}\`. To see all commands, use \`m!help\`.\n\nSet the main language for your server with \`m!bot-lang en\` or \`m!bot-lang fr\` in a channel.\n\n**__Game Server Status__**\nTo enable the command \`m!servers\` on your discord server, use \`m!add-server\` to configure it, in a channel.\n\n**__Follow your favorites games__**\nThe bot can post new articles in english or/and french, about your favorites games, in a specified channel. To configure it, use \`m!feeds\` in a channel.`)
        ;

        guild
            .ownerID
            .send({
                embed: embed
            })
            .catch(console.error)

        if (client.channels.cache.has(process.env.LOG_CHANNEL_ID)) {
            client
                .channels
                .cache
                .get(process.env.LOG_CHANNEL_ID)
                .send(null, {
                    embed: {
                        color: "BLUE",
                        timestamp: new Date(),
                        title: `Join a new guild`,
                        description: `Bot is on a new guild **\`${guild.name.replace('`', '\`')}\`**`,
                        fields: [
                            {
                                name: 'Owner',
                                value: guild.owner.user.tag,
                                inline: true
                            },
                            {
                                name: 'Guild ID',
                                value: `\`${guild.id}\``,
                                inline: true
                            },
                            {
                                name: 'Members',
                                value: `\`${guild.memberCount}\``,
                                inline: true
                            }
                        ]
                    }
                })
                .catch(console.error);
        }
    }
};