exports.run = async (client, message, args, level) => {
  if (!args || args.length < 1) return message.reply('Must provide a command to reload.');

  const commands = client.commands.get(args[0]) || client.commands.get(client.aliases.get(args[0]));
  if (!commands) return message.reply(`The command \`${args[0]}\` doesn't seem to exist, nor is it an alias. Try again!`);

  let response = await client.unloadCommand(`${commands.conf.location}`, commands.help.name);
  if (response) return message.reply(`Error Unloading: ${response}`);
  
  response = client.loadCommand(`${commands.conf.location}`, commands.help.name);
  if (response) return message.reply(`Error loading: ${response}`);
  
  message.reply(`The command \`${commands.help.name}\` has been reloaded`);
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 'Bot Admin',
  botPerms: []
};

exports.help = {
  name: 'reload',
  category: 'System',
  description: 'Reloads a command.',
  extended: 'This command is designed to unload, then reload the command from the command & aliases collections for changes to take effect.',
  usage: 'reload [command]'
};
