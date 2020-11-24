module.exports = {
    run: (oldMember, newMember) => {
        if (client.isMainGuild(newMember.guild.id)) {
            const hadRole = oldMember.roles.cache.find(role => role.name === 'VIP ★');
            const hasRole = newMember.roles.cache.find(role => role.name === 'VIP ★');

            if (!hadRole && hasRole) {
                console.log(`${newMember.username} boosted ${newMember.guild.name}`)
            }
        }
    }
};