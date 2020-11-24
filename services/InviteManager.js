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
                    invitations[invite.code] = {
                        code: invite.code,
                        temporary: invite.temporary,
                        maxAge: invite.maxAge,
                        uses: invite.uses,
                        maxUses: invite.maxUses,
                        createdAt: invite.createdTimestamp,
                        creatorId: invite.inviter ? invite.inviter.id : null,
                        creatorName: invite.inviter ? invite.inviter.username : null,
                        creatorBot: invite.inviter ? invite.inviter.bot : false,
                    };
                });

                await client.provider.set(guild.id, this.getCacheKey(), invitations)
            }
        }
    }
}

module.exports = InviteManager;
