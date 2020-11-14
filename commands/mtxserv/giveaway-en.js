const mTxServCommand = require('../mTxServCommand.js');
const Discord = require('discord.js');

module.exports = class GiveawayEnCommand extends mTxServCommand {
    constructor(client) {
        super(client, {
            name: 'giveaway-en',
            group: 'mtxserv',
            memberName: 'giveaway-en',
            description: 'Show current giveaway (in english)',
            clientPermissions: ['SEND_MESSAGES'],
            ownerOnly: true,
            throttling: {
                usages: 2,
                duration: 5,
            },
        });
    }

    async run(msg) {
        const lang = require(`../../languages/${await this.resolveLangOfMessage(msg)}.json`);

        const prizes = [
            '1x [4GB SSD VPS](https://mtxserv.com/ssd-vps) - 1 month',
            '2x [Nitro Boost](https://discord.com)',
        ]

        const actions = [
            '> **+30 points**・Boost the mTxServ discord server',
            '> **+30 points**・Follow <#777240538910818324> on your discord server',
            '> **+10 points**・React to this message with :gift:',
        ]

        const reaction = ':alarm_clock:'
        const endDate = 'Nov 21, 2020 at 6 PM'

        const prizeLabel = prizes.map(prize => `> ❯ ${prize}`).join('\n')

        const embed = new Discord.MessageEmbed()
            .setTitle('GIVEAWAY')
            .setColor('YELLOW')
        ;
        
        if (this.client.isMainGuild(msg.guild.id) && this.client.isOwner(msg.author)) {
            embed.setDescription(`:four_leaf_clover: Pour participer, réagissez avec :gift: à ce message.\n\nTirage au sort le **${endDate}**\n\n:four_leaf_clover: **Participer et Augmenter ses chances** :four_leaf_clover:\n\n${actions.join('\n')}\n\n:gift_heart: **Lots** :gift_heart:\n\n${prizeLabel}`)

            const channel = await this.client.channels.cache.get('563304015924953108')

            const giveawayMsg = await msg.channel.send({
                    embed: embed,
           })

            msg.delete()
            giveawayMsg.react('🎁')
        }
    }
};
