module.exports = {
    run: async (member) => {
        if (member.user.bot) {
            return
        }

        const oldInvitations = await client.inviteManager.get(member.guild)
        const newInvitations = await client.inviteManager.update(member.guild)

        // Look through the invites, find the one for which the uses went up.
        const invitationFiltered = Object.values(newInvitations).filter(i => oldInvitations[i.code].uses < i.uses);
        if (!invitationFiltered.length) {
            return;
        }

        const invitation = invitationFiltered[0];

        client.inviteManager.incrementUser(member.guild, invitation.code)

        if (client.channels.cache.has(process.env.LOG_CHANNEL_ID)) {
            client
                .channels
                .cache
                .get(process.env.LOG_CHANNEL_ID)
                .send(null, {
                    embed: {
                        color: 'BLUE',
                        timestamp: new Date(),
                        description: `**${member.user.tag}** joined using invite code \`${invitation.code}\` from **${invitation.creatorName}**. Invite was used **${invitation.uses} times** since its creation.`,
                    }
                })
                .catch(console.error);
        }
    }
};