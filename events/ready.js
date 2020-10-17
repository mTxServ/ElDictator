const Discord = require('discord.js')

module.exports = {
    run: () => {
        console.log(`Logged in as ${client.user.tag}! (${client.user.id})`);

        console.log('Warmup feed monitor')
        client.feedMonitor.warmup()

        client.setInterval(async () => {
            try {
                await client.feedMonitor.process()
            } catch (err) {
                console.error(err);
            }
        }, 1000 * 60 * 15);

        const embed = new Discord.MessageEmbed()
            .setAuthor(`${client.user.tag}`, `${client.user.displayAvatarURL()}`)
            .setColor('GREEN')
            .setDescription(':green_circle: Bot is online')
            .setTimestamp();

        client
            .channels.cache.get(process.env.LOG_CHANNEL_ID)
            .send({
                embed: embed
            })
    }
};