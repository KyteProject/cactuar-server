module.exports = (client, guild) => {
  // TODO: Clear guild from DB
  client.log('Event', `Left guild: ${guild.name} (${guild.id}) with ${guild.memberCount - 1} members.`, 'LEFT');
};