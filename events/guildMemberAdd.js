const sql = require('sqlite');
// const helpMessage = require('../resources/helpMessage.js');

module.exports = async (client, member) => {
  client.log('Event', `${member.user.tag} (${member.id}) has joined ${member.guild.name} (${member.guild.id})`);

  await sql.get(`SELECT * FROM guild_config WHERE gID = "${member.guild.id}"`).then(settings => {
    if (settings.welcomeMessage) {
      // send help/welcome message
      console.error;
    }})
    .catch(() => {
      console.error;
      client.log('Row does not exist.');
    });

  // TODO: Set up user in DB
};
