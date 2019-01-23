import Command from '../../system/Command';

class PermLevel extends Command {
	constructor(...args) {
		super(...args, {
			name: 'permlevel',
			aliases: ['pl', 'perm', 'perms'],
			description: 'Displays your permission level.',
			category: 'general',
			usage: 'permlevel',
			guildOnly: true,
		});
	}

	run(message, level) {
		const permLevel = this.client.config.permLevels.find(l => l.level === level).name;

		message.channel.send(`Your permission level is: ${level} - ${permLevel}`);
	}
}

export default PermLevel();
