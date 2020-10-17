const mTxServCommand = require('../mTxServCommand.js');
const { execSync } = require('child_process');
const { stripIndents } = require('common-tags');
const Discord = require('discord.js')

module.exports = class ExecCommand extends mTxServCommand {
    constructor(client) {
        super(client, {
            name: 'update',
            aliases: ['update-bot'],
            group: 'admin',
            memberName: 'update',
            description: 'Update the bot.',
            ownerOnly: true,
            hidden: true,
            guarded: true,
        });
    }

    run(msg) {
        const lang = require(`../../languages/${this.resolveLangOfMessage(msg)}.json`);

        return this
            .sayWarning(msg, lang['bot_update']['confirm'])
            .then(() => {
                const results = this.exec('git pull && yarn install');

                const embed = new Discord.MessageEmbed()
                    .setAuthor(`${this.client.user.tag}`, `${this.client.user.displayAvatarURL()}`)
                    .setColor(results.err ? 'RED' : 'GREEN')
                    .setTitle(`:up: Updating bot..\`\`\`sh\n${results.std}\n\`\`\``)
                    .setTimestamp();

                client
                    .channels.cache.get(process.env.LOG_CHANNEL_ID)
                    .send({
                        embed: embed
                    })

                return msg.say({
                    embed
                });
            })
    }

    exec(command) {
        try {
            const stdout = execSync(command, { timeout: 30000, encoding: 'utf8' });
            return { err: false, std: stdout.trim() };
        } catch (err) {
            return { err: true, std: err.stderr.trim() };
        }
    }
};