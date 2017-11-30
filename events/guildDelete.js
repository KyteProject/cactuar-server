const sql = require('sqlite');

module.exports = async (client, guild) => {
  await sql.get(`SELECT * FROM guild_config WHERE gID = "${guild.id}"`).then(row => {
    if (row) {
      sql.run(`DELETE FROM guild_config WHERE gID = "${guild.id}"`);
      client.log('DB', `Config entry for ${guild.id} has been removed.`);
    }
  }).catch(() => {
    console.error;
  });
  client.log('Event', `Left guild: ${guild.name} (${guild.id}) with ${guild.memberCount - 1} members.`, 'LEFT');
};