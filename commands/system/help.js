const { MessageEmbed } = require('discord.js');

exports.run = async (client, message, args, level) => {
  client.log('help');
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
  usage: 'help'
};
