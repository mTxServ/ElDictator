const DiscordCommando = require('discord.js-commando');
const Discord = require('discord.js');

module.exports = class mTxServCommand extends DiscordCommando.Command {
    onError(err, message, args, fromPattern, result) { // eslint-disable-line no-unused-vars
        console.error(err);

        const embed = new Discord.MessageEmbed()
            .setColor('RED')
            .setTimestamp()
            .setTitle('An error occured with the bot')
            .setDescription(`StackTrace: \n\`\`\`${err.stack}\`\`\``)
            .addField('Command:', `${message.content.split(' ').join(' ')}`);

        return this.getSuperAdminUser().send({ embed })
    }

    getSuperAdminUser() {
        const owner = this.client.owners.filter(owner => owner.id === process.env.BOT_OWNER_ID)
        if (!owner.length) {
            throw new Error(`Super administrator not found`)
        }

        return owner.shift()
    }

    resolveLangOfMessage(msg) {
        if (msg.channel.type !== 'dm') {
            return this.getLangOfChannel(msg.channel)
        }

        return this.getLangOfMember(msg.member)
    }

    getLangOfChannel(channel) {
        if (!channel || !channel.parentID) {
            return process.env.DEFAULT_LANG;
        }

        const parentChannel = this.client.channels.cache.get(channel.parentID)
        if (!parentChannel) {
            return process.env.DEFAULT_LANG;
        }

        return -1 !== parentChannel.name.indexOf('[FR]') ? 'fr' : 'en';
    }

    getLangOfMember(member) {
        if (!member) {
            return process.env.DEFAULT_LANG;
        }

        return member.roles.cache.some(role => role.name === '🇫🇷') ? 'fr' : 'en';
    }

    saySuccess(msg, title) {
        const embed = new Discord.MessageEmbed()
            .setTitle(title)
            .setColor('GREEN')
        ;

        return msg.say({
            embed
        });
    }

    sayAuthorSuccess(msg, title) {
        const embed = new Discord.MessageEmbed()
            .setTitle(title)
            .setColor('GREEN')
        ;

        return msg.author.send({
            embed: embed
        });
    }

    sayError(msg, title) {
        const embed = new Discord.MessageEmbed()
            .setTitle(title)
            .setColor('RED')
        ;

        return msg.say({
            embed
        });
    }

    sayAuthorError(msg, title) {
        const embed = new Discord.MessageEmbed()
            .setTitle(title)
            .setColor('RED')
        ;

        return msg.author.send({
            embed: embed
        });
    }

    askConfirmation(msg, title) {
        const embed = new Discord.MessageEmbed()
            .setTitle(title)
            .setColor('ORANGE')
        ;

        return msg.say({
            embed
        });
    }

    askAuthorConfirmation(msg, title) {
        const embed = new Discord.MessageEmbed()
            .setTitle(title)
            .setColor('ORANGE')
        ;

        return msg.author.send({
            embed: embed
        });
    }

    ask(msg, title) {
        const embed = new Discord.MessageEmbed()
            .setTitle(title)
            .setColor('ORANGE')
        ;

        return msg.say({
            embed
        });
    }

    askAuthor(msg, title) {
        const embed = new Discord.MessageEmbed()
            .setTitle(title)
            .setColor('ORANGE')
        ;

        return msg.author.send({
            embed: embed
        });
    }
};
