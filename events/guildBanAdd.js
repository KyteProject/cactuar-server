module.exports = (client, guild, user) =>  {
  // TODO: Remove banned user from DB (kicked or leaving does nothing)
  client.log('Event', `User: ${user.tag} has been banned from server: ${guild.name}, Owned by: ${guild.owner.user.tag}.`);  
};