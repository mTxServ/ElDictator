const mTxServCommand = require('../mTxServCommand.js');
const Discord = require('discord.js');

module.exports = class StockCommand extends mTxServCommand {
    constructor(client) {
        super(client, {
            name: 'stock',
            aliases: ['stocks'],
            group: 'mtxserv',
            memberName: 'stock',
            description: 'Get Stock of mTxServ',
            clientPermissions: ['SEND_MESSAGES'],
            guarded: true,
            args: [
                {
                    key: 'type',
                    prompt: 'Which type of stock (game/vps-game/vps)?',
                    type: 'string',
                    default: 'game'
                }
            ],
            throttling: {
                usages: 2,
                duration: 5,
            },
        });
    }

    async run(msg, { type }) {
        const lang = require(`../../languages/${await this.resolveLangOfMessage(msg)}.json`);

        const pop = [
            {
                icon: ':flag_fr:',
                hasGameStock: true,
                hasVpsGameStock: true,
                hasVpsStock: true
            },
            {
                icon: ':flag_gb:',
                hasGameStock: false,
                hasVpsGameStock: true,
                hasVpsStock: false
            },
            {
                icon: ':flag_de:',
                hasGameStock: false,
                hasVpsGameStock: false,
                hasVpsStock: false
            },
            {
                icon: ':flag_pl:',
                hasGameStock: false,
                hasVpsGameStock: false,
                hasVpsStock: false
            },
            {
                icon: ':flag_ca:',
                hasGameStock: true,
                hasVpsGameStock: true,
                hasVpsStock: false
            },
            {
                icon: ':flag_us:',
                hasGameStock: true,
                hasVpsGameStock: true,
                hasVpsStock: false
            },
        ];

        let embed = null

        switch (type) {
            // Game Stock
            case 'game':
                embed = new Discord.MessageEmbed()
                    .setTitle(lang['stock']['title_game'])
                    .setDescription(lang['stock']['state'])
                    .setColor('GREEN')
                ;

                for (const k in pop) {
                    embed.addField(pop[k].icon, pop[k].hasGameStock ? ':green_circle:' : ':red_circle:', true)
                }

                return msg.say({
                    embed
                })

            // VPS Game Stock
            case 'vps-game':
                embed = new Discord.MessageEmbed()
                    .setTitle(lang['stock']['title_vps_game'])
                    .setDescription(lang['stock']['state'])
                    .setColor('GREEN')
                ;

                for (const k in pop) {
                    embed.addField(pop[k].icon, pop[k].hasVpsGameStock ? ':green_circle:' : ':red_circle:', true)
                }

                return msg.say({
                    embed
                })

            // VPS stock
            case 'vps':
                embed = new Discord.MessageEmbed()
                    .setTitle(lang['stock']['title_vps'])
                    .setDescription(lang['stock']['state'])
                    .setColor('RED')
                ;

                for (const k in pop) {
                    embed.addField(pop[k].icon, pop[k].hasVpsStock ? ':green_circle:' : ':red_circle:', true)
                }

                return msg.say({
                    embed
                })
        }
    }
};
