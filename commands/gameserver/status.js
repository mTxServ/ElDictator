const mTxServCommand = require('../mTxServCommand.js')
const GameServerApi = require('../../api/GameServerApi')
const Discord = require('discord.js')

module.exports = class GameServerStatusCommand extends mTxServCommand {
    constructor(client) {
        super(client, {
            name: 'gs',
            aliases: ['gstatus', 'status'],
            group: 'gameserver',
            memberName: 'gameserver',
            description: 'Check if a game server is online of offline.',
            clientPermissions: ['SEND_MESSAGES'],
            args: [
                {
                    key: 'game',
                    prompt: 'Game (minecraft/gmod/ark/rust)?',
                    type: 'string',
                    oneOf: ['minecraft', 'gmod', 'ark', 'rust'],
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

        embed
            .setColor('GREEN')
            .setAuthor(`${results.params.host_name.toUpperCase()} - ${results.params.used_slots} / ${results.params.max_slots}`, "https://cdn.discordapp.com/emojis/530431090117050398.png?v=1")
            .addField('Address', address.toUpperCase())
            .addField('Map', results.params.map, true)
            .addField('Game', results.params.type.toUpperCase(), true)
        ;

        if (results.params.plugins && results.params.plugins) {
            embed.addField('Plugins', results.params.plugins);
        }

        return msg.say({
            embed
        });
    }
};