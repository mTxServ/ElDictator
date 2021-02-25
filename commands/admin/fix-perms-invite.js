const mTxServCommand = require('../mTxServCommand.js');
const Discord = require('discord.js')

module.exports = class FixPermissionsCommand extends mTxServCommand {
    constructor(client) {
        super(client, {
            name: 'fix-perms-invite',
            group: 'admin',
            memberName: 'fix-perms-invite',
            description: 'Fix permissions to create invitations for all channels',
            ownerOnly: true,
            hidden: true,
            guarded: true,
            guildOnly: true
        });
    }

    async run(msg) {
        const channels = await msg.guild.channels.cache.array();

        for (const channel of channels) {
            // fr
            channel.updateOverwrite(
                '602918672482172978',
                {
                    CREATE_INSTANT_INVITE: true,
                }
            );

            // en
            channel.updateOverwrite(
                '602918941417013251',
                {
                    CREATE_INSTANT_INVITE: true,
                }
            );
        }

        return this.saySuccess(msg, 'Permissions to create invitation updated')
    }
};
