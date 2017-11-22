const fs = require('fs-nextra');

exports.run = (client, message, args, level) => {

  if (!args[0]) {
    const keywords = client.keywords.sort();
    let output = '= Keyword List =\n\n';
    keywords.forEach( k => {
      output += `${k}, `;
    });
    message.channel.send(output, {code:'asciicode'});
  }

  if (args[0] === 'add') {
    const word = args[1].toLowerCase().replace(/[^a-z]/gi, '');
    if (!client.keywords.includes(word)) {
      client.keywords.push(word);
      fs.writeJson('./resources/keywords.json', client.keywords, err => {
        if (err) return console.error(err);
      });
      message.channel.send('File has been updated.');
    } else {
      message.channel.send('Word already exists!');
    }
  }
  if (args[0] === 'remove') {
    const word = args[1].toLowerCase().replace(/[^a-z]/gi, '');
    if (client.keywords.includes(word)) {
      client.keywords = client.keywords.filter(a => a !== word);
      fs.writeJson('./resources/keywords.json', client.keywords, err => {
        if (err) return console.error(err);
      });
      message.channel.send('File has been updated.');
    } else {
      message.channel.send('Word does not exists!');
    }
  }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['kw'],
  permLevel: 'Moderator',
  botPerms: []
};

exports.help = {
  name: 'keyword',
  category: 'Feedback',
  description: '',
  usage: 'keyword [cmd] [...input]'
};