const mTxServCommand = require('../mTxServCommand.js');
const Discord = require('discord.js');
const { dependencies } = require('../../package.json');
const moment = require('moment');
require('moment-duration-format');

module.exports = class BotStatusCommand extends mTxServCommand {
    constructor(client) {
        super(client, {
            name: 'bot-info',
            aliases: ['bot-status'],
            group: 'bot',
            memberName: 'bot-info',
            description: 'Display bot infos.',
            guarded: true,
        });
    }

    async run(msg) {
        const embed = new Discord.MessageEmbed()
            .setColor("BLUE")
            .addField('❯ Commands', this.client.registry.commands.size, true)
            .addField('❯ Home', `[mTxServ.com](https://mtxserv.com)`, true)
            .addField('❯ Source Code', '[mTxServ/ElDictator](https://github.com/mTxServ/ElDictator)', true)
            .addField('❯ Memory Usage', `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`, true)
            .addField('❯ Uptime', moment.duration(this.client.uptime).format('hh:mm:ss', { trim: false }), true)
            .addField('❯ Node Version', process.version, true)
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