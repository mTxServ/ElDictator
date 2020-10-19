const inviteRegex = /(https?:\/\/)?(www\.)?(discord\.(gg|io|me|li|club)|discordapp\.com\/invite|discord\.com\/invite)\/([a-zA-Z0-9\-]{2,32})/gi;
const botInvRegex = /(https?:\/\/)?discord(app)?\.com\/(api\/)?oauth2\/authorize\?([^ ]+)\/?/gi;

module.exports = class Util {
    static delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    static shorten(text, maxLen = 2000) {
        return text.length > maxLen ? `${text.substr(0, maxLen - 3)}...` : text;
    }

    static formatNumber(number, minimumFractionDigits = 0) {
        return Number.parseFloat(number).toLocaleString(undefined, {
            minimumFractionDigits,
            maximumFractionDigits: 2
        });
    }

    static formatNumberK(number) {
        return number > 999 ? `${(number / 1000).toLocaleString(undefined, { maximumFractionDigits: 1 })}K` : number;
    }

    static embedURL(title, url, display) {
        return `[${title}](${url.replace(/\)/g, '%27')}${display ? ` "${display}"` : ''})`;
    }

    static stripInvites(str, { guild = true, bot = true, text = '' } = {}) {
        if (guild) str = str.replace(inviteRegex, text);
        if (bot) str = str.replace(botInvRegex, text);
        return str;
    }

    static extractInviteLink(str) {
        const found = str.match(inviteRegex);
        return found && found.length ? found[0] : null;
    }
};