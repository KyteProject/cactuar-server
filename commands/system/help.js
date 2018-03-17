const { MessageEmbed } = require('discord.js');

exports.run = async (client, message, args, level) => {

  const embed = new MessageEmbed()
    .setAuthor('Feedback Auto Moderation', client.user.avatarURL(), 'http://lodestonemusic.com')
    .setColor('00d919')
    .setTimestamp(oldMsg.createdAt)
    .setThumbnail(client.user.avatarURL())
    .addField('Feedback Denied!!' , message.settings.response)
    .addField('Last Request', oldMsg.cleanContent,)
    .addField('Stats',`Token Count: ${row.tokens} Request Ratio: ${row.timesRequested}:${row.timesGiven}` , true)
    .addField('About',`Type ${message.settings.prefix}help for info`, true)
    .setFooter(oldMsg.author.username, oldMsg.author.avatarURL())
    .setURL(oldMsg.embeds.url);
  if (type === 'command') embed.fields.splice(0, 1);
  message.channel.send({embed});

  client.logger.log('help');
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['h', 'halp'],
  permLevel: 'User',
  botPerms: []
};

exports.help = {
  name: 'help',
  category: 'System',
  description: 'Display help information about the bot',
  extended: 'heeeeeeeelp',
  usage: 'help'
};
