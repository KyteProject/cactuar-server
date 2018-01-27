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
    const heartArray = ['❤', '💚', '💙', '💜', '💛',];
    const args = message.content.trim().split(/ +/g);
    const messageMention = args.shift();
    message.argsJoined = args.join(' ').replace(/[^0-9a-z\s]/gi, '');
    message.userMentioned = await client.verifyUser(messageMention ? messageMention : message.author.id);
    message.member.joined = `${message.member.guild.id}-${message.member.id}`;
    
    
    if (client.checkFeedback(message)) {
      client.feedbackRequest(message);
    }
    else if ((message.userMentioned) && (message.userMentioned !== message.author && !message.userMentioned.bot)) { 
      client.feedbackScoring(message);
      message.react(heartArray.random());
    }
    else return;
  }
  else return;
};


// rewarding large feedback posts with a token (score greater than 100)
// keyword count to 4 or 5 for feedback, or use a stored token
// tokens can be gived my mods, or won in games/comps
// feedback can only counts when user is @ mentioned at the start (may updaste later)
// feedback can only counts in feedback channel
// feedback cannot be given to self, or bot
// bot responds with heart if logged successfuly