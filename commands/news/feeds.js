const mTxServCommand = require('../mTxServCommand.js');
const Discord = require('discord.js');
const { dependencies } = require('../../package.json');
const moment = require('moment');
require('moment-duration-format');

module.exports = class FeedCommand extends mTxServCommand {
    constructor(client) {
        super(client, {
            name: 'feeds',
            aliases: ['feed'],
            group: 'news',
            memberName: 'feeds',
            description: 'Display feeds list.',
            guarded: true,
            guildOnly: true,
        });
    }

    async run(msg) {
        const lang = require(`../../languages/${this.resolveLangOfMessage(msg)}.json`)

        const embed = new Discord.MessageEmbed()
            .setAuthor(lang['feeds']['title'])
            .setColor('BLUE')
            .setDescription(lang['feeds']['description'])
            .addField('❯ Minecraft', this.client.guildSettings.hasSubscribeToTag('minecraft') ? lang['feeds']['follow'] : lang['feeds']['unfollow'], true)
            .addField('❯ GMod', this.client.guildSettings.hasSubscribeToTag('gmod') ? lang['feeds']['follow'] : lang['feeds']['unfollow'], true)
            .addField('❯ Rust', this.client.guildSettings.hasSubscribeToTag('rust') ? lang['feeds']['follow'] : lang['feeds']['unfollow'], true)
            .addField('❯ ARK', this.client.guildSettings.hasSubscribeToTag('ark') ? lang['feeds']['follow'] : lang['feeds']['unfollow'], true)
            .addField('❯ S&Box', this.client.guildSettings.hasSubscribeToTag('sandbox') ? lang['feeds']['follow'] : lang['feeds']['unfollow'], true)
        ;

        return msg.say({
            embed
        });
    }
};