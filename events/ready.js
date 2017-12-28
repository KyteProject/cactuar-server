module.exports = async (client) => {

  const presence = {
    status: 'online',
    afk: 0,
    activity: {
      name: 'for feedback.',
      type: 'WATCHING',
      url: 'http://feedbot.lodestonemusic.com',
    }
  };

  await client.wait(1000);

  client.appInfo = await client.fetchApplication();

  setInterval(async () => {
    client.appInfo = await client.fetchApplication();
  }, 60000);

  await client.user.setPresence(presence);

  //check for guilds added offline
  client.guilds.forEach(g => client.guildCheck(g));

  client.log('Event', `Logged in as: ${client.user.tag}. Serving ${client.users.size} users, ${client.channels.size} channels, ${client.guilds.size} servers.`);
};
