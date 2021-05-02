const mTxServCommand = require('../mTxServCommand.js')
const Discord = require('discord.js')

module.exports = class SuggestUpdateCommand extends mTxServCommand {
    constructor(client) {
        super(client, {
            name: 'suggest-update',
            aliases: ['feedback-update'],
            group: 'bot',
            memberName: 'suggest-update',
            description: 'Update a feedback',
            clientPermissions: ['SEND_MESSAGES'],
            guarded: true,
            args: [
                {
                    key: 'suggestionID',
                    prompt: 'ID of the suggestion',
                    type: 'string',
                    validate: text => text.length >= 5,
                },
                {
                    key: 'status',
                    prompt: 'Status for the suggestion',
                    type: 'string',
                    oneOf: ["accepted", "refused", "implemented"]
                },
            ],
            throttling: {
                usages: 2,
                duration: 5,
            },
            ownerOnly: true,
        });
    }

    async run(msg, {suggestionID, status}) {
        const userLang = await this.resolveLangOfMessage(msg)
        const lang = require(`../../languages/${userLang}.json`)

        const currentConfig = await this.client.provider.get(msg.guild.id, 'suggest-config', {})

        const color = { "accepted": "ORANGE", "refused": "RED", "implemented": "GREEN" }

        if (typeof currentConfig[userLang] === 'undefined') {
            return this.sayError(msg, 'Feedbacks are not configured on this server. Use `m!suggest-set-channel` to configure it.')
        }

        if (!this.client.channels.cache.has(currentConfig[userLang])) {
            return this.sayError(msg, `The feedback channel \`${currentConfig[userLang]}\` doesn't exist. Use \`m!suggest-set-channel ${userLang}\` to reconfigure it.`)
        }

        var msgSuggest = await this.client.channels.cache.get(currentConfig[userLang]).messages.fetch(suggestionID)

        if ( msgSuggest.embeds.length === 0 ) return this.sayError(msg, "You have entered an message ID that is not a suggestion (embed)")

        const embed = new Discord.MessageEmbed()
            .setAuthor(msgSuggest.embeds[0].author.name, msgSuggest.embeds[0].author.iconURL)
            .setColor(color[status])
            .setDescription( msgSuggest.embeds[0].description )
            .setFooter(`Suggestion ${lang["suggest"][status]} ${lang["suggest"]["by"]} ${msg.author.tag}`)
            .setTimestamp();

        if ( status === "refused" )
        {
            const reason = await this.getInput(msg, lang["suggest"]["ask_reason"], true)
            embed.addField(lang["suggest"]["reason"], `${reason}`)
        }

        msgSuggest.edit( embed )

        return this.saySuccess(msg, lang["suggest"]["update-succes"])
    }
};
