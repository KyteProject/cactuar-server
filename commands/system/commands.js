exports.run = (client, message, args, level) => {
  if (!args[0]) {
    const myCommands = message.guild ? client.commands.filter(cmd => client.levelCache[cmd.conf.permLevel] <= level) : client.commands.filter(cmd => client.levelCache[cmd.conf.permLevel] <= level &&  cmd.conf.guildOnly !== true);

    const commandNames = myCommands.keyArray();
    const longest = commandNames.reduce((long, str) => Math.max(long, str.length), 0);

    let currentCategory = '';
    let output = `= Command List =\n\n[Use ${message.settings.prefix}commands <commandname> for further details]\n`;
    const sorted = myCommands.array().sort((p, c) => p.help.category > c.help.category ? 1 :  p.help.name > c.help.name && p.help.category === c.help.category ? 1 : -1 );
    sorted.forEach( c => {
      const cat = c.help.category.toProperCase();
      if (currentCategory !== cat) {
        output += `\u200b\n== ${cat} ==\n`;
        currentCategory = cat;
      }
      output += `• ${message.settings.prefix}${c.help.name}${' '.repeat(longest - c.help.name.length)} :: ${c.help.description}\n`;
    });
    message.author.send(output, {code: 'asciidoc', split: { char: '\u200b' }});
    message.channel.send('Command list sent.  Please check your DM\'s.');
  } else {
    let command = args[0];
    if (client.commands.has(command)) {
      command = client.commands.get(command);
      if (level < client.levelCache[command.conf.permLevel]) return;
      message.channel.send(`= ${command.help.name} = \n\nDescription :: ${command.help.extended}\nUsage :: ${command.help.usage}\nAliases :: ${command.conf.aliases.join(', ')}`, {code:'asciidoc'});
    }
  }
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['cmd', 'command'],
  permLevel: 'User',
  botPerms: []
};

exports.help = {
  name: 'commands',
  category: 'System',
  description: 'Displays commands for your level.',
  extended: 'This command will display all available commands for your permission level, with the additonal option of getting per command information when you run \'commands [command name]\'.',
  usage: 'commands [command]'
};
