const sql = require('sqlite');
const { MessageEmbed } = require('discord.js');

exports.run = async (client, message, args, level) => {
  await sql.get(`SELECT * FROM users WHERE jID = "${message.member.joined}"`).then((row) => {
    if (!row) {
      client.query.insertUser(message.member.joined).then(() => {
        message.reply('User not in database for some reason, a new record has been created. Please run the command again.');
      });
    } else {
      const embed = new MessageEmbed()
        .setAuthor(`${message.member.displayName}'s Feedback Profile`, client.user.avatarURL())
        .setColor('00d919')
        .setThumbnail(message.author.avatarURL())
        .addField('User Stats', `Level: ${row.level} Points: ${row.currentPoints}/${row.nextLevel} (${row.totalPoints} total)`, true)
        .addField('Feedback Stats', `Tokens: ${row.tokens} Request Ratio: ${row.timesRequested}:${row.timesGiven}`, true)
        .addField('Last Request', row.lastRequest, true);
      message.channel.send({ embed });
    }
  }).catch(() => {
    console.error;
    client.query.createUser().then(() => {
      client.query.insertUser(message.member);
    });
  });
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  cooldown: 10,
  aliases: [''],
  permLevel: 'User',
  botPerms: [],
};

exports.help = {
  name: 'me',
  category: 'Feedback',
  description: 'Display your feedback profile',
  extended: 'Displays your profile and stats on the current server',
  usage: 'me',
};
