import { version, MessageEmbed } from 'discord.js';
import Command from './../../system/Command';
const moment = require('moment');
require('moment-duration-format');

class Stats extends Command {
	constructor(...args) {
		super(...args, {
			name: 'stats',
			description: 'Provides statistics on the bot.',
			usage: 'stats',
			aliases: ['bs'],
			category: 'general',
		});
	}

	run(message) {
		const duration = moment.duration(this.client.uptime).format(' D [days], H [hrs], m [mins], s [secs]');

		const embed = new MessageEmbed()
			.setDescription(
				`\`\`\`asciidoc\n= STATISTICS =
• Mem Usage  :: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB
• Uptime     :: ${duration}
• Users      :: ${this.client.users.size.toLocaleString()}
• Servers    :: ${this.client.guilds.size.toLocaleString()}
• Channels   :: ${this.client.channels.size.toLocaleString()}
• Discord.js :: v${version}
• Node       :: ${process.version}
• Bot        :: v${this.client.config.version}\`\`\``
			)
			.setColor('00d919');

		message.channel.send({ embed });
	}
}

export default Stats();
