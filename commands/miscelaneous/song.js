const Youtube = require('../../system/Youtube');
const ActivityUpdate = require('../../system/ActivityUpdate');

exports.run = async (client, message, args, level) => {
	if (ActivityUpdate.presence.activity.name === 'feedback') {
		return message.channel.send('Not currently listening to anything!');
	}

	const song = await Youtube.search(ActivityUpdate.presence.activity.name, message);

	return message.channel.send(
		`Currently listening to: **${ActivityUpdate.presence.activity
			.name}**\n\nhttps://www.youtube.com/watch?v=${song}`
	);
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: ['track'],
	permLevel: 'User',
	botPerms: [],
	cooldown: 10,
};

exports.help = {
	name: 'song',
	category: 'Miscelaneous',
	description: 'Display the current song and attempt to get youtube link.',
	extended: '',
	usage: 'song',
};
