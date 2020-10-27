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
            '1x [Serveur Minecraft 3 Go](https://mtxserv.com/fr/hebergeur-serveur-minecraft) - 1 mois',
            '1x [Serveur GMod Starter](https://mtxserv.com/fr/hebergeur-serveur-garry-s-mod) - 1 mois',
            //'1x [Serveur Rust Starter](https://mtxserv.com/fr/hebergeur-serveur-rust) - 1 mois',
            //'1x [Serveur ARK Starter](https://mtxserv.com/fr/hebergeur-serveur-ark) - 1 mois',
        ]

        const actions = [
            '🔟 *points* ・ Réagissez à ce message avec :gift:',
            '🔟 *points* ・ Suivre notre compte [Twitter](https://twitter.com/mTxServ) et retweet le [message suivant](https://twitter.com/mTxServ)',
            //'🔟 *points* - rejoindre un discord partenaire: [GCA](https://discord.com/oauth2/authorize?client_id=535435520394657794&permissions=912577&scope=bot) ou [Numerix](https://discord.com/oauth2/authorize?client_id=535435520394657794&permissions=912577&scope=bot)',
            '🔟 *points* ・ Partager le giveaway sur discord  avec \`m!giveaway\` (le <#769619263078006844> doit être sur votre serveur)',
        ]

        const reaction = ':alarm_clock:'
        const endDate = '01 Nov 2020 à 20H'

        const prizeLabel = prizes.map(prize => `> ❯ ${prize}`).join('\n')

        const embed = new Discord.MessageEmbed()
            .setTitle('GIVEAWAY')
            .setColor('YELLOW')
        ;

        if (this.client.isMainGuild(msg.guild.id)) {
            embed.setDescription(`**Pour participer** au <#563304015924953108>: \n・Réagissez à ce message avec :gift:\n・et/ou retweetez le [message sur twitter](https://twitter.com/mTxServ) et suivez le compte [@mTxServ](https://twitter.com/mTxServ)\n\n${reaction} Tirage au sort le **${endDate}**\n\n:four_leaf_clover: **Augmentez vos chances** :four_leaf_clover:\n\n${actions.join('\n')}\n\n:gift_heart: **Lots** :gift_heart:\n\n${prizeLabel}`)
        } else {
            embed.setDescription(`**Pour participer** au giveaway organisé par [mTxServ](https://mtxserv.com), rendez-vous dans <#563304015924953108> (ou utilisez cette [invitation pour le discord du giveaway](${this.client.options.invite})).\n\n${reaction} Tirage au sort le **${endDate}**\n\n:gift_heart: **Lots** :gift_heart:\n\n${prizeLabel}`)
            embed.addField('Comment participer?', `[Rejoindre le discord du giveaway](${this.client.options.invite})`)
        }

        const giveawayMsg = await msg.say({
            embed
        });

        giveawayMsg.react('🎁')

        msg.delete()

        if (!this.client.isMainGuild(msg.guild.id)) {
            await this.client.provider.set(isDev ? 'giveaway_dev' : 'giveaway', msg.author.id, {
                guildId: msg.guild.id,
                messageId: giveawayMsg.id
            })
        }

        return giveawayMsg
    }
};