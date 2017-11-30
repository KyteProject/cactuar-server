const sql = require('sqlite');

module.exports = (client, guild, user, member) =>  {
  member.joined = `${guild.id}-${member.id}`;
  
  if (!member.user.bot) {
    sql.get(`SELECT * FROM users WHERE jID = "${member.joined}"`).then(row => {
      if (row) {
        sql.run(`DELETE FROM users WHERE jID = ${member.joined}`);
      }
    }).catch(() => {console.error;});
  }

  client.log('Event', `User: ${user.tag} has been banned from server: ${guild.name}, Owned by: ${guild.owner.user.tag}.`); 
};