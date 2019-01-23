import Command from '../../system/Command';

class Reboot extends Command {
	constructor(...args) {
		super(...args, {
			name: 'reboot',
			aliases: ['restart'],
			description: 'Restarts the bot.',
			category: 'system',
			usage: 'reboot',
			permLevel: 'Bot Admin',
		});
	}

	async run(message) {
		await message.channel.send('Bot is shutting down...').catch(err => this.client.logger.log(err));
		process.exit(1);
	}
}

export default Reboot();
