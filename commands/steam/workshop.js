const mTxServCommand = require('../mTxServCommand.js')
const XBBCODE = require('xbbcode-parser')
const Discord = require('discord.js')
const SteamWorkshop = require('steam-workshop')
const striptags = require('striptags')
const { stripIndents, oneLine } = require('common-tags');

module.exports = class WorkshopCommand extends mTxServCommand {
    constructor(client) {
        super(client, {
            name: 'workshop',
            aliases: ['gmod-workshop', 'workshop-gmod', 'ws'],
            group: 'gmod',
            memberName: 'workshop',
            description: 'Search in STEAM workshop',
            clientPermissions: ['SEND_MESSAGES'],
            args: [
                {
                    key: 'query',
                    prompt: 'Which query did you search?',
                    type: 'string',
                    validate: text => text.length >= 3,
                },
            ],
            throttling: {
                usages: 2,
                duration: 5,
            },
        });
    }

    run(msg, { query }) {
        const lang = require(`../../languages/${this.resolveLangOfMessage(msg) }.json`);
        const steamWorkshop = new SteamWorkshop()

        steamWorkshop.queryFiles({
            appid: 4000,
            key: process.env.STEAM_WEB_API_KEY,
            numperpage: 5,
            return_metadata: 1,
            return_short_description: 1,
            search_text: query
        }, function (err, items) {
            if (err) {
                console.error('Search failed with error:', err)
                return
            }

            const embed = new Discord.MessageEmbed()
                .setTitle(`:mag: ${lang['how_to']['search']} *${query}*`)
                .setColor('BLUE')
            ;

            for (const item of items) {
                const description = striptags(XBBCODE.process({
                    text: item.short_description,
                    addInLineBreaks: false
                }).html).substr(0, 100) + '...';

                embed.addField(`:package: ${item.title}`, `${oneLine`
						${description.replace('**', '').replace('\n', '').replace('[h1]', '').replace('&#91;/h1&#93;', '')}
					`}\n<https://steamcommunity.com/workshop/filedetails/?id=${item.publishedfileid}>`);
            }

            return msg.say({
                embed
            });;
        })
    }
};