exports.run = async (client, message) => {
  const args = message.content.slice(client.config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  const level = client.permlevel(message);

  const cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command));

  if (!cmd) return;

  const rateLimit = await client.ratelimit(message, level, cmd.help.name, cmd.conf.cooldown);

  if (typeof rateLimit === 'string') {
    client.logger.log(`${client.config.permLevels.find(l => l.level === level).name} ${message.author.username} (${message.author.id}) got ratelimited while running command ${cmd.help.name}`);
    return message.channel.send(`Please wait ${rateLimit.toPlural()} to run this command.`);
  }

  if (cmd && !message.guild && cmd.conf.guildOnly) { return message.channel.send('This command is denied via direct message.  Please execute it within a guild channel.'); }

  if (level < client.levelCache[cmd.conf.permLevel]) {
    if (message.settings.systemNotice === '1') {
      return message.channel.send(`You do not have permission to use this command.
  Your permission level is ${level} (${client.config.permLevels.find(l => l.level === level).name})
  This command requires level ${client.levelCache[cmd.conf.permLevel]} (${cmd.conf.permLevel})`);
    }
    return;
  }

  message.author.permLevel = level;

  message.flags = [];
  while (args[0] && args[0][0] === '-') {
    message.flags.push(args.shift().slice(1));
  }

  // If the command exists, **AND** the user has permission, run it.
  client.logger.log(`${client.config.permLevels.find(l => l.level === level).name} ${message.author.username} (${message.author.id}) ran command ${cmd.help.name}`, 'cmd');

  if (message.channel.type === 'text') {
    const mPerms = client.permCheck(message, cmd.conf.botPerms);
    if (mPerms.length) return message.channel.send(`The bot does not have the following permissions \`${mPerms.join(', ')}\``);
  }

  cmd.run(client, message, args, level);
};
