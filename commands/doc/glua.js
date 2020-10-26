const mTxServCommand = require('../mTxServCommand.js')
const puppeteer = require('puppeteer');
const FlexSearch = require('flexsearch');
const Discord = require('discord.js')

module.exports = class DocGluaCommand extends mTxServCommand {
    constructor(client) {
        super(client, {
            name: 'glua',
            aliases: ['gmod-wiki'],
            group: 'gmod',
            memberName: 'glua',
            description: 'Search on GMod official wiki',
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

    async run(msg, { query }) {
        const userLang = await this.resolveLangOfMessage(msg)
        const lang = require(`../../languages/${userLang}.json`);
        const url = "https://wiki.facepunch.com/gmod/";

        try {
            let hrefs = await this.client.settings.get('cache_glua', false)

            if (!hrefs) {
                const browser = await puppeteer.launch({
                    headless: true,
                    args: ['--no-sandbox']
                });
                const page = await browser.newPage();
                await page.goto(url);

                hrefs = await page.$$eval('#contents details.level1 a', as => as.map((a) => {
                    return {
                        title: a.textContent,
                        link: a.href
                    }
                }));
                await browser.close();

                this.client.settings.set('cache_glua', hrefs)
            }

            const index = new FlexSearch();
            for (const k in hrefs) {
                index.add(k, hrefs[k]['title'])
            }

            const embed = new Discord.MessageEmbed()
                .setTimestamp()
                .setTitle(`:mag: ${lang['wiki']['search']} *${query}*`)
                .setColor('BLUE')
            ;

            const results = index.search(query, 5)
            if (!results.length) {
                embed
                    .setColor('RED')
                    .addField(lang['wiki']['no_result'], `${lang['wiki']['check']} <${url}>`);

                return msg.say({
                    embed
                });
            }

            results
                .map(key => {
                    embed.addField(`:book: ${hrefs[key].title}`, `<${hrefs[key].link}>` || 'n/a');
                })
            ;

            return msg.say({
                embed
            });
        } catch (error) {
            console.error(error)
        }
    }
};