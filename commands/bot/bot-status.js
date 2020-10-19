const mTxServCommand = require('../mTxServCommand.js');
const Discord = require('discord.js');
const { dependencies } = require('../../package.json');
const moment = require('moment');
require('moment-duration-format');

module.exports = class BotStatusCommand extends mTxServCommand {
    constructor(client) {
        super(client, {
            name: 'bot',
            aliases: ['bot-status', 'info', 'bot-info', 'bot', 'fork', 'forkme', 'bot-invite', 'invite'],
            group: 'bot',
            memberName: 'bot-info',
            description: 'Display bot infos.',
            guarded: true,
        });
    }

    async run(msg) {
        let language = this.resolveLangOfMessage(msg)
        const lang = require(`../../languages/${language}.json`)

        const memberTotal = this.client.guilds.cache.reduce((a, g) => a + g.memberCount, 0)

        if (msg.channel.type !== 'dm') {
            language = this.client.guildSettings.language(msg.guild.id)
        }

        const embed = new Discord.MessageEmbed()
            .setAuthor(`${this.client.user.tag}`, `${this.client.user.displayAvatarURL()}`, 'https://mtxserv.com')
            .setColor('BLUE')
            .addField(lang['fork_me']['configure'], lang['fork_me']['configure_explain'])
            .addField(lang['fork_me']['how'], lang['fork_me']['description'])
            .addField('❯ Home', `[mTxServ.com](https://mtxserv.com)`, true)
            .addField('❯ Discord', `[Join us](${this.client.options.invite})`, true)
            .addField('❯ Invite Bot', '[Invite the bot](https://discord.com/oauth2/authorize?client_id=535435520394657794&permissions=8&scope=bot)', true)
            .addField('❯ Source Code', '[mTxServ/ElDictator](https://github.com/mTxServ/ElDictator)', true)
            .addField('❯ Uptime', moment.duration(this.client.uptime).format('hh:mm:ss', { trim: false }), true)
            .addField('❯ Language', `:flag_${language == 'fr' ? language : 'us'}:`, true)
            .addField('❯ Memory Usage', `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`, true)
            .addField('❯ Servers Discord', this.formatNumber(this.client.guilds.cache.size), true)
            .addField('❯ Members Discord', this.formatNumber(memberTotal), true)
            .setFooter(`${this.formatNumber(this.client.registry.commands.size)} commands - by mTxServ.com`)
        ;

        if(this.parseDependencies().length < 1024) {
            embed.addField('❯ Dependencies', this.parseDependencies());
        } else {
            let dep = this.parseDependencies().split(', ');
            let first = [];
            let second = [];
            let count = 1;
            while(String(first).length < 1024 && dep.length !== 0) {
                if(String(first).length > 900) {
                    embed.addField(`❯ Dependencies (${count})`, first.join(', '));
                    second = first;
                    first = [];
                    count++;
                } else {
                    first.push(dep.shift())
                }
            }
            if(first !== second && first.length !== 0) embed.addField(`❯ Dependencies (${count})`, first.join(', '));
        }

        return msg.say({
            embed
        });
    }

    parseDependencies() {
        return Object.entries(dependencies).map(dep => {
            if (dep[1].startsWith('github:')) {
                const repo = dep[1].replace('github:', '').split('/');
                return `[${dep[0]}](https://github.com/${repo[0]}/${repo[1].replace(/#.+/, '')})`;
            }
            return `[${dep[0]}](https://npmjs.com/${dep[0]})`;
        }).join(', ');
    }
};