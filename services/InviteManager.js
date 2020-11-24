class InviteManager {
    constructor() {

    }

    getCacheKey() {
        return isDev ? 'invites_dev' : 'invites'
    }

    async warmup() {
        const guilds = client.guilds.cache.array()
        for (const guild of guilds) {
            if (client.isMainGuild(guild.id)) {
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
    }

    async update(guild) {
        if (client.isMainGuild(guild.id)) {
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
}

module.exports = InviteManager;
