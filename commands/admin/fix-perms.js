const mTxServCommand = require('../mTxServCommand.js');
const Discord = require('discord.js')

module.exports = class FixPermissionsCommand extends mTxServCommand {
    constructor(client) {
        super(client, {
            name: 'fix-perms',
            group: 'admin',
            memberName: 'fix-perms',
            description: 'Fix permissions for all channels',
            ownerOnly: true,
            hidden: true,
            guarded: true,
            guildOnly: true
        });
    }

    async run(msg) {
        return;

        const channels = await msg.guild.channels.cache.array();

        const mainChannels = {
            '692128629668315177': 'en',
            '777240538910818324': 'en',
            '772773757877747714': 'en',
            '772104275949387787': 'en',
            '779015449106972692': 'en'
        };

        for (const channel of channels) {
            const isAvailableForEveryone = -1 !== channel.name.indexOf('-select-lang')
                || -1 !== channel.name.indexOf('-giveaway-fr')
                || -1 !== channel.name.indexOf('-giveaway-en')
            ;

            // everyone
            channel.createOverwrite(
                '529605510219956233',
                {
                    CREATE_INSTANT_INVITE: false,
                    ADD_REACTIONS: isAvailableForEveryone,
                    KICK_MEMBERS: false,
                    BAN_MEMBERS: false,
                    VIEW_AUDIT_LOG: false,
                    VIEW_CHANNEL: isAvailableForEveryone,
                    READ_MESSAGES: false,
                    SEND_MESSAGES: false,
                    SEND_TTS_MESSAGES: false,
                    MANAGE_MESSAGES: false,
                    EMBED_LINKS: false,
                    ATTACH_FILES: false,
                    READ_MESSAGE_HISTORY: isAvailableForEveryone,
                    MENTION_EVERYONE: false,
                    USE_EXTERNAL_EMOJIS: isAvailableForEveryone,
                    EXTERNAL_EMOJIS: isAvailableForEveryone,
                    SPEAK: false,
                    CONNECT: false,
                    MUTE_MEMBERS: false,
                    DEAFEN_MEMBERS: false,
                    MOVE_MEMBERS: false,
                    USE_VAD: false,
                    CHANGE_NICKNAME: false,
                    MANAGE_NICKNAMES: false,
                }
            );

            let channelLang = 'fr';

            if (channel.parentID) {
                const parentChannel = this.client.channels.cache.get(channel.parentID)
                if (parentChannel) {
                    if (-1 !== parentChannel.name.indexOf('[FR]')) {
                        channelLang = 'fr'
                    } else if (-1 !== parentChannel.name.indexOf('[EN]')) {
                        channelLang = 'en'
                    }
                }
            } else {
                channelLang = typeof mainChannels[channel.id] !== 'undefined' ? mainChannels[channel.id] : 'fr'
            }

            if (channel.id === '602891962638401546'
                || (channel.parentID && channel.parentID === '602891962638401546')) {
                // en
                channel.createOverwrite(
                    '602918941417013251',
                    {
                        CREATE_INSTANT_INVITE: true,
                        ADD_REACTIONS: false,
                        KICK_MEMBERS: false,
                        BAN_MEMBERS: false,
                        VIEW_AUDIT_LOG: false,
                        VIEW_CHANNEL: false,
                        READ_MESSAGES: false,
                        SEND_MESSAGES: false,
                        SEND_TTS_MESSAGES: false,
                        MANAGE_MESSAGES: false,
                        EMBED_LINKS: false,
                        ATTACH_FILES: false,
                        READ_MESSAGE_HISTORY: false,
                        MENTION_EVERYONE: false,
                        USE_EXTERNAL_EMOJIS: false,
                        EXTERNAL_EMOJIS: false,
                        SPEAK: false,
                        CONNECT: false,
                        MUTE_MEMBERS: false,
                        DEAFEN_MEMBERS: false,
                        MOVE_MEMBERS: false,
                        USE_VAD: false,
                        CHANGE_NICKNAME: false,
                        MANAGE_NICKNAMES: false,
                    }
                );

                // fr
                channel.createOverwrite(
                    '602918672482172978',
                    {
                        CREATE_INSTANT_INVITE: true,
                        ADD_REACTIONS: false,
                        KICK_MEMBERS: false,
                        BAN_MEMBERS: false,
                        VIEW_AUDIT_LOG: false,
                        VIEW_CHANNEL: false,
                        READ_MESSAGES: false,
                        SEND_MESSAGES: false,
                        SEND_TTS_MESSAGES: false,
                        MANAGE_MESSAGES: false,
                        EMBED_LINKS: false,
                        ATTACH_FILES: false,
                        READ_MESSAGE_HISTORY: false,
                        MENTION_EVERYONE: false,
                        USE_EXTERNAL_EMOJIS: false,
                        EXTERNAL_EMOJIS: false,
                        SPEAK: false,
                        CONNECT: false,
                        MUTE_MEMBERS: false,
                        DEAFEN_MEMBERS: false,
                        MOVE_MEMBERS: false,
                        USE_VAD: false,
                        CHANGE_NICKNAME: false,
                        MANAGE_NICKNAMES: false,
                    }
                );

                continue;
            }

            const isReadOnly = -1 !== channel.name.indexOf('-news')
                || -1 !== channel.name.indexOf('-announcement')
                || -1 !== channel.name.indexOf('-annonces')
                || -1 !== channel.name.indexOf('-bot-help')
                || -1 !== channel.name.indexOf('-giveaway-en')
                || -1 !== channel.name.indexOf('-giveaway-fr')
                || -1 !== channel.name.indexOf('-translate-panel')
                || -1 !== channel.name.indexOf('-select-lang')
                || -1 !== channel.name.indexOf('-achievements')
                || -1 !== channel.name.indexOf('-bienvenue')
                || -1 !== channel.name.indexOf('-faq')
                || -1 !== channel.name.indexOf('-faq-en')
                || -1 !== channel.name.indexOf('-règlement')
                || -1 !== channel.name.indexOf('-rules')
                || -1 !== channel.name.indexOf('-jeux-gratuits')
                || -1 !== channel.name.indexOf('-family')
                || -1 !== channel.name.indexOf('-suggestions')
                || -1 !== channel.name.indexOf('-devenir-partenaire')
                || -1 !== channel.name.indexOf('-gca')
                || -1 !== channel.name.indexOf('-lien-utiles')
                || -1 !== channel.name.indexOf('-new-versions')
                || -1 !== channel.name.indexOf('-gca')
                || -1 !== channel.name.indexOf('-faq-serveur')
                || -1 !== channel.name.indexOf('-usefull-links')
                || -1 !== channel.name.indexOf('-feedbacks')
                || -1 !== channel.name.indexOf('-become-partner')
            ;

            if (channelLang === 'fr') {
                // fr
                channel.createOverwrite(
                    '602918672482172978',
                    {
                        CREATE_INSTANT_INVITE: true,
                        ADD_REACTIONS: true,
                        KICK_MEMBERS: false,
                        BAN_MEMBERS: false,
                        VIEW_AUDIT_LOG: false,
                        VIEW_CHANNEL: true,
                        READ_MESSAGES: true,
                        SEND_MESSAGES: !isReadOnly,
                        SEND_TTS_MESSAGES: false,
                        MANAGE_MESSAGES: false,
                        EMBED_LINKS: true,
                        ATTACH_FILES: true,
                        READ_MESSAGE_HISTORY: true,
                        MENTION_EVERYONE: false,
                        USE_EXTERNAL_EMOJIS: true,
                        EXTERNAL_EMOJIS: true,
                        SPEAK: true,
                        CONNECT: true,
                        MUTE_MEMBERS: false,
                        DEAFEN_MEMBERS: false,
                        MOVE_MEMBERS: false,
                        USE_VAD: true,
                        CHANGE_NICKNAME: true,
                        MANAGE_NICKNAMES: false,
                    }
                );

                // en
                channel.createOverwrite(
                    '602918941417013251',
                    {
                        CREATE_INSTANT_INVITE: true,
                        ADD_REACTIONS: false,
                        KICK_MEMBERS: false,
                        BAN_MEMBERS: false,
                        VIEW_AUDIT_LOG: false,
                        VIEW_CHANNEL: false,
                        READ_MESSAGES: false,
                        SEND_MESSAGES: false,
                        SEND_TTS_MESSAGES: false,
                        MANAGE_MESSAGES: false,
                        EMBED_LINKS: false,
                        ATTACH_FILES: false,
                        READ_MESSAGE_HISTORY: false,
                        MENTION_EVERYONE: false,
                        USE_EXTERNAL_EMOJIS: false,
                        EXTERNAL_EMOJIS: false,
                        SPEAK: false,
                        CONNECT: false,
                        MUTE_MEMBERS: false,
                        DEAFEN_MEMBERS: false,
                        MOVE_MEMBERS: false,
                        USE_VAD: false,
                        CHANGE_NICKNAME: false,
                        MANAGE_NICKNAMES: false,
                    }
                );
            } else {
                // en
                channel.createOverwrite(
                    '602918941417013251',
                    {
                        CREATE_INSTANT_INVITE: true,
                        ADD_REACTIONS: true,
                        KICK_MEMBERS: false,
                        BAN_MEMBERS: false,
                        VIEW_AUDIT_LOG: false,
                        VIEW_CHANNEL: true,
                        READ_MESSAGES: true,
                        SEND_MESSAGES: !isReadOnly,
                        SEND_TTS_MESSAGES: false,
                        MANAGE_MESSAGES: false,
                        EMBED_LINKS: true,
                        ATTACH_FILES: true,
                        READ_MESSAGE_HISTORY: true,
                        MENTION_EVERYONE: false,
                        USE_EXTERNAL_EMOJIS: true,
                        EXTERNAL_EMOJIS: true,
                        SPEAK: true,
                        CONNECT: true,
                        MUTE_MEMBERS: false,
                        DEAFEN_MEMBERS: false,
                        MOVE_MEMBERS: false,
                        USE_VAD: true,
                        CHANGE_NICKNAME: true,
                        MANAGE_NICKNAMES: false,
                    }
                );

                // fr
                channel.createOverwrite(
                    '602918672482172978',
                    {
                        CREATE_INSTANT_INVITE: true,
                        ADD_REACTIONS: false,
                        KICK_MEMBERS: false,
                        BAN_MEMBERS: false,
                        VIEW_AUDIT_LOG: false,
                        VIEW_CHANNEL: false,
                        READ_MESSAGES: false,
                        SEND_MESSAGES: false,
                        SEND_TTS_MESSAGES: false,
                        MANAGE_MESSAGES: false,
                        EMBED_LINKS: false,
                        ATTACH_FILES: false,
                        READ_MESSAGE_HISTORY: false,
                        MENTION_EVERYONE: false,
                        USE_EXTERNAL_EMOJIS: false,
                        EXTERNAL_EMOJIS: false,
                        SPEAK: false,
                        CONNECT: false,
                        MUTE_MEMBERS: false,
                        DEAFEN_MEMBERS: false,
                        MOVE_MEMBERS: false,
                        USE_VAD: false,
                        CHANGE_NICKNAME: false,
                        MANAGE_NICKNAMES: false,
                    }
                );
            }
        }

        return this.saySuccess(msg, 'Permissions for `Moderator` role added everywhere.')
    }
};
