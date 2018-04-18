exports.run = async (client, message, args, level) => {
  if (!args[0]) return message.channel.send('You need a message.  Remember to be careful with this!');
  client.guilds.forEach((i) => {
    i.systemChannel.startTyping();
    setTimeout(() => {
      i.systemChannel.send(args.join(' '));
      i.systemChannel.stopTyping(true);
    }, 100 * args.join(' ').length / 2);
  });
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 'Bot Admin',
  botPerms: [],
};

exports.help = {
  name: 'update',
  category: 'System',
  description: 'Push system update message.',
  extended: 'Pushes a global system message to all guilds bot is part of.  Spammy so be careful!',
  usage: 'update',
};
