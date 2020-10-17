const mTxServCommand = require('../mTxServCommand.js')
const Discord = require('discord.js')
const mTxServApi = require('../../api/mTxServApi')

module.exports = class LoginCommand extends mTxServCommand {
    constructor(client) {
        super(client, {
            name: 'login',
            aliases: ['signin'],
            group: 'mtxserv',
            memberName: 'login',
            description: 'Link your discord account with your mTxServ account',
            clientPermissions: ['SEND_MESSAGES'],
            throttling: {
                usages: 2,
                duration: 5,
            },
            argsPromptLimit: 60
        });
    }

    async run(msg) {
        const userLang = this.resolveLangOfMessage(msg)
        const lang = require(`../../languages/${userLang}.json`)

        const api = new mTxServApi()
        if (api.isAuthenticated(msg.author.id)) {
            const embed = new Discord.MessageEmbed()
                .setDescription(lang['login']['already_connected'])
                .setColor('GREEN')
            ;

            return msg.say({
                embed
            });
        }

        if (msg.channel.type !== 'dm') {
            const embed = new Discord.MessageEmbed()
                .setDescription(lang['login']['sent_dm'])
                .setColor('BLUE')
            ;

            return msg.say({
                embed
            });
        }

        const embed = new Discord.MessageEmbed()
            .setTitle(lang['login']['title'])
            .setDescription(`${lang['login']['description']}`)
            .setColor('BLUE')
            .addField('client id & secret', `<https://mtxserv.com/fr/mon-compte/oauth>`)
            .addField('api key', `<https://mtxserv.com/fr/mon-compte/api>`)
        ;

        await msg.author.send({
            embed: embed
        })

        const credentials = {
            clientId: null,
            clientSecret: null,
            apiKey: null
        }

        const userInput = await this.getInput(msg, 'Avez-vous créé vos identifiants (yes) ?');
        if (userInput !== 'yes' && userInput !== 'oui') {
            return await this.sayError(msg, lang['login']['cancelled'])
        }

        credentials.clientId = await this.getInput(msg, 'Quel est votre `client_id` ?');
        credentials.clientSecret = await this.getInput(msg, 'Quel est votre `client_secret` ?');
        credentials.apiKey = await this.getInput(msg, 'Quel est votre `api_key` ?');

        try {
            await api.login(credentials.clientId, credentials.clientSecret, credentials.apiKey);
            api.setCredential(msg.author.id, credentials)

            return this.sayAuthorSuccess(msg, 'Login successfull!')
        } catch (err) {
            console.error(err)
            return this.sayError(msg, `Vos accès sonts invalides, impossible d'authentifier votre compte mTxServ.`)
        }
    }
};