const fs = require('fs-nextra');

exports.run = async (client, message, args, level) => {

  if (!args[0]) {
    const keywords = client.keywords.sort();
    let output = '= Keyword List =\n\n';
    keywords.forEach( k => {
      output += `${k}, `;
    });
    message.channel.send(output.toProperCase(), {code: 'asciidoc'});
  }
  else if (args[0] === 'add') {
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
  else if (args[0] === 'remove') {
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
  else {
    message.channel.send('Invalid command argument.');
  }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['kw'],
  permLevel: 'Bot Support',
  botPerms: []
};

exports.help = {
  name: 'keyword',
  category: 'Feedback',
  description: 'By itself it will show the list of current keywords.  To add or remove a keyword use the operator "add/remove" then the word.',
  usage: 'keyword [operator] [...keyword]'
};