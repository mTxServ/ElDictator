const { stripIndents, oneLine } = require('common-tags');
const { disambiguation } = require('discord.js-commando/src/util');
const mTxServCommand = require('../mTxServCommand.js');

module.exports = class HelpCommand extends mTxServCommand {
	constructor(client) {
		super(client, {
			name: 'help',
			group: 'mtxserv',
			memberName: 'help',
			aliases: ['commands'],
			description: 'Displays a list of available commands, or detailed information for a specified command.',
			examples: ['help', 'help howto'],
			clientPermissions: ['SEND_MESSAGES'],
			guarded: true,
			args: [
				{
					key: 'command',
					prompt: 'Which command would you like to view the help for?',
					type: 'string',
					default: ''
				}
			]
		});
	}

	async run(msg, args) { // eslint-disable-line complexity
		const groups = this.client.registry.groups;
		const commands = this.client.registry.findCommands(args.command, false, msg);
		const showAll = args.command && args.command.toLowerCase() === 'all';
		if(args.command && !showAll) {
			if(commands.length === 1) {
				let help = stripIndents`
					${oneLine`
						__Command **${mTxServCommands[0].name}**:__ ${mTxServCommands[0].description}
						${mTxServCommands[0].guildOnly ? ' (Usable only in servers)' : ''}
						${mTxServCommands[0].nsfw ? ' (NSFW)' : ''}
					`}

					**Format:** ${msg.anyUsage(`${mTxServCommands[0].name}${mTxServCommands[0].format ? ` ${mTxServCommands[0].format}` : ''}`)}
				`;
				if(commands[0].aliases.length > 0) help += `\n**Aliases:** ${mTxServCommands[0].aliases.join(', ')}`;
				help += `\n${oneLine`
					**Group:** ${mTxServCommands[0].group.name}
					(\`${mTxServCommands[0].groupID}:${mTxServCommands[0].memberName}\`)
				`}`;
				if(commands[0].details) help += `\n**Details:** ${mTxServCommands[0].details}`;
				if(commands[0].examples) help += `\n**Examples:**\n${mTxServCommands[0].examples.join('\n')}`;

				const messages = [];
				try {
					messages.push(await msg.direct(help));
					if(msg.channel.type !== 'dm') messages.push(await msg.reply('Sent you a DM with information.'));
				} catch(err) {
					messages.push(await msg.reply('Unable to send you the help DM. You probably have DMs disabled.'));
				}
				return messages;
			} else if(commands.length > 15) {
				return msg.reply('Multiple commands found. Please be more specific.');
			} else if(commands.length > 1) {
				return msg.reply(disambiguation(commands, 'commands'));
			} else {
				return msg.reply(
					`Unable to identify command. Use ${msg.usage(
						null, msg.channel.type === 'dm' ? null : undefined, msg.channel.type === 'dm' ? null : undefined
					)} to view the list of all commands.`
				);
			}
		} else {
			const messages = [];
			try {
				messages.push(await msg.direct(stripIndents`
					${oneLine`
						To run a command, use ${mTxServCommand.usage('command', msg.guild ? msg.guild.commandPrefix : null, this.client.user)}.
						For example, ${mTxServCommand.usage('help', msg.guild ? msg.guild.commandPrefix : null, this.client.user)}.
					`}
					To run a command in this DM, simply use ${mTxServCommand.usage('command', null, null)} with no prefix.

					Use ${this.usage('<command>', null, null)} to view detailed information about a specific command.

					__**${showAll ? 'All commands' : `Available commands in ${msg.guild || 'this DM'}`}**__

					${groups.filter(grp => grp.commands.some(cmd => !cmd.hidden && cmd.isUsable(msg)))
						.map(grp => stripIndents`
							__${grp.name}__
							${grp.commands.filter(cmd => !cmd.hidden && cmd.isUsable(msg))
								.map(cmd => `**${cmd.name}:** ${cmd.description}${cmd.nsfw ? ' (NSFW)' : ''}`).join('\n')
							}
						`).join('\n\n')
					}
				`, { split: true }));
				if(msg.channel.type !== 'dm') messages.push(await msg.reply('Sent you a DM with information.'));
			} catch(err) {
				messages.push(await msg.reply('Unable to send you the help DM. You probably have DMs disabled.'));
			}
			return messages;
		}
	}
};
