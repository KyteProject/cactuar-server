const { version } = require('discord.js');
const Discord = require('discord.js');
const moment = require('moment');
require('moment-duration-format');

module.exports = (client, message) => {
  const duration = moment.duration(client.uptime).format(' D [days], H [hrs], m [mins], s [secs]');

  const embed = new Discord.MessageEmbed()
    .setAuthor('Music Feedback Bot')
    .setColor(15946079)
    .setDescription('Bot statistics')
    .addField('Mem Usage', `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`, true)
    .addField('Uptime', duration, true)
    .addField('Users', client.users.size.toLocaleString(), true)
    .addField('Servers', client.guilds.size.toLocaleString(), true)
    .addField('Channels', client.channels.size.toLocaleString(), true)
    .addField('Commands', client.commands.size.toLocaleString(), true)
    .addField('Discord.js', version, true)
    .addField('Node', process.version, true)
    .setFooter(message.guild.owner.user.tag, message.guild.owner.user.avatarURL(), true);
  message.channel.send({embed});
};