const commandHandler = require(`${process.cwd()}/functions/command.js`);

module.exports = async (client, message) => {
  if (message.author.bot) return;

  if (message.channel.type === 'dm') {
    commandHandler.run(client, message).catch(error => {
      client.logger.log(error, 'error');
    });
  }
  else {
    await client.query.loadConfig(client, message);
    message.member.joined = `${message.member.guild.id}-${message.member.id}`;

    if (message.content.indexOf(message.settings.prefix) === 0) {      
      commandHandler.run(client, message).catch(error => {
        client.logger.log(error, 'error');
      });
    }
    else if (message.channel.id === message.settings.feedbackChannel) {
      if (message.attachments.size > 0) {
        message.delete();
        message.reply('Attachments not allowed, please use a file host like Soundcloud or Clyp.');
      }
      const args = message.content.trim().split(/ +/g);
      const messageMention = message.mentions.members.first();
      const moderate = await client.checkFeedback(message);
      message.argsJoined = args.join(' ').replace(/[^0-9a-z\s]/gi, '');

      message.userMentioned = await client.verifyUser(messageMention ? messageMention : message.author.id);

      message.heartArray = ['❤', '💚', '💙', '💜', '💛',];
    
      if (moderate) {
        client.query.feedbackRequest(client, message);
      }
      else if ((message.userMentioned) && (message.userMentioned !== message.author && !message.userMentioned.bot)) { 
        client.feedbackScoring(message);
        if (message.score >= 75) message.react(message.heartArray.random());
      }
      else return;
    }
    else return;
  }
};
