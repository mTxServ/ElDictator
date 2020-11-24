module.exports = {
    run: async (member) => {
        if (member.user.bot) {
            return
        }

        if (!client.isMainGuild(member.guild.id)) {
            return
        }

        client.inviteManager.incrementLeaveCounter(member.guild, member.user.id)
    }
};