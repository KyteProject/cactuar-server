exports.run = async (client, message, args, level) => {
  if (args.length < 1) return message.reply('Please provide a message.');
  try {
    const channelid = await client.verifyChannel(message, args[0]);
    if (channelid !== message.channel.id) {
      args.shift();
    }
    const channel = message.guild.channels.get(channelid);
    if (!message.member.permissionsIn(channel).has(['SEND_MESSAGES', 'READ_MESSAGES'])) throw 'You do not have permission to `say` in that channel.';
    
    message.delete();

    channel.startTyping();
    setTimeout(() => {
      channel.send(args.join(' '));
      channel.stopTyping(true);
    }, 100 * args.join(' ').length / 2);
  } catch (error) {
    throw error;
  }
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: 'Moderator',
  botPerms: ['MANAGE_MESSAGES']
};

exports.help = {
  name: 'say',
  category: 'Miscelaneous',
  description: 'Have the bot say something.',
  extended: 'Have the bot say something either to the current channel, or a specified one.  Is dependant on user permissions and will remove the command message.',
  usage: 'say [#channel] [...message]'
};