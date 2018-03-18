const { MessageEmbed } = require('discord.js');

exports.run = async (client, message, args, level) => {

  message.channel.send(`
This bot works by monitoring the designated 'feedback' channel. It's operations are divided into two categories: requests and contributions. The bot will detect messages that match these conditions and take relevant actions. In order to post a request for feedback you must first give feedback to others. This does not mean one line, or minimal effort, it means giving the kind of feedback you would like to receive. Provide quality contributions to this server and the bot *will* allow you to post your links ;)

**Submissions**
\`\`\`asciidoc
- You must tag (@) the person you are giving feedback to, no other forms will count towards you contribution score.
- You can only provide feedback in the nominated feedback channel.
- You cannot give feedback to yourself or a bot.
- You will be awarded a score based on the quality of your contributions.  There are numerous factors taken into account in the algorithm, but as a rule of thumb longer and more detailed posts will yield better results.
- If you provide good feedback the bot will give you a heart <3.
- If you provide phenomenal feedback you may be rewarded with a token, which you can use to pass the request check if you fail the other criteria.\`\`\`
**Requests**
\`\`\`asciidoc
- You must have provided enough feedback to pass the check, otherwise the bot may remove the post.
- If you are successful, the bot may updated the channels pinned messages.
- You may use an earned token to bypass the check.\`\`\`
**Tips**
\`\`\`asciidoc
- Certain features may be dissabled by admins.
- Tokens can be awarded by command.
- Users can track certain statistics, like their level, request:submission ratio.
- Use the '${message.settings.prefix}commands' command for info on what commands are available to you.\`\`\``);
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['h', 'halp'],
  permLevel: 'User',
  botPerms: []
};

exports.help = {
  name: 'help',
  category: 'System',
  description: 'Display help information about the bot',
  extended: 'heeeeeeeelp',
  usage: 'help'
};
