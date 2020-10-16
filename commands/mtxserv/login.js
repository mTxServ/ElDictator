const mTxServCommand = require('../mTxServCommand.js')
const Discord = require('discord.js')
const mTxServApi = require('../../api/mTxServApi')

module.exports = class SupportCommand extends mTxServCommand {
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

        if (msg.channel.type !== 'dm') {
            await this.saySuccess(msg, 'Consultez vos DM pour lier votre compte mTxServ à votre compte Discord.')
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

        const self = this
        const credentials = {
            clientId: null,
            clientSecret: null,
            apiKey: null
        }

        return this.getInput(msg, 'Avez-vous créé vos identifiants (yes) ?', function() {
            self.getInput(msg, 'Quel est votre `client_id` ?', function(collected) {
                credentials.clientId = collected.first().content.trim()
                self.getInput(msg, 'Quel est votre `client_secret` ?', function(collected) {
                    credentials.clientSecret = collected.first().content.trim()
                    self.getInput(msg, 'Quel est votre `api_key` ?', function(collected) {
                        credentials.apiKey = collected.first().content.trim()

                        const api = new mTxServApi(credentials.clientId, credentials.clientSecret, credentials.apiKey)
                        api.login()
                            .then(function(result) {
                                self.client.settings.set(`auth_${msg.author.id}`, credentials)
                                self.sayAuthorSuccess(msg, 'Login successfull!')
                            })
                            .catch(err => self.sayError(msg, `Vos accès sonts incorrects, impossible de s'identifier.`))
                    })
                })
            })
        })
    }

    async getInput(msg, inputMsg, cb) {
        return await this.askAuthor(msg, inputMsg, cb)
            .then(() => {
                msg.channel
                    .awaitMessages(m => m.author.id == msg.author.id, {max: 1, time: 30000})
                    .then(collected => {
                        if(cb) {
                            cb(collected)
                        }
                    }).catch((err) => {
                        console.error(err)
                        this.sayAuthorError(msg, 'No answer after 30 seconds, operation canceled.')
                    })
                ;
            })
    }
};