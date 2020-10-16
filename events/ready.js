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

        client
            .users
            .cache
            .get(process.env.BOT_OWNER_ID)
            .send('Bot is ready :eyes:')
    }
};