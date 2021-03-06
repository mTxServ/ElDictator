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
        
        let gameName
        if (results.params.type === null || results.params.type === "") {
            gameName = lang['gs_status']['unknown']
        } 
        else {
            gameName = results.params.type
        }
        
        let mapName
        if (results.params.map === null || results.params.map === "") {
            mapName = lang['gs_status']['unknown']
        } 
        else {
            mapName = results.params.map
        }
            
            
        embed
            .setColor('GREEN')
            .setAuthor(`${results.params.host_name}`, iconUrl)
            .setTimestamp()
            .addField(lang['gameserver']['address'], `\`${address.toUpperCase()}\``)
            .addField(lang['gameserver']['players'], `${results.params.used_slots}/${results.params.max_slots}`, true)
            .addField(lang['gameserver']['game'], gameName, true)
            .addField(lang['gameserver']['map'],  mapName, true)
            .setFooter(lang['gameserver']['by'] + ' mTxServ.com')
        ;

        if (results.params.joinlink) {
            embed.setDescription(`\`${results.params.joinlink}\``);

        }

        if (results.params.plugins) {
            const plugins = results.params.plugins.split(': ').join('; ').split('; ').map(plugin =>  `\`${plugin}\``).join(' ')
            embed.addField(lang['gameserver']['plugins'], plugins.substring(0, 1023));
        }

        return embed;
    }
}

module.exports = GameServerApi;
