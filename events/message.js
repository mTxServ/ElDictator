const Discord = require('discord.js')

module.exports = {
    run: async (msg) => {
        if (msg.author.bot) return;
        if (msg.channel.type !== 'text') return;

        // share/img channels
        if (msg.channel.id === process.env.SHARE_CHANNEL_ID_FR
            || msg.channel.id === process.env.SHARE_CHANNEL_ID_EN) {

            msg.react('👍');
            msg.react('👎');
            msg.react('🤷');
        }
    }
};