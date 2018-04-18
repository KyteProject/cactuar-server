exports.run = async (client, message, args, level) => {
  message.channel.send('This bot was designed and developed by `@Dan <113226391771717632>` as an automated solution to the common issues music production communities face.  It\'s aim was to prevent the general spam and selfish posts which typically overrun feedback channels.  I have attempted to build a system that not only prevents the spam, but also encourages engagement and rewards those who put effort into their comments.\n\nThe bot originated in the ARTFX Discord server and has been in use there since 2017.  Come check us out! ARTFX Discord: https://discord.gg/2pjgA4b - **Do not come here asking for support regarding the bot.**\n\nThanks to `@Ferris <216134838472802306>`, `@ARTFX <187914668449202176>` and everyone who has provided ideas and helped with testing.  Please feel free to contact me with and questions, suggestions, bugs or complaints!');
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 'User',
  botPerms: [],
};

exports.help = {
  name: 'about',
  category: 'Miscelaneous',
  description: 'Some general info about the bot.',
  extended: '',
  usage: 'about',
};
