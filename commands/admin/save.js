const mTxServCommand = require('../mTxServCommand.js');
const Discord = require('discord.js')
const backup = require('discord-backup')

module.exports = class SaveCommand extends mTxServCommand {
    constructor(client) {
        super(client, {
            name: 'backup-create',
            aliases: ['create-backup', 'backup', 'save'],
            group: 'admin',
            memberName: 'backup-create',
            description: 'Create discord backup of current guild configuration',
            clientPermissions: ['SEND_MESSAGES'],
            ownerOnly: true,
            guildOnly: true,
            hidden: true,
            guarded: true
        });
    }

    async run(msg) {
        await this.sayWarning(msg, 'Start backup of current guild..')

        // Create the backup
        backup.create(msg.guild, {
            jsonBeautify: true
        }).then((backupData) => {
            return this.saySuccess(msg, `:white_check_mark: Backup **#${backupData.id}** successfully created!`);
        }).catch((err) => {
            console.error(err)
            return this.sayError(msg, `Cant create backup`);
        });
    }
};