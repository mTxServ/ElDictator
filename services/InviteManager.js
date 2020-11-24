class InviteManager {
    constructor() {

    }

    getCacheKey() {
        return isDev ? 'invites_dev' : 'invites'
    }

    getScoresCacheKey() {
        return isDev ? 'scores_invites_dev' : 'scores_invites'
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
                if (invite.temporary || !invite.inviter || invite.inviter.bot) {
                    return;
                }

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
            if (invite.temporary || !invite.inviter || invite.inviter.bot) {
                return;
            }

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

    async incrementUser(guild, invitationCode) {
        if (!client.isMainGuild(guild.id)) {
            return
        }

        const invitations = await this.get(guild)
        if (typeof invitations[invitationCode] === 'undefined') {
            return;
        }

        const invitation = invitations[invitationCode]

        const scores = await this.getScores(guild)
        scores[invitation.creatorId] = ++scores[invitation.creatorId] || 1;

        await client.provider.set(guild.id, this.getScoresCacheKey(), scores)
    }
}

module.exports = InviteManager;
