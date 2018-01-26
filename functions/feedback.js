
module.exports = async (client, message) => {
  
  client.feedbackScoring = async (message) => {
    const regex = /\s+/gi;
    const multipier = 1;  // replace with user level check/asignment
    message.member.joined = `${message.member.guild.id}-${message.member.id}`;
    message.wordCount = message.argsJoined.trim().replace(regex, ' ').split(' ').length;
    message.charCountNoSpace = message.argsJoined.replace(regex, '').length;
    message.keywordCount = 5;  // replace with count function
    message.score = Math.round(((message.wordCount * 0.2) + (message.charCountNoSpace / 100) + (message.keywordCount * 9)) * multipier);
    message.tokenGain = (message.score >= 100) ? 1 : 0;
      
    message.channel.send(message.score);

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
    }
    else {
      message.level = row.level;
      message.nextLevel = row.nextLevel;
    }
  };
};

// rewarding large feedback posts with a token (score greater than 100)
// keyword count to 4 or 5 for feedback, or use a stored token
// tokens can be gived my mods, or won in games/comps