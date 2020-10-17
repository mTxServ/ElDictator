module.exports = {
    run: (error) => {
        if (!error) return;

        try {
            console.error(error.stack);

            if (client.channels.cache.has(process.env.LOG_CHANNEL_ID)) {
                client
                    .channels
                    .cache
                    .get(process.env.LOG_CHANNEL_ID)
                    .send(null, {
                        embed: {
                            color: 15684432,
                            timestamp: new Date(),
                            title: 'Error',
                            description: error.stack ? `\`\`\`x86asm\n${error.stack}\n\`\`\`` : `\`${error.toString()}\``
                        }
                    })
                ;
            }
        } catch (error) {
            return console.error(error.stack ? error.stack : error.toString());
        }
    }
};