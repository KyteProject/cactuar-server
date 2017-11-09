module.exports = (client, guild) =>  {
  client.log('Event', `I have been added to the guild: ${guild.name}, Owned by: ${guild.owner.user.tag}, with ${guild.memberCount} members.`);  
};