const mTxServCommand = require('../mTxServCommand.js')
const Discord = require('discord.js')
const { ICONS, AchievementCreator } = require("mc-achievements");
const { writeFileSync } = require("fs");

const listIcons = Object.values(ICONS)

module.exports = class AchievmentCommand extends mTxServCommand {
    constructor(client) {
        super(client, {
            name: 'mc-achievment',
            aliases: ['achievment'],
            group: 'minecraft',
            memberName: 'mc-achievment',
            description: 'Create minecraft achievment',
            clientPermissions: ['SEND_MESSAGES'],
            guarded: true,
            args: [
                {
                    key: 'icon',
                    prompt: 'Which icon?',
                    type: 'string',
                    default: ICONS.egg,
                },
                {
                    key: 'title',
                    prompt: 'Which title?',
                    type: 'string',
                    default: 'Default title',
                    validate: text => text.length >= 3,
                },
                {
                    key: 'message',
                    prompt: 'Which message for the achievment?',
                    type: 'string',
                    default: 'Default achievement message',
                    validate: text => text.length >= 3,
                },
            ],
            throttling: {
                usages: 2,
                duration: 5,
            },
        });
    }

    async run(msg, {icon, title, message}) {
        if (-1 === listIcons.indexOf(icon)) {
            return this.sayError(msg, `This icon doesn't exist.\n\n**Availables icons:**\n${listIcons.map(cur => (`\`${cur}\``)).join(', ')}`)
        }

        try {
            const binary = await AchievementCreator.create(icon, title, message);

            const attachment = new Discord.MessageAttachment(binary, 'achievment.png');

            const embed = new Discord.MessageEmbed()
                .setColor('GREEN')
                .setDescription('Achievement successful generated')
                .setTimestamp()
                .setImage(`attachment://achievment.png`)
                .setFooter(`${msg.author.tag}`)
                .attachFiles(attachment)
            ;

            return msg.say({ embed })
        } catch (err) {
            console.error(err)
            return this.sayError(msg, `An error occured:\n\`${err.message}\` `)
        }
    }
};