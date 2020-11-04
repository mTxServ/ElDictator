const mTxServCommand = require('../mTxServCommand.js');
const Discord = require('discord.js')

module.exports = class BotStopCommand extends mTxServCommand {
    constructor(client) {
        super(client, {
            name: 'roles',
            group: 'admin',
            memberName: 'roles',
            description: 'Show roles stats.',
            clientPermissions: ['SEND_MESSAGES'],
            ownerOnly: true,
            hidden: true,
            guarded: true
        });
    }

    async run(msg) {
        const embed = new Discord.MessageEmbed()
            .setAuthor(`${this.client.user.tag}`, `${this.client.user.displayAvatarURL()}`)
            .setColor('RED')
            .setTimestamp();

        msg.guild.roles.cache.map(role => {
            embed.addField(role.name, role.members.size, true)
        })

        return msg.say({
            embed
        })
    }
};