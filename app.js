require(`${process.cwd()}/modules/Prototypes.js`);
if (Number(process.version.slice(1).split('.')[0]) < 8) throw new Error('Node 8.0.0 or higher is required.');
const Cactuar = require('./system/Cactuar');
const sql = require('sqlite');
const mongo = require('mongoose');

const client = new Cactuar({
	fetchAllMembers: false,
	disableEveryone: true,
	disabledEvents: [
		'GUILD_BAN_REMOVE',
		'TYPING_START',
		'USER_NOTE_UPDATE',
		'USER_SETTINGS_UPDATE',
		'VOICE_SERVER_UPDATE',
		'VOICE_STATE_UPDATE',
	],
	messageCacheSize: 100,
	messageCacheLifetime: 240,
	messageSweepInterval: 150,
});

require(`${process.cwd()}/functions/feedback.js`)(client);
require(`${process.cwd()}/functions/util.js`)(client);

if (sql.open(`${process.cwd()}/database/feedbot.sqlite`)) {
	client.logger.log('SQLite DB loaded.');
}

mongo
	.connect(client.config.mongoURI, { useNewUrlParser: true })
	.then(() => console.log('MongoDB Connected'))
	.catch(err => console.log(err));

client.login(client.config.token);

client
	.on('disconnect', () => client.logger.warn('Bot is disconnecting...'))
	.on('reconnect', () => client.logger.log('Bot reconnecting...', 'log'))
	.on('error', error => client.logger.error(error))
	.on('warn', info => client.logger.warn(info));
