const sql = require('sqlite');
const { MessageEmbed } = require('discord.js');

exports.run = async (client, message, args, level) => {
	const embed = new MessageEmbed()
		.setAuthor(`Top 10 Rankings - ${message.guild.name}`, client.user.avatarURL())
		.setColor('00d919');

	let x = 1;
	await sql.each(
		`SELECT * FROM users WHERE instr(jID, "${message.guild.id}") ORDER BY totalPoints DESC LIMIT 10`,
		(err, row) => {
			if (err) {
				console.log(err);
			}
			embed.addField(
				`${x}: ${row.name}`,
				`Level: ${row.level} || Points: ${row.currentPoints}/${row.nextLevel} (${row.totalPoints} total)`
			);
			x++;
		}
	);

	message.channel.send({ embed });
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: ['top10', 'leaderboard', 'rankings', 'lb', 't10'],
	permLevel: 'User',
	botPerms: [],
};

exports.help = {
	name: 'ranking',
	category: 'Feedback',
	description: 'Displays top 10 ranked users in your guild.',
	extended: '...',
	usage: 'ranking',
};
