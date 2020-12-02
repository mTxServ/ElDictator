const mTxServCommand = require('../mTxServCommand.js');
const Discord = require('discord.js');

module.exports = class GiveawayCommand extends mTxServCommand {
    constructor(client) {
        super(client, {
            name: 'giveaway',
            aliases: ['concour', 'concours'],
            group: 'mtxserv',
            memberName: 'giveaway',
            description: 'Show current giveaway',
            clientPermissions: ['SEND_MESSAGES'],
            throttling: {
                usages: 2,
                duration: 5,
            },
        });
    }

    async run(msg) {
        const lang = require(`../../languages/${await this.resolveLangOfMessage(msg)}.json`);

        const prizes = [
            '1x [VPS SSD 4 Go](https://mtxserv.com/fr/vps-ssd) - 1 mois',
            '2x [Nitro Boost](https://discord.com)',
            //'3x [STEAM CARD 5€](https://store.steampowered.com/digitalgiftcards/)',
            //'1x [Serveur Rust Starter](https://mtxserv.com/fr/hebergeur-serveur-rust) - 1 mois',
            //'1x [Serveur ARK Starter](https://mtxserv.com/fr/hebergeur-serveur-ark) - 1 mois',
        ]

        const actions = [
            '> **+30 points**・Boostez le serveur discord de mTxServ',
            '> **+30 points**・Suivez le channel <#563304015924953108> sur votre serveur discord',
            '> **+10 points**・Réagissez à ce message avec :gift:',
            '> **+10 points**・Retweetez le [message sur twitter](https://twitter.com/mTxServ/status/1327650869656117251) et suivez le compte [@mTxServ](https://twitter.com/mTxServ)',
            '> **+10 points**・[Invitez le <#769619263078006844> sur votre discord](https://discord.com/oauth2/authorize?client_id=535435520394657794&permissions=912577&scope=bot) puis poster le message du giveaway  avec \`m!giveaway\` sur son serveur',
        ]

        const reaction = ':alarm_clock:'
        const endDate = '6 Dec à 18H'

        const prizeLabel = prizes.map(prize => `> ❯ ${prize}`).join('\n')

        const embed = new Discord.MessageEmbed()
            .setTitle('GIVEAWAY')
            .setColor('YELLOW')
        ;

        let giveawayMsg = null

        if (this.client.isMainGuild(msg.guild.id) && this.client.isOwner(msg.author)) {
            embed.setDescription(`:four_leaf_clover: Pour participer, réagissez avec :gift: à ce message.\n\nTirage au sort le **${endDate}**\n\n:four_leaf_clover: **Participer et Augmenter ses chances** :four_leaf_clover:\n\n${actions.join('\n')}\n\n:gift_heart: **Lots** :gift_heart:\n\n${prizeLabel}`)

            const channel = await this.client.channels.cache.get('563304015924953108')
            giveawayMsg = false // await channel.messages.fetch('770702367049252874').catch(console.error)

            if (giveawayMsg) {
                await giveawayMsg.edit({
                    content: `C'est parti pour un nouveau giveaway!`,
                    embed: embed
                })
            } else {
                giveawayMsg = await msg.channel.send({
                    content: `@everyone C'est parti pour un nouveau giveaway!`,
                    embed: embed,
                })
            }

            msg.delete()
        } else {
            embed.setDescription(`**Pour participer** au giveaway organisé par [mTxServ](https://mtxserv.com/fr/), rendez-vous dans <#563304015924953108> (ou utilisez cette [invitation pour le discord du giveaway](${this.client.options.invite})).\n\n${reaction} Tirage au sort le **${endDate}**\n\n:gift_heart: **Lots** :gift_heart:\n\n${prizeLabel}`)
            embed.addField('Comment participer?', `[Rejoindre le discord du giveaway](${this.client.options.invite})`)

            giveawayMsg = await msg.say({
                embed
            });
        }

        giveawayMsg.react('🎁')

        if (!this.client.isMainGuild(msg.guild.id)) {
            await this.client.provider.set(isDev ? 'giveaway_msg_dev' : 'giveaway_msg', msg.author.id, {
                guildId: msg.guild.id,
                guildName: msg.guild.name,
                messageId: giveawayMsg.id
            })
        }

        return giveawayMsg
    }
};
