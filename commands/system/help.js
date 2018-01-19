const { MessageEmbed } = require('discord.js');

exports.run = async (client, message, args, level) => {
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
