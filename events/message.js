const sql = require('sqlite');

module.exports = async (client, message) => {
  if (message.author.bot) return;

  await sql.get(`SELECT * FROM guild_config WHERE gID = "${message.guild.id}"`).then(row => {
    if (row) { message.settings = row; }
    else { message.settings = client.config.defaultSettings; }
  }).catch(() => { console.error; });

  if (message.content.indexOf(client.config.prefix) !== 0) return;

  const args = message.content.slice(client.config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  const level = client.permlevel(message);

  const cmd =  client.commands.get(command) || client.commands.get(client.aliases.get(command));

  if (!cmd) return;

  if (cmd && !message.guild && cmd.conf.guildOnly)
    return message.channel.send('This command is denied via direct message.  Please execute it within a guild channel.');

  if (level < client.levelCache[cmd.conf.permLevel]) {
    if (message.settings.systemNotice === '1') {
      return message.channel.send(`You do not have permission to use this command.
    Your permission level is ${level} (${client.config.permLevels.find(l => l.level === level).name})
    This command requires level ${client.levelCache[cmd.conf.permLevel]} (${cmd.conf.permLevel})`);
    } else {
      return;
    }
  }

  message.author.permLevel = level;
  
  message.flags = [];
  while (args[0] && args[0][0] === '-') {
    message.flags.push(args.shift().slice(1));
  }

  // If the command exists, **AND** the user has permission, run it.
  client.log('log', `${client.config.permLevels.find(l => l.level === level).name} ${message.author.username} (${message.author.id}) ran command ${cmd.help.name}`, 'CMD');

  if (message.channel.type === 'text') {
    const mPerms = client.permCheck(message, cmd.conf.botPerms);
    if (mPerms.length) return message.channel.send(`The bot does not have the following permissions \`${mPerms.join(', ')}\``);
  }
  
  cmd.run(client, message, args, level).catch(error => {
    console.log(error);
    message.channel.send(error);
  });

};
