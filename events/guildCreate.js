module.exports = class {
	constructor(client) {
		this.client = client;
	}

	async run(guild) {
		this.client.logger.log(
			`[Event] I have been added to the guild: ${guild.name}, Owned by: ${guild.owner.user
				.tag}, with ${guild.memberCount} members.`
		);
		this.client.query.guildCheck(this.client, guild);

		guild.owner.send(
			'Greetings!\n\n  My purpose is to help improve the activity and quality of engagement in feedback channels for music production servers.  There are a few things you will need to setup in order for me to be effective.  The most important being to set the channel ID for your feedback channel, this can be done with the configuration command.  A full setup guide can be found at: *coming soon* \n\n  Here are a few commands to get you started:\n\n  `.help` - Display some help info.\n\n  `.commands` - Send a list of commands you can use, or extended help on a specifc command.\n\n  `.config` - Allows you to view and set your servers configuration options.\n\n  For support, feedback, suggestions, bugs .etc you can message: `@Dan <113226391771717632>`'
		);
	}
};
