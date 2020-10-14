const mTxServCommand = require('../mTxServCommand.js')
const GameServerApi = require('../../api/GameServerApi')
const Discord = require('discord.js')

module.exports = class GameServerStatusCommand extends mTxServCommand {
    constructor(client) {
        super(client, {
            name: 'status',
            aliases: ['gstatus', 'gs'],
            examples: ['status minecraft game-pl-02.MTXSERV.COM:27080', 'status gmod 51.75.51.29:27030'],
            group: 'gameserver',
            memberName: 'gameserver',
            description: 'Check if a game server is online or offline.',
            clientPermissions: ['SEND_MESSAGES'],
            args: [
                {
                    key: 'game',
                    prompt: 'Game (minecraft/gmod/ark/rust/onset/arma3)?',
                    type: 'string',
                    oneOf: ['minecraft', 'gmod', 'ark', 'rust', 'onset', 'arma3'],
                },
                {
                    key: 'address',
                    prompt: 'Address of server (eg: game.fr.01.mtxserv.com:27030)?',
                    type: 'string',
                },
            ],
            throttling: {
                usages: 2,
                duration: 5,
            },
        });
    }

    async run(msg, { game, address}) {
        const lang = require(`../../languages/${this.getLangOfMember(msg.member)}.json`);

        if (game === 'gmod') {
            game = 'garry-s-mod';
        }

        const split = address.split(':')
        const embed = new Discord.MessageEmbed();

        if (split.length !== 2) {
            embed
                .setColor('RED')
                .setTitle(address.toUpperCase())
                .setDescription(lang['gs_status']['invalid_format'])
            ;

            return msg.say({
                embed
            });
        }

        const api = new GameServerApi()
        const results = await api.status(game, split[0], split[1])

        if (!results['is_online']) {
            embed
                .setColor('RED')
                .setTitle(address.toUpperCase())
                .setDescription(lang['gs_status']['offline'])
            ;

            return msg.say({
                embed
            });
        }

        const iconUrl = `https://mtxserv.com/build/manager-game/img/game/${game}.png`;
        
        embed
            .setColor('GREEN')
            .setAuthor(`${results.params.host_name.toUpperCase()}`, iconUrl)
            .setTimestamp()
            .addField('Address', `\`${address.toUpperCase()}\``)
            .addField('Players', `${results.params.used_slots}/${results.params.max_slots}`, true)
            .addField('Game', results.params.type, true)
            .addField('Map', results.params.map, true)
        ;

        if (results.params.joinlink) {
            embed.setDescription(`\`${results.params.joinlink}\``);

        }

        if (results.params.plugins) {
            embed.addField('Plugins', results.params.plugins);
        }

        return msg.say({
            embed
        });
    }
};