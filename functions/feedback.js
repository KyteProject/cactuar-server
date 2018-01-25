
module.exports = async (client, message) => {
  
  client.feedbackScoring = async (message) => {
    try {
      const regex = /\s+/gi;
      const multipier = 1;  // replace with user level check/asignment
      message.wordCount = message.argsJoined.trim().replace(regex, ' ').split(' ').length;
      message.charCountNoSpace = message.argsJoined.replace(regex, '').length;
      message.keywordCount = 4;  // replace with count function
      message.tokenGain = 1;  // replace with token function
      message.score = Math.round(((message.wordCount * 0.2) + (message.charCountNoSpace / 100) + (message.keywordCount * 9)) * multipier);
      message.member.joined = `${message.member.guild.id}-${message.member.id}`;
      
      client.feedbackSubmit(message);
    }  
    catch (error) {
      client.logger.log(error, 'error');
    }
  };
};
