const mTxServCommand = require('../mTxServCommand.js');
const Discord = require('discord.js')

module.exports = class AddGameCommand extends mTxServCommand {
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
				{
					key: 'emoji',
					prompt: 'Which emoji ?',
					type: 'string',
					validate: text => text.length >= 1,
				},
				{
					key: 'other',
					prompt: 'For other category ?',
					type: 'string',
					oneOf: ['yes', 'no'],
				},
				
			],
			ownerOnly: true,
			hidden: true,
			guarded: true,
			guildOnly: true,
		});
	}

	async run(msg, {game, color, emoji, other}) {
		if (msg.channel.type === 'dm') {
			return msg.say(`This command is only available is server`)
		}

		const roleMod = '833382326263742494';
		const roleFRPos = msg.guild.roles.cache.find(r => r.name === "FR").position

		let roleFRID;
		let roleENID;

		/*-----------------------*/
		/* Création role FR      */
		/*-----------------------*/

		await msg.guild.roles.create({
			data: {
				name: "[FR] " + game + " " + emoji,
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
					'SEND_MESSAGES',
				],
				mentionable: false,
				hoist: false,
				position: roleFRPos+1
			},
		})
		.then(role => roleFRID = role.id)
		.catch(console.error);


		/*-----------------------*/
		/* Création role EN      */
		/*-----------------------*/

		await msg.guild.roles.create({
			data: {
				name: "[EN] " + game + " " + emoji,
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
					'SEND_MESSAGES',
				],
				mentionable: false,
				hoist: false,
				position: roleFRPos+1
			},
		})
		.then(role => roleENID = role.id)
		.catch(console.error);


		if ( other === "no")
		{
			let catFRID;
			let catENID;

			/*-----------------------*/
			/* Création catégorie FR */
			/*-----------------------*/

			await msg.guild.channels.create("[FR] " + game + " " + emoji, { type: 'category', })
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

			await msg.guild.channels.create("[EN] " + game + " " + emoji, { type: 'category', })
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

			await msg.guild.channels.create("nouveautés" + "-" + game.toLowerCase(), { type: 'news', })
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
				await msg.guild.channels.create(name + "-" + game.toLowerCase(), { type: 'text', })
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

			await msg.guild.channels.create("news" + "-" + game.toLowerCase(), { type: 'news', })
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
				await msg.guild.channels.create(name + "-" + game.toLowerCase(), { type: 'text', })
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

		}
		else
		{
			/*-----------------------*/
			/* Création channels FR  */
			/*-----------------------*/
			let chanFRID
			const catOtherFR = '837759110166085712'
			await msg.guild.channels.create(game.toLowerCase(), { type: 'text', })
				.then( async channel => {
					await channel.setParent(catOtherFR);
					
					channel.createOverwrite(roleFRID, {
						'VIEW_CHANNEL'          : true,
					})

					channel.createOverwrite(roleMod, {
						'VIEW_CHANNEL'          : true,
					})

					chanFRID = channel.id
					
				})
				.catch(console.error);

			/*-----------------------*/
			/* Création channels EN  */
			/*-----------------------*/
			let chanENID
			const catOtherEN = '837759161629409301'
			await msg.guild.channels.create(game.toLowerCase(), { type: 'text', })
				.then( async channel => {
					await channel.setParent(catOtherEN);
					
					channel.createOverwrite(roleENID, {
						'VIEW_CHANNEL'          : true,
					})

					channel.createOverwrite(roleMod, {
						'VIEW_CHANNEL'          : true,
					})

					chanENID = channel.id
					
				})
				.catch(console.error);

			const fs = require('fs');
			let data = JSON.parse(fs.readFileSync('./game-roles.json', 'utf8'));
			
			data[data.length] = {"name": "[FR] " + game, "roleID" : roleFRID, "categories": ['',], "channel": chanFRID };
			data[data.length] = {"name": "[EN] " + game, "roleID" : roleENID, "categories": ['',], "channel": chanENID };
			
			fs.writeFileSync('./game-roles.json', JSON.stringify(data, null, 2));
		}


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

		return this.saySuccess(msg, `\`${game} ${emoji}\`` + ' role and channel added successfuly.')
	}
};
