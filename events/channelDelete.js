module.exports = async (client, channel) => {
  // check name of channel, if it matches whats in feedbaclk db
  await client.query.loadConfig(client, channel);
  if (channel.settings.feedbackChannel === channel.id) {
    try {
      channel.guild.systemChannel.send('Feedback channel deleted.  Make sure you update your server configuration.');
    } catch (error) {
      client.logger.log(error, 'error');
    }
  }
};