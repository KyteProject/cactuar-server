const Discord = require('discord.js');

module.exports = async (client, message) => {

  const bans = await message.guild.fetchBans().then((b) => b.size);
  const embed = new Discord.MessageEmbed()
    .setAuthor('Server info')
    .setColor(15946079)
    .setDescription(`Owner: ${message.guild.owner.user.tag} (${message.guild.owner.id})`)
    .addField('Member Count', `${message.guild.memberCount - message.guild.members.filter(m => m.user.bot).size} + ${message.guild.members.filter(m => m.user.bot).size} bots`, true)
    .addField('Banned', bans, true)
    .addField('Location', message.guild.region, true)
    .addField('Created', message.guild.createdAt.toLocaleString(), true)
    .addField('Channels', `${message.guild.channels.filter(chan => chan.type === 'voice').size} voice / ${message.guild.channels.filter(chan => chan.type === 'text').size} text`, true)
    .addField('Roles', message.guild.roles.size, true)
    .setFooter(message.guild.owner.user.tag, message.guild.owner.user.avatarURL(), true);
  message.channel.send({embed});
};