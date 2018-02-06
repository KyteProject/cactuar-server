const xkcd = require('xkcd');
const { MessageAttachment } = require('discord.js');

exports.run = async (client, message, args, level) => {
  if (!args[0]) {
    xkcd((data) => {
      const min = Math.ceil(1);
      const max = Math.floor(data.num);
      const number = Math.floor(Math.random() * (max - min + 1)) + min;
  
      xkcd(number, (data) => {
        message.channel.send(`**${data.title}**`, 
          { files: [new MessageAttachment(data.img, `${data.title}.jpg`)] 
          });
      });
    });
  }
  else if (args[0] === 'latest') {
    xkcd((data) => {
      message.channel.send(`**${data.title}**`, 
        { files: [new MessageAttachment(data.img, `${data.title}.jpg`)] 
        });
    });
  }
  else {
    message.channel.send('Invalid Argument, leave blank for random or use \'latest\' argument.');
  }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 'User',
  botPerms: []
};

exports.help = {
  name: 'xkcd',
  category: 'Miscelaneous',
  description: 'Random xkcd commic!',
  extended: 'Grabs a random xkcd commic and shares it to the channel.  Use latest argument to grab the most recent.',
  usage: 'xkcd [...latest]'
};