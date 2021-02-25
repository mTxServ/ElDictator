const Discord = require('discord.js')

module.exports = {
    run: () => {
        console.log(`Logged in as ${client.user.tag}! (${client.user.id})`);

        client.feedMonitor.warmup()
        //client.inviteManager.warmup()
        client.statusUpdater.updateStatus()

        client.setInterval(() => client.statusUpdater.updateStatus(), 1000 * 60)

        client.setInterval(async () => {
            try {
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

        console.log(`${client.user.tag} is ready!`);
    }
};