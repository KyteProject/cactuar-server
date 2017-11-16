exports.run = (client, message, args, level) => {
  if (args.length < 1) throw 'Bot needs a message';

  message.delete().catch(err => {
    client.log('Command', err, 'Error');
  });
  
  message.channel.send(args.join(''));
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 'Moderator',
  botPerms: ['MANAGE_MESSAGES']
};

exports.help = {
  name: 'say',
  category: 'Miscelaneous',
  description: 'Have the bot say something.  Deletes the command message.',
  usage: 'say [...input]'
};