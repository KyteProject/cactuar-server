exports.run = async (client, message, args, level) => {
  await message.guild.fetchAuditLogs({
  }).then(audit => console.log(audit.entries))
  .catch(console.error);
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['bs'],
  permLevel: 'Bot Owner',
  botPerms: [],
};

exports.help = {
  name: 'audit',
  category: 'System',
  description: '...',
  extended: '',
  usage: 'audit',
};
