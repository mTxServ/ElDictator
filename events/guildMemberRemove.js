module.exports = {
    run: async (member) => {
        return
        
        if (member.user.bot) {
            return
        }

        if (!client.isMainGuild(member.guild.id)) {
            return
        }

        client.inviteManager.incrementLeaveCounter(member.guild, member.user.id)
    }
};
