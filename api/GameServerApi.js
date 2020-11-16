const got = require('got');
const Discord = require('discord.js')

const makeURL = (game, host, port) => `https://mtxserv.com/api/v1/viewers/game?ip=${encodeURIComponent(host)}&port=${encodeURIComponent(port)}&type=${encodeURIComponent(game)}`;

class GameServerApi {
    async status(game, host, port) {
        const res = await got(makeURL(game, host, port), {
            responseType: 'json'
        })

        if (!res || !res.body) {
            throw new Error('Invalid response of mtxserv API')
        }

        if (res.body.is_online && res.body.params.host_name && res.body.params.host_name.length) {
            res.body.params.host_name = res.body.params.host_name.replace(/\u00A7[0-9A-FK-OR]/ig,'').replace('\n', '').trim()
        }

        return res.body
    }

    async generateEmbed(msg, game, address, language) {
        const lang = require(`../languages/${language}.json`);
        game = game.toLowerCase();
        if (game === 'gmod') {
            game = 'garry-s-mod';
        }

        const split = address.split(':')
        const embed = new Discord.MessageEmbed();

        if (split.length !== 2) {
            return embed
                .setColor('RED')
                .setTitle(address.toUpperCase())
                .setDescription(lang['gs_status']['invalid_format'])
            ;
        }

        const results = await this.status(game, split[0], split[1])

        if (!results['is_online']) {
            return embed
                .setColor('RED')
                .setTitle(address.toUpperCase())
                .setDescription(lang['gs_status']['offline'])
            ;
        }

        const iconUrl = `https://mtxserv.com/build/manager-game/img/game/${game}.png`;

        embed
            .setColor('GREEN')
            .setAuthor(`${results.params.host_name}`, iconUrl)
            .setTimestamp()
            .addField('Address', `\`${address.toUpperCase()}\``)
            .addField('Players', `${results.params.used_slots}/${results.params.max_slots}`, true)
            .addField('Game', results.params.type, true)
            .addField('Map', results.params.map, true)
            .setFooter('by mTxServ.com')
        ;

        if (results.params.joinlink) {
            embed.setDescription(`\`${results.params.joinlink}\``);

        }

        if (results.params.plugins) {
            const plugins = results.params.plugins.split(': ').join('; ').split('; ').map(plugin =>  `\`${plugin}\``).join(' ').slice(0, 15)
            embed.addField('Plugins', plugins);
        }

        return embed;
    }
}

module.exports = GameServerApi;
