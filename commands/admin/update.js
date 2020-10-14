const mTxServCommand = require('../mTxServCommand.js');
const { execSync } = require('child_process');
const { stripIndents } = require('common-tags');

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

        return msg
            .say(lang['bot_update']['confirm'])
            .then(() => {
                const results = this.exec('git pull');
                return msg.reply(stripIndents`
                    _${results.err ? 'An error occurred:' : 'Successfully updated.'}_
                    \`\`\`sh
                    ${results.std}
                    \`\`\`
                `);
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