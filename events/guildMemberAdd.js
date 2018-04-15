const sql = require('sqlite');
module.exports = class {
  constructor(client) {
    this.client = client;
  }

  async run(member) {
    if (!member || !member.id || !member.guild) return;
    member.joined = `${member.guild.id}-${member.id}`;
  
    if (!member.user.bot) {
      sql.get(`SELECT * FROM users WHERE jID = "${member.joined}"`).then(row => {
        if (!row) {
          this.client.query.insertUser(member);
        }
      }).catch(() => {
        console.error;
        this.client.query.createUser().then(() => {
          this.client.query.insertUser(member);
        });
      });
    }
  
    this.client.logger.log(`[Event] ${member.user.tag} (${member.id}) has joined ${member.guild.name} (${member.guild.id})`);
  }
};
