const { MessageEmbed } = require('discord.js');

exports.run = async (client, message, args, level) => {
	const embed = new MessageEmbed()
		.setAuthor('Server info')
		.setColor(15946079)
		.setDescription(`Owner: ${message.guild.owner.user.tag} (${message.guild.owner.id})`)
		.addField(
			'Member Count',
			`${message.guild.memberCount -
				message.guild.members.filter(m => m.user.bot).size} + ${message.guild.members.filter(m => m.user.bot)
				.size} bots`,
			true
		)
		.addField('Location', message.guild.region, true)
		.addField('Created', message.guild.createdAt.toLocaleString(), true)
		.addField(
			'Channels',
			`${message.guild.channels.filter(chan => chan.type === 'voice')
				.size} voice / ${message.guild.channels.filter(chan => chan.type === 'text').size} text`,
			true
		)
		.addField('Roles', message.guild.roles.size, true);
	message.channel.send({ embed });
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: ['si', 'guildinfo', 'gi', 'serverstats', 'guildstats'],
	permLevel: 'User',
	botPerms: ['EMBED_LINKS'],
};

exports.help = {
	name: 'serverinfo',
	category: 'System',
	description: 'Displays server information.',
	extended: 'This command will output an organised list of statistics related to the server the bot is running on.',
	usage: 'serverinfo',
};
