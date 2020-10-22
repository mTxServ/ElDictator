class BadgeManager {
    getBadgesOfUser(guildId, userId) {
        return client.guildSettings.getBadgesOfUser(guildId, userId)
    }

    setBadgesOfUser(guildId, userId, badges) {
        return client.guildSettings.setBadgesOfUser(guildId, userId, badges)
    }

    processMessage(msg) {
        let badges = this.getBadgesOfUser(msg.guild.id, msg.author.id)
        const older = badges.join(',')

        if (msg.author.bot) {
            badges.push(BadgeManager.resolve('bot'))
        } else if (msg.member.hasPermission('ADMINISTRATOR')) {
            badges.push(BadgeManager.resolve('admin'))
        }

        badges = [...new Set(badges)]
        if (older === badges.join(',')) {
            return
        }

        this.setBadgesOfUser(msg.guild.id, msg.author.id, badges)

        const user = msg.guild.members.cache.get(msg.author.id)
        if (!user) {
            return
        }

        let newNickname = `${user.nickname||user.username} `
        for (const badge of badges) {
            if (-1 === newNickname.indexOf(badge)) {
                newNickname = `${newNickname}${badge}`
            }
        }

        if (user.nickname !== newNickname) {
            user.setNickname(newNickname).catch(console.error);
        }
    }

    static resolve(badgeName) {
        switch (badgeName) {
            case 'bot':
                return '🤖';

            case 'admin':
            case 'staff':
                return '🌟';

            default:
                throw new Error(`Badge ${badgeName} not found`)
        }
    }
}

module.exports = BadgeManager;
