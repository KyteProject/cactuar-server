module.exports = (client, guild) =>  {
  // TODO: Setup guild in DB
  client.log('Event', `I have been added to the guild: ${guild.name}, Owned by: ${guild.owner.user.tag}, with ${guild.memberCount} members.`);  
};