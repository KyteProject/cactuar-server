const commandHandler = require('../functions/command.js');

module.exports = async (client, message) => {
  if (message.author.bot) return;

  await client.loadConfig(client, message);

  if (message.content.indexOf(message.settings.prefix) === 0) {
    commandHandler.run(client, message).catch(error => {
      client.logger.log(error, 'error');
    });
  }
  else if (message.channel.id === message.settings.feedbackChannel) {
    const args = message.content.trim().split(/ +/g);
    const messageMention = args.shift();
    message.argsJoined = args.join(' ').replace(/[^0-9a-z\s]/gi, '');
    message.userMentioned = await client.verifyUser(messageMention ? messageMention : message.author.id);
    if (!message) {                     // if feedback request, do feedback functions
    
    }
    else if ((message.userMentioned) && (message.userMentioned !== message.author && !message.userMentioned.bot)) { 
      client.feedbackScoring(message);
      const heartArray = ['❤', '💚', '💙', '💜', '💛',];
      message.react(heartArray.random());
    }
    else return;
  }
  else return;
};
