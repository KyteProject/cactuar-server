const Youtube = require('../../system/Youtube');
const ActivityUpdate = require('../../system/ActivityUpdate');

exports.run = async (client, message, args, level) => {
	const song = await Youtube.search(ActivityUpdate.presence.activity.name, message);

	message.channel.send(
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
};

exports.help = {
	name: 'song',
	category: 'Miscelaneous',
	description: 'Display the current song and attempt to get youtube link.',
	extended: '',
	usage: 'song',
};
