module.exports = (client, member) => {
  // TODO: Welcome message (PM?) on how the bot works, commands, options .etc
  client.log('Event', `${member.user.tag} (${member.id}) has joined ${member.guild.name} (${member.guild.id})`);
  const welcomeChannel = member.guild.channels.find('name', 'welcome');
  if (welcomeChannel) {
    welcomeChannel.send(`Please welcome ${member.user.tag} to our wonderful guild!`);
  }

  // TODO: Set up user in DB
};
