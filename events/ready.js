const ActivityUpdate = require('./../system/ActivityUpdate');

module.exports = class {
	constructor(client) {
		this.client = client;
	}

	async run() {
		await this.client.wait(1000);

		this.client.appInfo = await this.client.fetchApplication();

		setInterval(async () => {
			await ActivityUpdate.fetch(this.client);
		}, 20000);

		// check for guilds added offline
		this.client.guilds.forEach(g => this.client.query.guildCheck(this.client, g));

		this.client.logger.log(
			`Logged in as: ${this.client.user.tag}. Serving ${this.client.users.size} users, ${this.client.channels
				.size} channels, ${this.client.guilds.size} servers.`,
			'ready'
		);
	}
};
