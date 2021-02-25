const mTxServCommand = require('../mTxServCommand.js');
const Discord = require('discord.js')

module.exports = class FixPermissionsModeratorCommand extends mTxServCommand {
    constructor(client) {
        super(client, {
            name: 'fix-perms-moderator',
            group: 'admin',
            memberName: 'fix-perms-moderator',
            description: 'Fix moderator permissions for all channels',
            ownerOnly: true,
            hidden: true,
            guarded: true,
            guildOnly: true
        });
    }

    async run(msg) {
        const channels = await msg.guild.channels.cache.array();

        for (const channel of channels) {
            // Moderator
            channel.createOverwrite(
                '773493168087629846',
                {
                    CREATE_INSTANT_INVITE: true,
                    ADD_REACTIONS: true,
                    KICK_MEMBERS: true,
                    BAN_MEMBERS: true,
                    VIEW_AUDIT_LOG: true,
                    VIEW_CHANNEL: true,
                    READ_MESSAGES: true,
                    SEND_MESSAGES: true,
                    SEND_TTS_MESSAGES: false,
                    MANAGE_MESSAGES: true,
                    EMBED_LINKS: true,
                    ATTACH_FILES: true,
                    READ_MESSAGE_HISTORY: true,
                    MENTION_EVERYONE: false,
                    USE_EXTERNAL_EMOJIS: true,
                    EXTERNAL_EMOJIS: true,
                    SPEAK: true,
                    CONNECT: true,
                    MUTE_MEMBERS: true,
                    DEAFEN_MEMBERS: true,
                    MOVE_MEMBERS: true,
                    USE_VAD: true,
                    CHANGE_NICKNAME: true,
                    MANAGE_NICKNAMES: true,
                }
            );
        }

        return this.saySuccess(msg, 'Permissions for `Moderator` role added everywhere.')
    }
};
