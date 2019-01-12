const sql = require('sqlite');

exports.run = async (client, message, args, level) => {
	if (message.settings.enableTokens === 0) return message.reply('Tokens have been disabled in guild config.');
	if (!args[0]) return message.reply('Please provide an operator.');
	const target = message.mentions.members.first();
	if (!target) return message.reply('Please provide a target user.');
	target.joined = `${message.guild.id}-${target.id}`;

	if (args[0] === 'add') {
		await sql
			.get(`SELECT * FROM users WHERE jID = "${target.joined}"`)
			.then(row => {
				if (!row) {
					client.query.insertUser(target).then(() => {
						message.reply(
							'User not in database for some reason, a new record has been created. Please run the command again.'
						);
					});
				} else {
					row.tokens++;
					client.query.userToken(client, target, row);
					message.channel.send('Token has been added.');
				}
			})
			.catch(() => {
				console.error;
				client.query.createUser().then(() => {
					client.query.insertUser(target);
				});
			});
	} else if (args[0] === 'remove') {
		await sql
			.get(`SELECT * FROM users WHERE jID = "${target.joined}"`)
			.then(row => {
				if (!row) {
					client.query.insertUser(target).then(() => {
						message.reply(
							'User not in database for some reason, a new record has been created. Please run the command again.'
						);
					});
				} else {
					row.tokens = 0;
					client.query.userToken(client, target, row);
					message.channel.send('Token count has been reset.');
				}
			})
			.catch(() => {
				console.error;
				client.query.createUser().then(() => {
					client.query.insertUser(target);
				});
			});
	} else if (args[0] === 'check') {
		await sql
			.get(`SELECT * FROM users WHERE jID = "${target.joined}"`)
			.then(row => {
				if (!row) {
					client.query.insertUser(target).then(() => {
						message.reply(
							'User not in database for some reason, a new record has been created. Please run the command again.'
						);
					});
				} else {
					message.channel.send(`User has ${row.tokens} tokens.`);
				}
			})
			.catch(() => {
				console.error;
				client.query.createUser().then(() => {
					client.query.insertUser(target);
				});
			});
	} else {
		message.channel.send('Invalid command argument.');
	}
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: [''],
	permLevel: 'Moderator',
	botPerms: [],
};

exports.help = {
	name: 'token',
	category: 'Feedback',
	description: 'Command for managing user tokens.',
	extended:
		'This command allows guild staff to add, remove and check user tokens.  Tokens can be used to bypass the checks, good for resolving issues or rewarding users.',
	usage: 'token [add/remove/check] [@user]',
};
