module.exports = class {
  constructor(client) {
    this.client = client;
  }

  async run(channel) {
    await this.client.query.loadConfig(this.client, channel);
    if (channel.settings.feedbackChannel === channel.id) {
      try {
        channel.guild.owner.send('Feedback channel deleted.  Make sure you update your server configuration.');
      } catch (error) {
        this.client.logger.log(error, 'error');
      }
    }
  }
};
