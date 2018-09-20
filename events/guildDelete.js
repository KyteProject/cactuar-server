const sql = require('sqlite');

module.exports = class {
  constructor(client) {
    this.client = client;
  }

  async run(guild) {
    this.client.logger.log(`[Event] Left guild: ${guild.name} (${guild.id}) with ${guild.memberCount - 1} members.`);
  }
};
