const sql = require('sqlite');

module.exports = async (client, guild) =>  {
  client.log('Event', `I have been added to the guild: ${guild.name}, Owned by: ${guild.owner.user.tag}, with ${guild.memberCount} members.`); 
  
  //Add guild to settings.
  sql.get(`SELECT * FROM guild_config WHERE gID = "${guild.id}"`).then(row => {
    if (!row) {
      client.insertGuild(client, guild);
    }
  }).catch(() => {
    console.error;
    client.createGuild().then(() => {
      client.insertGuild(client, guild);
    });
  });
};
