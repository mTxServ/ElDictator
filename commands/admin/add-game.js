const mTxServCommand = require('../mTxServCommand.js');
const Discord = require('discord.js')

module.exports = class BotStopCommand extends mTxServCommand {
	constructor(client) {
		super(client, {
			name: 'add-game',
			aliases: ['add-role', 'ajouter-jeu'],
			group: 'admin',
			memberName: 'add-game',
			description: 'Add a new game on the discord',
			clientPermissions: ['ADMINISTRATOR'],
			args: [
				{
					key: 'game',
					prompt: 'Which game ?',
					type: 'string',
					validate: text => text.length >= 1,
				},
				{
					key: 'color',
					prompt: 'Which color ?',
					type: 'string',
					validate: text => text.length >= 1,
				},
				
			],
			ownerOnly: true,
			hidden: true,
			guarded: true,
			guildOnly: true,
		});
	}

	async run(msg, {game, color}) {
		if (msg.channel.type === 'dm') {
			return msg.say(`This command is only available is server`)
		}

		const roleMod = '833382326263742494';

		let roleFRID;
		let roleENID;
		

		/*-----------------------*/
		/* Création role FR      */
		/*-----------------------*/

		await msg.guild.roles.create({
			data: {
				name: "[FR] " + game,
				color: color,
				permissions:
				[
					'ADD_REACTIONS',
					'STREAM',
					'EMBED_LINKS',
					'ATTACH_FILES',
					'READ_MESSAGE_HISTORY',
					'USE_EXTERNAL_EMOJIS',
					'CONNECT',
					'SPEAK',
					'USE_VAD',
				],
				mentionable: false,
				hoist: true,
			},
		})
		.then(role => roleFRID = role.id)
		.catch(console.error);


		/*-----------------------*/
		/* Création role EN      */
		/*-----------------------*/

		await msg.guild.roles.create({
			data: {
				name: "[EN] " + game,
				color: color,
				permissions:
				[
					'ADD_REACTIONS',
					'STREAM',
					'EMBED_LINKS',
					'ATTACH_FILES',
					'READ_MESSAGE_HISTORY',
					'USE_EXTERNAL_EMOJIS',
					'CONNECT',
					'SPEAK',
					'USE_VAD',
				],
				mentionable: false,
				hoist: true,
			},
		})
		.then(role => roleENID = role.id)
		.catch(console.error);


		let catFRID;
		let catENID;

		/*-----------------------*/
		/* Création catégorie FR */
		/*-----------------------*/

		await msg.guild.channels.create("[FR] " + game, { type: 'category', })
			.then(channel => {
				channel.createOverwrite(msg.guild.roles.everyone, {
					'VIEW_CHANNEL'          : false,
				})

				channel.createOverwrite(roleFRID, {
					'VIEW_CHANNEL'          : true,
				})

				channel.createOverwrite(roleMod, {
					'VIEW_CHANNEL'          : true,
				})

				catFRID = channel.id;
			})
			.catch(console.error);
	

		/*-----------------------*/
		/* Création catégorie EN */
		/*-----------------------*/

		await msg.guild.channels.create("[EN] " + game, { type: 'category', })
			.then(channel => {
				channel.createOverwrite(msg.guild.roles.everyone, {
					'VIEW_CHANNEL'          : false,
				})

				channel.createOverwrite(roleENID, {
					'VIEW_CHANNEL'          : true,
				})

				channel.createOverwrite(roleMod, {
					'VIEW_CHANNEL'          : true,
				})

				catENID = channel.id;
			})
			.catch(console.error);

		/*-----------------------*/
		/* Création channels FR  */
		/*-----------------------*/

		await msg.guild.channels.create("nouveautés", { type: 'news', })
			.then( async channel => {
				await channel.setParent(catFRID);

				channel.createOverwrite(msg.guild.roles.everyone, {
					'VIEW_CHANNEL'          : false,
					'SEND_MESSAGES'         : false,
					'EMBED_LINKS'           : false,
					'ATTACH_FILES'          : false,
				})

				channel.createOverwrite(roleFRID, {
					'VIEW_CHANNEL'          : true,
				})

				channel.createOverwrite(roleMod, {
					'VIEW_CHANNEL'          : true,
				})
			})
			.catch(console.error);

		const tabChanFR = ["discussion", "entraide", "serveurs"];

		tabChanFR.forEach( async name => {
			await msg.guild.channels.create(name, { type: 'text', })
				.then( async channel => {
					await channel.setParent(catFRID);
					await channel.lockPermissions();

					if (name === "serveurs")
						await channel.setRateLimitPerUser(6*60*60 , "slowmode");
				})
				.catch(console.error);
		});

		await msg.guild.channels.create(game + " #1", { type: 'voice', })
				.then( async channel => {
					await channel.setParent(catFRID);
					await channel.lockPermissions();
				})
				.catch(console.error);


		/*-----------------------*/
		/* Création channels EN  */
		/*-----------------------*/

		await msg.guild.channels.create("news", { type: 'news', })
			.then( async channel => {
				await channel.setParent(catENID);

				channel.createOverwrite(msg.guild.roles.everyone, {
					'VIEW_CHANNEL'          : false,
					'SEND_MESSAGES'         : false,
					'EMBED_LINKS'           : false,
					'ATTACH_FILES'          : false,
				})

				channel.createOverwrite(roleENID, {
					'VIEW_CHANNEL'          : true,
				})

				channel.createOverwrite(roleMod, {
					'VIEW_CHANNEL'          : true,
				})
			})
			.catch(console.error);

		const tabChanEN = ["discussion", "help", "servers"];

		tabChanEN.forEach( async name => {
			await msg.guild.channels.create(name, { type: 'text', })
				.then( async channel => {
					await channel.setParent(catENID);
					await channel.lockPermissions();

					if (name === "servers")
						await channel.setRateLimitPerUser(6*60*60 , "slowmode");
				})
				.catch(console.error);
		});

		await msg.guild.channels.create(game + " #1", { type: 'voice', })
				.then( async channel => {
					await channel.setParent(catENID);
					await channel.lockPermissions();
				})
				.catch(console.error);


		/*------------------------*/
		/* Mise à jour liste role */
		/*------------------------*/

		const fs = require('fs');
		let data = JSON.parse(fs.readFileSync('./game-roles.json', 'utf8'));
		
		data[data.length] = {"name": "[FR] " + game, "roleID" : roleFRID, "categories": [catFRID,] };
		data[data.length] = {"name": "[EN] " + game, "roleID" : roleENID, "categories": [catENID,] };
		
		fs.writeFileSync('./game-roles.json', JSON.stringify(data, null, 2));



		/*---------------------------------------*/
		/* Mise à jour perm catégorie général FR */
		/*---------------------------------------*/

		const tabCatFR = ['833377601060864041', '833375133103816707', '833375133103816708']

		tabCatFR.forEach( async id => {
			await msg.guild.channels.cache.get(id).createOverwrite(roleFRID, {
				'VIEW_CHANNEL'          : true,
			})
		});

		const tabChanAdminFR = ['833377409046413333', '833377427123863593'];

		tabChanAdminFR.forEach( async id => {
			await msg.guild.channels.cache.get(id).createOverwrite(roleFRID, {
				'VIEW_CHANNEL'          : true,
			})
		})

		/*---------------------------------------*/
		/* Mise à jour perm catégorie général EN */
		/*---------------------------------------*/

		const tabCatEN = ['833380811318362143', '833380811318362143', '833375133103816708']

		tabCatEN.forEach( async id => {
			await msg.guild.channels.cache.get(id).createOverwrite(roleENID, {
				'VIEW_CHANNEL'          : true,
			})
		});


		const tabChanAdminEN = ['833381005753843783', '833381059688398908'];

		tabChanAdminEN.forEach( async id => {
			await msg.guild.channels.cache.get(id).createOverwrite(roleENID, {
				'VIEW_CHANNEL'          : true,
			})
		});

		return this.saySuccess(msg, `\`${game}\`` + ' role and channel added successfuly.')
	}
};
