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
            .setColor('BLUE')
            .setTimestamp();

        const all = (await msg.guild.members.fetch())

        msg.guild.roles.cache.map(async role => {
            const count = all
                .filter(m =>
                    m.roles.cache.has(role.id)
                ).size

            embed.addField(role.name.replace("@everyone", "ALL"), count, true)
        })

        return msg.say({
            embed
        })
    }
};