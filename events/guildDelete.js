import Event from '../structures/Event.js';

module.exports = class extends Event {
  async run( guild ) {
    this.client.log.info( `Left: ${guild.name} (${guild.id}) with ${guild.memberCount - 1} members.` );
  }
};
