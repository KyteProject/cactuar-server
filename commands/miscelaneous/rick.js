const rickArray = require('../../resources/rick.js');

exports.run = (client, message, args, level) => {
  message.channel.send(rickArray.random());
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 'User'
};

exports.help = {
  name: 'rick',
  category: 'Miscelaneous',
  description: 'Random Rick Sanchez quote!',
  usage: 'rick'
};