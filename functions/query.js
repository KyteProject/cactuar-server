const sql = require('sqlite');

exports.createGuild = async () => {
	await sql.run(
		'CREATE TABLE IF NOT EXISTS guild_config (gID TEXT NOT NULL UNIQUE, prefix TEXT NOT NULL, feedbackChannel TEXT NOT NULL, botLogEnable INTEGER NOT NULL, modRole TEXT NOT NULL, adminRole TEXT NOT NULL, enableBadges INTEGER NOT NULL, deleteSwitch INTEGER NOT NULL, enableTokens, response TEXT NOT NULL, pinMessage INTEGER NOT NULL, messageID INTEGER,PRIMARY KEY(`gID`))'
	);
};

exports.createUser = async () => {
	await sql.run(
		'CREATE TABLE IF NOT EXISTS users (jID TEXT NOT NULL UNIQUE, name TEXT NOT NULL, level INTEGER NOT NULL, currentPoints INTEGER NOT NULL, totalPoints INTEGER NOT NULL, nextLevel INTEGER NOT NULL, tokens INTEGER NOT NULL, lastRequest TEXT, timesGiven INTEGER NOT NULL, timesRequested INTEGER NOT NULL, keywordCount INTEGER NOT NULL, PRIMARY KEY(`jID`))'
	);
};

exports.insertGuild = async (client, guild) => {
	await sql.run(
		'INSERT INTO guild_config (gID, prefix, feedbackChannel, botLogEnable, modRole, adminRole, enableBadges, deleteSwitch, enableTokens, response, pinMessage, messageID) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
		[
			guild.id,
			client.config.defaultSettings.prefix,
			client.config.defaultSettings.feedbackChannel,
			client.config.defaultSettings.botLogEnable,
			client.config.defaultSettings.modRole,
			client.config.defaultSettings.adminRole,
			client.config.defaultSettings.enableBadges,
			client.config.defaultSettings.deleteSwitch,
			client.config.defaultSettings.enableTokens,
			client.config.defaultSettings.response,
			client.config.defaultSettings.pinMessage,
			client.config.defaultSettings.messageID,
		]
	);
};

exports.insertUser = async member => {
	await sql.run(
		'INSERT INTO users (jID, name, level, currentPoints, totalPoints, nextLevel, tokens, lastRequest, timesGiven, timesRequested, keywordCount) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
		[
			member.joined, // jID
			member.user.tag, // name
			1, // level
			0, // current points
			0, // total points
			83, // next level
			0, // tokens
			null, // last request
			0, // times given
			0, // times requested
			0, // keyword count
		]
	);
};

exports.updateUser = async (client, message, type) => {
	if (type === 'submit') {
		await sql.run(
			'UPDATE users SET level=?, currentPoints=?, totalPoints=?, nextLevel=?, tokens=?, timesGiven=?, keywordCount=? WHERE jID=?',
			[
				message.level,
				message.currentPoints,
				message.totalPoints,
				message.nextLevel,
				message.tokens,
				message.timesGiven,
				message.keywordCount,
				message.member.joined,
			]
		);
	} else if (type === 'request') {
		await sql.run('UPDATE users SET timesRequested=?, tokens=?, lastRequest=?, keywordCount=? WHERE jID=?', [
			message.timesRequested,
			message.tokens,
			message.createdAt.toString(),
			0,
			message.member.joined,
		]);
		await sql.run('UPDATE guild_config SET messageID=? WHERE gID=?', [message.id, message.guild.id]);
	} else {
		client.console.log('not type provided', 'error');
	}
	client.logger.log(`[DB] User: ${message.author.tag} submitted feedback, databse updated.`);
};

exports.setConf = async (client, message, settings) => {
	await sql.run(
		'UPDATE guild_config SET prefix=?, feedbackChannel=?, botLogEnable=?, modRole=?, adminRole=?, enableBadges=?, deleteSwitch=?, enableTokens=?, response=?, pinMessage=?, messageID=? WHERE gID=?',
		[
			settings.prefix,
			settings.feedbackChannel,
			settings.botLogEnable,
			settings.modRole,
			settings.adminRole,
			settings.enableBadges,
			settings.deleteSwitch,
			settings.enableTokens,
			settings.response,
			settings.pinMessage,
			settings.messageID,
			message.guild.id,
		]
	);
};

exports.guildCheck = async (client, guild) => {
	await sql
		.get(`SELECT * FROM guild_config WHERE gID = "${guild.id}"`)
		.then(row => {
			if (!row) {
				client.query.insertGuild(client, guild);
			}
		})
		.catch(() => {
			console.error;
			client.query.createGuild().then(() => {
				client.query.insertGuild(client, guild);
			});
		});
};

exports.loadConfig = async (client, message) => {
	await sql
		.get(`SELECT * FROM guild_config WHERE gID = "${message.guild.id}"`)
		.then(row => {
			if (row) {
				message.settings = row;
			} else {
				message.settings = client.config.defaultSettings;
			}
		})
		.catch(() => {
			console.error;
		});
};

exports.loadGuilds = async (client, message) => {
	await sql
		.get(`SELECT * FROM guild_config WHERE gID = "${message.guild.id}"`)
		.then(row => {
			if (row) {
				message.settings = row;
			} else {
				message.settings = client.config.defaultSettings;
			}
		})
		.catch(() => {
			console.error;
		});
};

exports.feedbackSubmit = async (client, message) => {
	await sql
		.get(`SELECT * FROM users WHERE jID = "${message.member.joined}"`)
		.then(row => {
			if (!row) {
				client.query.insertUser(message.member).then(() => {
					client.query.feedbackSubmit(client, message);
				});
			} else {
				client.levelUp(message, row);
				client.query.updateUser(client, message, 'submit');
			}
		})
		.catch(() => {
			console.error;
			client.query.createUser().then(() => {
				client.query.insertUser(message.member).then(() => {
					client.query.feedbackSubmit(client, message);
				});
			});
		});
};

exports.feedbackRequest = async (client, message) => {
	await sql
		.get(`SELECT * FROM users WHERE jID = "${message.member.joined}"`)
		.then(row => {
			if (!row) {
				client.query.insertUser(message.member).then(() => {
					client.query.feedbackRequest(client, message);
				});
			} else {
				client.feedbackPermission(message, row);
			}
		})
		.catch(() => {
			console.error;
			client.query.createUser().then(() => {
				client.query.insertUser(message.member).then(() => {
					client.query.feedbackRequest(client, message);
				});
			});
		});
};

exports.userToken = async (client, target, row) => {
	await sql.run('UPDATE users SET tokens=? WHERE jID=?', [row.tokens, target.joined]);
};
