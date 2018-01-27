const { MessageEmbed } = require('discord.js');
const keywordArray = require('./../resources/keywords.json');
const linkArray = require('./../resources/links.json');

module.exports = async (client) => {
  
  client.feedbackScoring = async (message) => {
    const regex = /\s+/gi;
    const multipier = (client.permlevel(message) >= 5) ? 1.2 : 1;
    message.wordCount = message.argsJoined.trim().replace(regex, ' ').split(' ').length;
    message.charCountNoSpace = message.argsJoined.replace(regex, '').length;
    client.countKeywords(message);
    message.score = Math.round(((message.wordCount * 0.2) + (message.charCountNoSpace / 100) + (message.keywordCount * 9)) * multipier);
    message.tokenGain = (message.score >= 100) ? 1 : 0;
    message.channel.send(message.score);  // to be removed before launch
    client.feedbackSubmit(message);
  };

  client.nextLevel = async (message, level) => {
    const nextLevel = level + 1;
    const pointsToLevel = (1 / 4) * Math.floor(nextLevel - 1 + (300 * Math.pow(2, ((nextLevel - 1) / 7)))); 
    message.nextLevel = Math.floor(pointsToLevel);
  };

  client.levelUp = async (message, row) => {
    message.currentPoints = row.currentPoints + message.score;
    message.totalPoints = row.totalPoints + message.score;
    message.tokens = row.tokens + message.tokenGain;
    message.keywordCount += row.keywordCount;
    message.timesGiven = row.timesGiven + 1;
    
    if (message.currentPoints >= row.nextLevel) {
      message.currentPoints = 0;
      message.level = row.level + 1;
      client.nextLevel(message, message.level);
      message.nextLevel += row.nextLevel;
      message.channel.send(`${message.author.username} just reached level ${message.level}! 🎵`);
    }
    else {
      message.level = row.level;
      message.nextLevel = row.nextLevel;
    }
  };

  client.countKeywords = async (message) => {
    message.keywordCount = 0;
    for (let i = 0; i < keywordArray.length; i++) {
      if (message.argsJoined.includes(keywordArray[i])) {
        message.keywordCount++;
      }
    }
  };

  client.checkFeedback = async (message) => {
    for (let i = 0; i < linkArray.length; i++) {
      if (message.cleanContent.includes(linkArray[i])) {
        return true;
      }
    }
    return false;
  };

  client.feedbackPermission = async (message, row) => {
    if  (row.keywordCount < 5) {
      if (message.settings.deleteSwitch) message.delete();
      if (message.settings.botLogEnable) {
        client.feedbackMsg(message, 'command');
      }
      client.logger.log('[Sys] Feedback denied for: ' + message.author.username);
    }
    else {
      if (message.settings.pinMessage) {
        message.channel.messages.fetch(message.settings.messageID).then((oldMsg) => {
          oldMsg.unpin();
          message.pin();
        });
      }
      client.resetUser(message, row);
    }
  };

  client.feedbackMsg = async (message, type) => {
    message.channel.messages.fetch(message.settings.messageID).then((oldMsg) => {
      const embed = new MessageEmbed()
        .setAuthor('Feedback Auto Moderation', client.user.avatarURL(), 'http://lodestonemusic.com')
        .setColor(15946079)
        .setTimestamp(oldMsg.createdAt)
        .setThumbnail(client.user.avatarURL())
        .addField('Feedback Denied!!' , message.settings.response)
        .addField('Last request', oldMsg.cleanContent,)
        .addField('About',`Type ${message.settings.prefix}help for info`)
        .setFooter(oldMsg.author.username, oldMsg.author.avatarURL())
        .setURL(oldMsg.embeds.url);
      if (type === 'command') embed.fields.splice(0, 1);
      message.channel.send({embed});
    });
  };
};
