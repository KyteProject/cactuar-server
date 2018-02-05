const sql = require('sqlite');

exports.run = async (client, message, args, level) => {
  const feedbackChannel = client.channels.resolve(message.settings.feedbackChannel);
  if (message.channel.id !== message.settings.feedbackChannel) return message.channel.send(`You can only execute this command in the designated feedback channel: ${feedbackChannel}`);

  await sql.get(`SELECT * FROM users WHERE jID = "${message.member.joined}"`).then(row => {
    if (!row) {
      client.query.insertUser(message.member).then(() => {
        client.feedbackMsg(message, row, 'command');
      });
    }
    else {
      client.feedbackMsg(message, row, 'command');
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
  aliases: ['track', 'prev', 'previous', 'lasttrack'],
  permLevel: 'User',
  botPerms: []
};

exports.help = {
  name: 'last',
  category: 'Feedback',
  description: 'Command for viewing the last request.',
  extended: 'This command will retrieve the last logged feedback request for the server is is executed in.  Useful if you want to give feedback.',
  usage: 'last'
};
