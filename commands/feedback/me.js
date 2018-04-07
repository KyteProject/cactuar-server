const sql = require('sqlite');

exports.run = async (client, message, args, level) => {
  await sql.get(`SELECT * FROM users WHERE jID = "${message.member.joined}"`).then(row => {
    if (!row) {
      client.query.insertUser(message.member.joined).then(() => {
        message.reply('User not in database for some reason, a new record has been created. Please run the command again.');
      });
    }
    else {
      //sdf
    }
  }).catch(() => {
    console.error;
    client.query.createUser().then(() => {
      client.query.insertUser(message.member.joined);
    });
  });
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [''],
  permLevel: 'User',
  botPerms: []
};

exports.help = {
  name: 'me',
  category: 'Feedback',
  description: '...',
  usage: 'me'
};
