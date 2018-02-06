exports.run = async (client, message, args, level) => {
  try {
    await message.channel.send('Bot is shutting down.');
    client.commands.forEach( async cmd => {
      await client.unloadCommand(cmd);
    });
    process.exit(1);
  } 
  catch (e) {
    console.log(e); 
  }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['restart'],
  permLevel: 'Bot Admin',
  botPerms: []
};

exports.help = {
  name: 'reboot',
  category: 'System',
  description: 'Restarts the bot',
  extended: 'This command will will cause the bot to exit cleanly and restart the process if using PM2 or Forever.  Otherwise it will just shut down.',
  usage: 'reboot'
};
