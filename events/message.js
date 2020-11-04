const Discord = require('discord.js')
const Grabity = require("grabity");
const getUrls = require('get-urls');
const URL = require('url').URL
const { stripInvites, extractInviteLink } = require('../util/Util');

module.exports = {
    run: async (msg) => {
        if (msg.channel.type !== 'text') return;

        if (
            msg.channel.type !== 'dm' && (msg.guild.id === '529605510219956233' || msg.guild.id === '726178170314817630' || msg.guild.id === '539501579137581071')) {

            if (!msg.author.bot && msg.member.nickname) {
                client.ranker.processMessage(msg)
            }
        }

        if (   -1 !== msg.content.indexOf('m!img')
            || -1 !== msg.content.indexOf('m!url')
            || -1 !== msg.content.indexOf('m!cat')
            || -1 !== msg.content.indexOf('m!dog')
        ) {
            return;
        }

        // share/img channels
        if (
            client.isMainGuild(msg.guild.id)
            && ( -1 !== msg.channel.name.indexOf('-stream') || -1 !== msg.channel.name.indexOf('-images-liens') || -1 !== msg.channel.name.indexOf('-images-links'))
        ) {
            msg.react('👍').catch(console.error);
            msg.react('👎').catch(console.error);
            msg.react('🤷').catch(console.error);
            return;
        }

        if (msg.author.bot) return;

        // gameservers pub
        if (
            client.isMainGuild(msg.guild.id)
            && (   -1 !== msg.channel.name.indexOf('-pub-serveurs')
                || -1 !== msg.channel.name.indexOf('-servers-pub')
                || -1 !== msg.channel.name.indexOf('-pub-addons')
                || -1 !== msg.channel.name.indexOf('-family')
                || -1 !== msg.channel.name.indexOf('-hytale-recrute')
                || -1 !== msg.channel.name.indexOf('-giveaway')
                || -1 !== msg.channel.name.indexOf('-lien-utiles')
                || -1 !== msg.channel.name.indexOf('-usefull-links')
                || -1 !== msg.channel.name.indexOf('-devenir-partenaire')
                || -1 !== msg.channel.name.indexOf('-become-partner')
                || -1 !== msg.channel.name.indexOf('-news')
                || -1 !== msg.channel.name.indexOf('-annonces')
                || -1 !== msg.channel.name.indexOf('-announcement')
                || -1 !== msg.channel.name.indexOf('-faq-serveur')
                || -1 !== msg.channel.name.indexOf('-server-faq')
            )
        ) {
            const inviteLink = extractInviteLink(msg.content)

            let content = Discord.Util.removeMentions(msg.content).trim()
            if (!content) {
                return
            }

            const urls = getUrls(stripInvites(content));
            const link = inviteLink ? inviteLink : (urls.values().next().value || null);

            const embed = new Discord.MessageEmbed()
                .setAuthor(`${msg.author.tag}`, `${msg.author.displayAvatarURL()}`, link)
                .setColor(Math.floor(Math.random() * 16777214) + 1)
            ;

            if (null !== inviteLink) {
                const metadata = await Grabity.grabIt(inviteLink)

                if (metadata.title && -1 !== metadata.title.indexOf('Join the ')) {
                    const title = metadata.title.replace('Discord Server!', '').replace('Join the', '')
                    embed
                        .setTitle(title)
                        .addField('Discord', `[${title}](${inviteLink})`, true)
                }
            }

            if (null !== link) {
                const url = new URL(link)
                const metadata = await Grabity.grabIt(link)

                if (metadata.image) {
                    if ('/' === metadata.image.substr(0, 1)) {
                        metadata.image = `${url.protocol}//${url.host}${metadata.image}`
                    }

                    const isValidUrl = /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(metadata.image)
                    if (isValidUrl) {
                        embed.setThumbnail(metadata.image)
                    }
                }
            }
            
            if (   -1 === msg.channel.name.indexOf('-lien-utiles') 
                && -1 === msg.channel.name.indexOf('-usefull-links') 
                && -1 === msg.channel.name.indexOf('-hytale-recrute') 
                && -1 === msg.channel.name.indexOf('-devenir-partenaire') 
                && -1 === msg.channel.name.indexOf('-become-partner') 
                && -1 === msg.channel.name.indexOf('-giveaway') 
                && -1 === msg.channel.name.indexOf('-news') 
                && -1 === msg.channel.name.indexOf('-annonces') 
                && -1 === msg.channel.name.indexOf('-announcement')
                && -1 === msg.channel.name.indexOf('-faq-serveur') 
                && -1 === msg.channel.name.indexOf('-server-faq')
               ) {
                const items = urls.values()
                let item = items.next()

                let metadata
                do {
                    try {
                        if (!item.value) {
                            break
                        }

                        metadata = await Grabity.grabIt(item.value)
                        if (metadata && metadata.title) {
                            let title = metadata.title

                            if (-1 !== item.value.indexOf('top-serveurs.net')) {
                                title = 'Top Serveurs'
                            }

                            if (-1 !== item.value.indexOf('steamcommunity.com') ) {
                                if (-1 !== metadata.title.indexOf('Steam Workshop::')) {
                                    title = 'Steam Workshop'
                                } else if (-1 !== metadata.title.indexOf('Steam Community :: Group')) {
                                    title = 'Steam Group'
                                }
                            }

                            const description = title !== metadata.title ? `[View ${title}](${item.value})` : `[${title}](${item.value})`
                            embed.addField(title, description, true)
                        }
                    } catch (err) {

                    }
                }
                while (item = items.next())
            }
            
            embed.setDescription(content)

            const attachments = msg.attachments.map(attachment => attachment)

            for (const attachment of attachments) {
                embed.attachFiles(new Discord.MessageAttachment(attachment.attachment))
                embed.setImage(`attachment://${attachment.name}`)
            }

            const embedMsg = await msg.channel.send({
                embed: embed,
            })

            embedMsg.react('👍');
            embedMsg.react('👎');
                
            if (
                -1 !== msg.channel.name.indexOf('-pub-serveurs')
                || -1 !== msg.channel.name.indexOf('-servers-pub')
            ) {
                if(!msg.member.roles.cache.has('773500803218538546')) {
                    const role = msg.member.roles.cache.get('773500803218538546')
                    if (role) {
                       msg.member.addRole(role).catch(console.error);
                    }
                }
            } else if (
                -1 !== msg.channel.name.indexOf('-vidéos-streams')
                || -1 !== msg.channel.name.indexOf('-videos-streams')
            ) {
                if(!msg.member.roles.cache.has('773500491245289472')) {
                    const role = msg.member.roles.cache.get('773500491245289472')
                    if (role) {
                       msg.member.addRole(role).catch(console.error);
                    }
                }
            }

            msg.delete()
                
            return;
        }
    }
};
