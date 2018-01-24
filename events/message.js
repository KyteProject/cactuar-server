const commandHandler = require('../functions/command.js');

module.exports = async (client, message) => {
  if (message.author.bot) return;

  await client.loadConfig(client, message);

  // handle commands
  if (message.content.indexOf(message.settings.prefix) === 0) {
    commandHandler.run(client, message).catch(error => {
      client.logger.log(error, 'error');
    });
  }
  else if (message.channel.id !== message.settings.feedbackChannel) return;
  else {
    // if feedback request, do feedback functions
    // if message begins with user mention, do user functions
  }
};
