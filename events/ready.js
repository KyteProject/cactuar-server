module.exports = (client) => {
  client.log('Event', `Logged in as: ${client.user.tag}. Serving ${client.users.size} users, ${client.channels.size} channels, ${client.guilds.size} servers.`);
};
