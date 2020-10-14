const { stripIndents, oneLine } = require('common-tags');
const { disambiguation } = require('discord.js-commando/src/util');
const mTxServCommand = require('../mTxServCommand.js');
const Discord = require('discord.js');

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

		const lang = require(`../../languages/${this.resolveLangOfMessage(msg)}.json`);

		if(args.command && !showAll) {
			if(commands.length === 1) {
				const embed = new Discord.MessageEmbed()
					.setTitle(':question: ' + commands[0].name)
					.setColor('BLUE')
					.setDescription(stripIndents`
					${commands[0].description}
					${oneLine`
						${commands[0].guildOnly ? ' (Usable only in servers)' : ''}
						${commands[0].nsfw ? ' (NSFW)' : ''}
					`}`)
					.addField('Format', `${msg.anyUsage(`${commands[0].name}${commands[0].format ? `${commands[0].format}` : ''}`)}`)
				;


				if(commands[0].aliases.length)  {
					embed.addField('Aliases', commands[0].aliases.join(', '))
				}

				if(commands[0].details)  {
					embed.addField('Details', commands[0].details)
				}

				if(commands[0].examples)  {
					embed.addField('Examples', commands[0].examples.join('\n'))
				}

				try {
					if(msg.channel.type !== 'dm') await msg.reply(lang['help']['sent_dm']);

					return msg.author.send({
						embed
					});
				} catch(err) {
					return msg.reply(lang['help']['dm_closed']);
				}
			} else if(commands.length > 15) {
				return msg.reply(lang['help']['multiple_commands']);
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
			try {
				const embed = new Discord.MessageEmbed()
					.setTitle(':question: Help')
					.setColor('BLUE')
					.setDescription(stripIndents`
					${oneLine`
						To run a command, use ${mTxServCommand.usage('command', msg.guild ? msg.guild.commandPrefix : null, this.client.user)}.
						, for example, ${mTxServCommand.usage('help', msg.guild ? msg.guild.commandPrefix : null, this.client.user)}.
					`}
					
					To run a command in this DM, simply use ${mTxServCommand.usage('command', null, null)} with no prefix.

					Use ${this.usage('<command>', null, null)} to view detailed information about a specific command.

					__**${showAll ? 'All commands' : `Available commands in ${msg.guild || 'this DM'}`}**__

					${groups.filter(grp => grp.commands.some(cmd => !cmd.hidden && cmd.isUsable(msg)))
						.map(grp => stripIndents`
							**__${grp.name}__**
							${grp.commands.filter(cmd => !cmd.hidden && cmd.isUsable(msg))
							.map(cmd => `**${cmd.name}:** ${cmd.description}${cmd.nsfw ? ' (NSFW)' : ''}`).join('\n')
						}
						`).join('\n\n')
					}
				`)
				;

				if(msg.channel.type !== 'dm') await msg.reply(lang['help']['sent_dm']);

				return msg.author.send({
					embed
				});
			} catch(err) {
				return msg.reply(lang['help']['dm_closed']);
			}
		}
	}
};
