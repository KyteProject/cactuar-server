import Command from '../../system/Command';
import { MessageEmbed } from 'discord.js';

class ServerInfo extends Command {
	constructor(...args) {
		super(...args, {
			name: 'serverinfo',
			aliases: ['info', 'si'],
			description: 'Displays some information on the server.',
			category: 'general',
			usage: 'serverinfo',
			guildOnly: true,
		});
	}

	run(message) {
		const embed = new MessageEmbed()
			.setAuthor('Server info')
			.setColor(15946079)
			.setDescription(`Owner: ${message.guild.owner.user.tag} (${message.guild.owner.id})`)
			.addField(
				'Member Count',
				`${message.guild.memberCount -
					message.guild.members.filter(m => m.user.bot).size} + ${message.guild.members.filter(
					m => m.user.bot
				).size} bots`,
				true
			)
			.addField('Location', message.guild.region, true)
			.addField('Created', message.guild.createdAt.toLocaleString(), true)
			.addField(
				'Channels',
				`${message.guild.channels.filter(chan => chan.type === 'voice')
					.size} voice / ${message.guild.channels.filter(chan => chan.type === 'text').size} text`,
				true
			);
		message.channel.send({ embed });
	}
}

export default ServerInfo();
