const sql = require('sqlite');

module.exports = async (client, member) => {
  if (!member || !member.id || !member.guild) return;
  member.joined = `${member.guild.id}-${member.id}`;

  if (!member.user.bot) {
    sql.get(`SELECT * FROM users WHERE jID = "${member.joined}"`).then(row => {
      if (!row) {
        client.insertUser(member);
      }
    }).catch(() => {
      console.error;
      client.createUser().then(() => {
        client.insertUser(member);
      });
    });
  }

  client.logger.log(`[Event] ${member.user.tag} (${member.id}) has joined ${member.guild.name} (${member.guild.id})`);
};
