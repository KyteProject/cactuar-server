const sql = require('sqlite');

module.exports = async (client, guild) =>  {
  client.logger.log(`[Event] I have been added to the guild: ${guild.name}, Owned by: ${guild.owner.user.tag}, with ${guild.memberCount} members.`); 
  
  //Add guild to settings.
  client.guildCheck(guild);
};
