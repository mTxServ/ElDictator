module.exports = {
    run: async (oldMember, newMember) => {
        if (client.isMainGuild(newMember.guild.id)) {
            const hadRole = oldMember.roles.cache.find(role => role.name === 'VIP ★');
            const hasRole = newMember.roles.cache.find(role => role.name === 'VIP ★');

            if (!hadRole && hasRole) {
                console.log(`${newMember.username} boosted ${newMember.guild.name}`)

                await client.provider.set(isDev ? 'giveaway_boost_dev' : 'giveaway_boost', newMember.user.id, {
                    userId: newMember.user.id,
                    userName: newMember.user.tag,
                    guildName: newMember.guild.name,
                    createdAt: Math.ceil(new Date().getTime() / 1000),
                })

                if (client.channels.cache.has(process.env.LOG_CHANNEL_ID)) {
                    client
                        .channels
                        .cache
                        .get(process.env.LOG_CHANNEL_ID)
                        .send(null, {
                            embed: {
                                color: 'BLUE',
                                timestamp: new Date(),
                                description: `**${newMember.user.tag}** boosted \`${newMember.guild.name}\`.`,
                            }
                        })
                        .catch(console.error);
                }
            }
        }
    }
};