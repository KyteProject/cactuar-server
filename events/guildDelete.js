const sql = require('sqlite');

module.exports = class {
  constructor(client) {
    this.client = client;
  }

  async run(guild) {
    await sql.get(`SELECT * FROM guild_config WHERE gID = "${guild.id}"`).then(row => {
      if (row) {
        sql.run(`DELETE FROM guild_config WHERE gID = "${guild.id}"`);
        this.client.logger.log(`[DB] Config entry for ${guild.id} has been removed.`);
      }
    }).catch(() => {console.error;});

    this.client.logger.log(`[Event] Left guild: ${guild.name} (${guild.id}) with ${guild.memberCount - 1} members.`);
  }
};