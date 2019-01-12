const { MessageAttachment } = require('discord.js');

exports.run = async (client, message, args, level) => {
  // message.channel.send(
    '**Donation info**\n\nBitcoin Address: 1MrRYsJAEgkBz2PoxvEQEtHwaTcDhThEzW',
    { files: [new MessageAttachment('http://lodestonemusic.com/1517935102586.jpg', 'QR Code.jpg')] },
  // );
};

exports.conf = {
  enabled: false,
  guildOnly: false,
  aliases: [],
  permLevel: 'User',
  botPerms: [],
};

exports.help = {
  name: 'donate',
  category: 'Miscelaneous',
  description: 'Provides donation info.',
  extended: 'Provides info for if you want to support server/development costs or even just buy me a beer! :D',
  usage: 'donate',
};
