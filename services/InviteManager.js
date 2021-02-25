class InviteManager {
    constructor() {

    }

    getCacheKey() {
        return isDev ? 'invites_dev' : 'invites'
    }

    getScoresCacheKey() {
        return isDev ? 'scores_invites_dev' : 'scores_invites'
    }

    getIgnoredCacheKey() {
        return isDev ? 'ignored_invites_dev' : 'ignored_invites'
    }

    async warmup() {
        const guilds = client.guilds.cache.array()
        for (const guild of guilds) {
            if (!client.isMainGuild(guild.id)) {
                continue
            }

            const invitations = {}

            const invites = await guild.fetchInvites();
            invites.forEach(invite => {
                invitations[invite.code] = {
                    code: invite.code,
                    temporary: invite.temporary,
                    maxAge: invite.maxAge,
                    uses: invite.uses,
                    maxUses: invite.maxUses,
                    createdAt: invite.createdTimestamp,
                    creatorId: invite.inviter ? invite.inviter.id : null,
                    creatorName: invite.inviter ? invite.inviter.username : 'Widget',
                    creatorBot: invite.inviter ? invite.inviter.bot : true,
                };
            });

            await client.provider.set(guild.id, this.getCacheKey(), invitations)
        }
    }

    async update(guild) {
        if (!client.isMainGuild(guild.id)) {
            return
        }

        const invitations = {}

        const invites = await guild.fetchInvites();
        invites.forEach(invite => {
            invitations[invite.code] = {
                code: invite.code,
                temporary: invite.temporary,
                maxAge: invite.maxAge,
                uses: invite.uses,
                maxUses: invite.maxUses,
                createdAt: invite.createdTimestamp,
                creatorId: invite.inviter ? invite.inviter.id : null,
                creatorName: invite.inviter ? invite.inviter.username : 'Widget',
                creatorBot: invite.inviter ? invite.inviter.bot : true,
            };
        });

        await client.provider.set(guild.id, this.getCacheKey(), invitations)

        return invitations
    }

    async get(guild) {
        if (!client.isMainGuild(guild.id)) {
            return
        }

        return await client.provider.get(guild.id, this.getCacheKey(), {})
    }

    async getScores(guild) {
        if (!client.isMainGuild(guild.id)) {
            return
        }

        return await client.provider.get(guild.id, this.getScoresCacheKey(), {})
    }

    async getIgnored(guild) {
        if (!client.isMainGuild(guild.id)) {
            return
        }

        return await client.provider.get(guild.id, this.getIgnoredCacheKey(), {})
    }

    async isIgnoredUser(guild, userId) {
        if (!client.isMainGuild(guild.id)) {
            return
        }

        const users = await this.getIgnored(guild);
        return typeof users[userId] !== 'undefined'
    }

    async getIgnoredUser(guild, userId) {
        if (!client.isMainGuild(guild.id)) {
            return
        }

        const users = await this.getIgnored(guild);
        return typeof users[userId] !== 'undefined' ? users[userId] : null
    }

    async ignoreUser(guild, userId, invitation) {
        if (!client.isMainGuild(guild.id)) {
            return
        }

        const users = await this.getIgnored(guild);
        users[userId] = {
            'userId': userId,
            'inviterId': invitation.creatorId,
            'inviterName':  invitation.creatorName,
            'createdAt': Math.ceil(new Date().getTime() / 1000),
            'invitationCode': invitation.code,
        };

        return await client.provider.set(guild.id, this.getIgnoredCacheKey(), users)
    }

    async incrementInviteCounter(guild, invitationCode, userId) {
        if (!client.isMainGuild(guild.id)) {
            return
        }

        const isIgnoredUser = await this.isIgnoredUser(guild, userId)
        if (isIgnoredUser) {
            return
        }

        const invitations = await this.get(guild)
        if (typeof invitations[invitationCode] === 'undefined') {
            return;
        }

        const invitation = invitations[invitationCode]

        const scores = await this.getScores(guild)
        if (typeof scores[invitation.creatorId] === 'undefined') {
            scores[invitation.creatorId] = {
                userId: invitation.creatorId,
                userName: invitation.creatorName,
                inviteCount: 0,
                leaveCount: 0,
                totalCount: 0,
            }
        }

        ++scores[invitation.creatorId]['inviteCount']
        ++scores[invitation.creatorId]['totalCount']

        await client.provider.set(guild.id, this.getScoresCacheKey(), scores)
        await this.ignoreUser(guild, userId, invitation)
    }

    async incrementLeaveCounter(guild, userId) {
        if (!client.isMainGuild(guild.id)) {
            return
        }

        const userData = await this.getIgnoredUser(guild, userId)
        if (!userData) {
            return
        }

        const invitations = await this.get(guild)
        if (typeof invitations[userData.invitationCode] === 'undefined') {
            return;
        }

        const invitation = invitations[userData.invitationCode]

        const scores = await this.getScores(guild)
        if (typeof scores[invitation.creatorId] === 'undefined') {
            scores[invitation.creatorId] = {
                userId: invitation.creatorId,
                userName: invitation.creatorName,
                inviteCount: 0,
                leaveCount: 0,
                totalCount: 0,
            }
        }

        ++scores[invitation.creatorId]['leaveCount']
        --scores[invitation.creatorId]['totalCount']

        await client.provider.set(guild.id, this.getScoresCacheKey(), scores)
    }
}

module.exports = InviteManager;
