const DiscordCommando = require('discord.js-commando');
const Discord = require('discord.js');

module.exports = class mTxServCommand extends DiscordCommando.Command {
    onError(error, message, args, fromPattern, result) { // eslint-disable-line no-unused-vars
        console.error(error);

        const description = error.stack ? `\`\`\`x86asm\n${error.stack.substr(0, 2048)}\n\`\`\`` : `\`${error.toString().substr(0, 2048)}\``
        const embed = new Discord.MessageEmbed()
            .setColor('RED')
            .setTimestamp()
            .setTitle('Error')
            .setDescription(description)
            .addField('Command:', `${message.content.split(' ').join(' ')}`);

        this.client
            .channels
            .cache
            .get(process.env.LOG_CHANNEL_ID)
            .send({
                embed: embed
            })
        ;
    }

    resolveLangOfMessage(msg) {
        if (msg.channel.type !== 'dm') {
            return this.getLangOfChannel(msg.channel)
        }

        return this.getLangOfMember(msg.member)
    }

    getLangOfChannel(channel) {
        const guildConf = this.client.guildSettings.language(channel.guild.id)

        if (!channel || !channel.parentID) {
            return guildConf;
        }

        const parentChannel = this.client.channels.cache.get(channel.parentID)
        if (!parentChannel) {
            return guildConf;
        }

        return -1 !== parentChannel.name.indexOf('[FR]') ? 'fr' : guildConf;
    }

    getLangOfMember(member) {
        if (!member) {
            return process.env.DEFAULT_LANG;
        }

        return member.roles.cache.some(role => role.name === '🇫🇷') ? 'fr' : 'en';
    }

    sayWarning(msg, title) {
        const embed = new Discord.MessageEmbed()
            .setDescription(title)
            .setColor('ORANGE')
        ;

        return msg.say({
            embed
        });
    }

    saySuccess(msg, title) {
        const embed = new Discord.MessageEmbed()
            .setDescription(title)
            .setColor('GREEN')
        ;

        return msg.say({
            embed
        });
    }

    sayAuthorSuccess(msg, title) {
        const embed = new Discord.MessageEmbed()
            .setDescription(title)
            .setColor('GREEN')
        ;

        return msg.author.send({
            embed: embed
        });
    }

    sayError(msg, title) {
        const embed = new Discord.MessageEmbed()
            .setDescription(title)
            .setColor('RED')
        ;

        return msg.say({
            embed
        });
    }

    sayAuthorError(msg, title) {
        const embed = new Discord.MessageEmbed()
            .setDescription(title)
            .setColor('RED')
        ;

        return msg.author.send({
            embed: embed
        });
    }

    askConfirmation(msg, title) {
        const embed = new Discord.MessageEmbed()
            .setDescription(title)
            .setColor('ORANGE')
        ;

        return msg.say({
            embed
        });
    }

    askAuthorConfirmation(msg, title) {
        const embed = new Discord.MessageEmbed()
            .setDescription(title)
            .setColor('ORANGE')
        ;

        return msg.author.send({
            embed: embed
        });
    }

    ask(msg, title) {
        const embed = new Discord.MessageEmbed()
            .setDescription(title)
            .setColor('ORANGE')
        ;

        return msg.say({
            embed
        });
    }

    async askAuthor(msg, title) {
        const embed = new Discord.MessageEmbed()
            .setDescription(title)
            .setColor('ORANGE')
        ;

        return await msg.author.send({
            embed: embed
        });
    }

    async getInput(msg, inputMsg) {
        await this.askAuthor(msg, inputMsg)

        const collected = await msg.channel.awaitMessages(m => m.author.id == msg.author.id, {max: 1, time: 40000});
        const userInput = collected.first()

        if (!userInput) {
            return await this.sayAuthorError(msg, 'No answer after 40 seconds, operation canceled.')
        }

        return userInput.content.trim()
    }

    formatNumber(number, minimumFractionDigits = 0) {
        return Number.parseFloat(number).toLocaleString(undefined, {
            minimumFractionDigits,
            maximumFractionDigits: 2
        });
    }
};
