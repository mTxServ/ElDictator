const mTxServCommand = require('../mTxServCommand.js')
const Discord = require('discord.js')
const WorkshopDownloaderApi = require('../../api/WorkshopDownloaderApi')

module.exports = class SteamDownloaderCommand extends mTxServCommand {
    constructor(client) {
        super(client, {
            name: 'workshop-dl',
            aliases: ['steam-dl'],
            group: 'gmod',
            memberName: 'workshop-dl',
            description: 'Get a link to download a STEAM Workshop addon',
            clientPermissions: ['SEND_MESSAGES'],
            guarded: true,
            args: [
                {
                    key: 'url',
                    prompt: 'Which addon URL?',
                    type: 'string',
                    validate: url => {
                        return /^https:\/\/steamcommunity.com\/sharedfiles\/filedetails\/\?id=[0-9]{2,15}(&.+)?$/i.test(url);
                    }
                },
            ],
            throttling: {
                usages: 2,
                duration: 5,
            },
        });
    }

    async run(msg, {url}) {
        msg.delete();

        const pattern = new RegExp("https:\\/\\/steamcommunity.com\\/sharedfiles\\/filedetails\\/\\?id=([0-9]{2,15})(&.+)?");
        const matches = pattern[Symbol.match](url);

        if (!matches[1]) {
            return this.sayError(msg, 'Cant retrieve file ID from the URL')
        }

        const addonId = matches[1]
        const api = new WorkshopDownloaderApi()

        const downloadLink = await api.getDownloadLinkOf(addonId)
        if (!downloadLink) {
            return this.sayError(msg, 'Can\'t download this addon from the workshop.\n**Only addons can be downloaded.**')
        }

        return this.saySuccess(msg, `You can download this addon of STEAM Workshop [here](${downloadLink}).`)
    }
};