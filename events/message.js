const commandHandler = require(`${process.cwd()}/functions/command.js`);

module.exports = class {
	constructor(client) {
		this.client = client;
	}

	async run(message) {
		if (message.author.bot) return;

		if (message.channel.type === 'dm') {
			commandHandler.run(this.client, message).catch(error => {
				this.client.logger.log(error, 'error');
			});
		} else {
			await this.client.query.loadConfig(this.client, message);
			message.member.joined = `${message.member.guild.id}-${message.member.id}`;

			if (message.content.indexOf(message.settings.prefix) === 0 && message.content.length > 1) {
				commandHandler.run(this.client, message).catch(error => {
					this.client.logger.log(error, 'error');
				});
			} else if (message.channel.id === message.settings.feedbackChannel) {
				const args = message.content.trim().split(/ +/g);
				const messageMention = message.mentions.members.first();
				const moderate = await this.client.checkFeedback(message);

				message.argsJoined = args.join(' ').replace(/[^0-9a-z\s]/gi, '');
				message.userMentioned = await this.client.verifyUser(messageMention || message.author.id);
				message.heartArray = ['❤', '💚', '💙', '💜', '💛'];

				if (moderate) {
					this.client.query.feedbackRequest(this.client, message);
				} else if (
					message.userMentioned &&
					(message.userMentioned !== message.author && !message.userMentioned.bot)
				) {
					this.client.feedbackScoring(message);
					if (message.score >= 75) message.react(message.heartArray.random());
				} else return;
			} else return;
		}
	}
};
