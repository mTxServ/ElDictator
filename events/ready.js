module.exports = {
    run: () => {
        console.log(`Logged in as ${client.user.tag}! (${client.user.id})`);

        client
            .users
            .cache
            .get(process.env.BOT_OWNER_ID)
            .send('Bot is ready :eyes:')
    }
};