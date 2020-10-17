const Discord = require('discord.js')

module.exports = {
    run: () => {
        console.log(`Logged in as ${client.user.tag}! (${client.user.id})`);

        console.log('Warmup feed monitor')
        client.feedMonitor.warmup()
        client.statusUpdater.updateStatus()

        client.setInterval(() => bot.emit('updateStatus'), 10 * 10000)

        client.setInterval(async () => {
            console.log('up')
            try {
                client.statusUpdater.updateStatus()
                await client.feedMonitor.process()
            } catch (err) {
                console.error(err);
            }
        }, 1000 * 60 * 10);

        const embed = new Discord.MessageEmbed()
            .setAuthor(`${client.user.tag}`, `${client.user.displayAvatarURL()}`)
            .setColor('GREEN')
            .setTitle(':green_circle: Bot is online')
            .setTimestamp();

        client
            .channels.cache.get(process.env.LOG_CHANNEL_ID)
            .send({
                embed: embed
            })
    }
};