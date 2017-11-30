module.exports = async (client) => {
  await client.wait(1000);

  client.log('Event', `Logged in as: ${client.user.tag}. Serving ${client.users.size} users, ${client.channels.size} channels, ${client.guilds.size} servers.`);

  //check for guilds added offline
};
