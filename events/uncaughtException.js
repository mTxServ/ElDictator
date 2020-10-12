module.exports = {
    emitter: process,
    run: (error) => {
        if (!error) return;

        const errorMsg = (error ? error.stack || error : '').toString().replace(new RegExp(`${__dirname}\/`, 'g'), './');

        if (client.channels.has(process.env.LOG_CHANNEL_ID_DEV)) {
            client
                .channels
                .get(isDev ? process.env.LOG_CHANNEL_ID_DEV : process.env.LOG_CHANNEL_ID)
                .send(null, {
                    embed: {
                        color: 15684432,
                        timestamp: new Date(),
                        title: 'Uncaught Exception',
                        description: `\`\`\`x86asm\n${errorMsg.slice(0, 2048)}\n\`\`\``,
                        fields: [
                            {
                                name: 'Error Name:',
                                value: `\`${error.name || 'N/A'}\``
                            }, {
                                name: 'Error Message:',
                                value: `\`${error.message || 'N/A'}\``
                            }
                        ]
                    }
                })
                .catch(console.error);
        }
    }
};