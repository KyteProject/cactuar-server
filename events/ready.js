module.exports = class {
  constructor(client) {
    this.client = client;
  }

  async run() {

    const presence = {
      status: 'online',
      afk: 0,
      activity: {
        name: 'for feedback.',
        type: 'WATCHING',
        url: 'http://feedbot.lodestonemusic.com',
      }
    };

    await this.client.wait(1000);

    this.client.appInfo = await this.client.fetchApplication();

    setInterval(async () => {
      this.client.appInfo = await this.client.fetchApplication();
    }, 60000);

    await this.client.user.setPresence(presence);

    //check for guilds added offline
    this.client.guilds.forEach(g => this.client.query.guildCheck(this.client, g));

    this.client.logger.log(`Logged in as: ${this.client.user.tag}. Serving ${this.client.users.size} users, ${this.client.channels.size} channels, ${this.client.guilds.size} servers.`, 'ready');
  }
};