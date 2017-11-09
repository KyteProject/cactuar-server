module.exports = async (client, message, args) => {
  if (message.author.id !== client.config.ownerID) return;
  let code = args.join(' ');
  code = code.replace('token','nope');
  try {
  //    const evaled = eval(code);
    const cleaned = await client.clean(client, eval(code));
    message.channel.send(`\`\`\`js\n${cleaned}\n\`\`\``);
  } catch (err) {
    message.channel.send(`\`ERROR\` \`\`\`xl\n${await client.clean(client, err)}\n\`\`\``);
  }
};