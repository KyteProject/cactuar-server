exports.run = async (client, message, args, level) => {
	message.channel.send('Pong...').then(msg => {
		msg.edit(
			`Pong! Latency is ${msg.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(
				client.ping
			)}ms`
		);
	});
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: [],
	permLevel: 'Moderator',
	botPerms: [],
};

exports.help = {
	name: 'ping',
	category: 'System',
	description: 'Latency and API response times.',
	extended:
		'This command is a response test, it helps gauge if there is any latency (lag) in either the bots connection, or the API.',
	usage: 'ping',
};
