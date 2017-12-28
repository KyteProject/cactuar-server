const sql = require('sqlite');

module.exports = (client, member) =>  {
  member.joined = `${member.guild.id}-${member.id}`;
  
  if (!member.user.bot) {
    sql.get(`SELECT * FROM users WHERE jID = "${member.joined}"`).then(row => {
      if (row) {
        sql.run(`DELETE FROM users WHERE jID = "${member.joined}"`);
        client.log('DB', `Config entry for ${member.user.tag} has been removed.`);
      }
    }).catch(() => {console.error;});
  }

  client.log('Event', `User: ${member.user.tag} has been banned from server: ${member.guild.name}, Owned by: ${member.guild.owner.user.tag}.`); 
};