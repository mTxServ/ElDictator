const LANGUAGE = `guild_lang_%id%`

module.exports = class GuildSetting {
    language(guidId) {
        return client.settings.get(LANGUAGE.replace('%id%', guidId), process.env.DEFAULT_LANG)
    }

    setLanguage(guildId, language) {
        client.settings.set(LANGUAGE.replace('%id%', guildId), language)
    }
};