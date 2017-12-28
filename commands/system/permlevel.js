exports.run = async (client, message, args, level) => {
  const friendly = client.config.permLevels.find(l => l.level === level).name;
  message.reply(`Your permission level is: ${level} - ${friendly}`);
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['pl', 'perms'],
  permLevel: 'User',
  botPerms: []
};

exports.help = {
  name: 'permlevel',
  category: 'System',
  description: 'Tells you your permission level.',
  extended: 'This will display your permission level, in both numerical and plain English styles.',
  usage: 'permlevel'
};
