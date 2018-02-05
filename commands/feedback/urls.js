const fs = require('fs-nextra');

exports.run = async (client, message, args, level) => {

  if (!args[0]) {
    const links = client.urls.sort();
    let output = '= URL List =\n\n';
    links.forEach( k => {
      output += `${k}, `;
    });
    message.channel.send(output.toProperCase(), {code: 'asciidoc'});
  }
  else if (args[0] === 'add') {
    const word = args[1].toLowerCase().replace(/[^a-z.]/gi, '');
    if (!client.urls.includes(word)) {
      client.urls.push(word);
      fs.writeJson('./resources/links.json', client.urls, err => {
        if (err) return console.error(err);
      });
      message.channel.send('File has been updated.');
    } else {
      message.channel.send('URL already exists!');
    }
  }
  else if (args[0] === 'remove') {
    const word = args[1].toLowerCase().replace(/[^a-z.]/gi, '');
    if (client.urls.includes(word)) {
      client.urls = client.urls.filter(a => a !== word);
      fs.writeJson('./resources/links.json', client.urls, err => {
        if (err) return console.error(err);
      });
      message.channel.send('File has been updated.');
    } else {
      message.channel.send('URL does not exists!');
    }
  }
  else {
    message.channel.send('Invalid command argument.');
  }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['links'],
  permLevel: 'Bot Support',
  botPerms: []
};

exports.help = {
  name: 'urls',
  category: 'Feedback',
  description: 'Command for managing URLs.',
  extended: 'By itself it will show the list of current URL\'s.  To add or remove a URL use the operator "add/remove" then the word.',
  usage: 'urls [operator] [...url]'
};