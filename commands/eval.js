module.exports = async (client, message, args) => {
  if (message.author.id !== client.config.ownerID) return;
  const code = args.join(' ');
  try {
    const evaled = eval(code);
    const cleaned = await client.clean(client, evaled);
    message.channel.send(`\`\`\`js\n${cleaned}\n\`\`\``);
  } catch (err) {
    message.channel.send(`\`ERROR\` \`\`\`xl\n${await client.clean(client, err)}\n\`\`\``);
  }
};