const sql = require('sqlite');

exports.run = async (client, message, args, level) => {
  if (!args[0]) return message.reply('Please provide an operator');
  const target = message.mentions.members.first();
  if (!target) return message.reply('Please provide a target user.');
  target.joined = `${message.guild.id}-${target.id}`;

  await sql.get(`SELECT * FROM users WHERE jID = "${target.joined}"`).then((row) => {
      if (!row) {
        client.query.insertUser(target).then(() => {
          message.reply('User not in database for some reason, a new record has been created. Please run the command again.');
        });
      } else {
        message.channel.send(`L${row.level}C${row.currentPoints}T${row.totalPoints}N${row.nextLevel}TO${row.tokens}K${row.keywordCount}`);
      }
    }).catch(() => {
      console.error;
      client.query.createUser().then(() => {
        client.query.insertUser(target);
      });
    });
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [''],
  permLevel: 'Moderator',
  botPerms: [],
};

exports.help = {
  name: 'grab',
  category: 'Feedback',
  description: 'Command for grabbing user info.',
  extended: 'This command allows guild staff to grab user info in the form of a string.',
  usage: 'grab @user',
};
