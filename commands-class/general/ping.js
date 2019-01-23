import Command from '../../system/Command';

class PermLevel extends Command {
	constructor(...args) {
		super(...args, {
			name: 'ping',
			description: 'Latency and API response time.',
			category: 'general',
			usage: 'ping',
		});
	}

	run(message) {
		message.channel.send('Pong...').then(msg => {
			msg.edit(
				`Pong! Latency is ${msg.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(
					this.client.ping
				)}ms`
			);
		});
	}
}

export default PermLevel();
