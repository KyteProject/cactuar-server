exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  const code = args.join(' ');
  try {
    const evaled = eval(code);
    const clean = await client.clean(client, evaled);
    message.channel.send(`\`\`\`js\n${clean}\n\`\`\``);
  } catch (err) {
    message.channel.send(`\`ERROR\` \`\`\`xl\n${await client.clean(client, err)}\n\`\`\``);
  }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['ev'],
  permLevel: 'Bot Owner',
  botPerms: []
};

exports.help = {
  name: 'eval',
  category: 'System',
  description: 'Evaluates arbitrary javascript.',
  extended: 'This is an extremely dangerous command, use with caution and never eval stuff strangers tell you.',
  usage: 'eval [...code]'
};
