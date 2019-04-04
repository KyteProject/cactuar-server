import Command from '../../structures/Command';

module.exports = class Help extends Command {
  constructor( ...args ) {
    super( ...args, {
      name: 'help',
      description: 'Display the help info',
      category: 'General'
    } );
  }

  run( message ) {
    message.author.send( `
    This bot works by monitoring the designated 'feedback' channel. It's operations are divided into two categories: requests and contributions. The bot will detect messages that match these conditions and take relevant actions. In order to post a request for feedback you must first give feedback to others. This does not mean one line, or minimal effort, it means giving the kind of feedback you would like to receive. Provide quality contributions to this server and the bot will allow you to post your links :slight_smile:

**Submissions**
\`\`\`asciidoc
- You must tag (@) the person you are giving feedback to.
- You can only provide feedback in the designated feedback channel.
- You cannot give feedback to yourself, a bot, or someone who has not submitted feedback recently.
- You will be awarded a score based on the quality of your contributions. There are numerous factors taken into account in the algorithm, but as a rule of thumb longer and more detailed posts will yield better results.
- If you provide good feedback the bot will give you a heart <3.
- If you provide phenomenal feedback you may be rewarded with a token, which you can use to pass the request check if you fail the other criteria.
- The bot will notify you once you have met the requirments to post feedback.\`\`\`
**Requests**
\`\`\`asciidoc
- You must have provided enough feedback to pass the check, otherwise the bot may remove the post.
- If you are successful, the bot may update the channels pinned messages.
- You may use an earned token to bypass the check - it is used automatically.\`\`\`
**Tips**
\`\`\`asciidoc
- Certain features may be disabled by admins.
- Tokens can be awarded by command.
- Use the ${message.settings.prefix}me command to display your feeedback stats.
- Use the ${message.settings.prefix}commands command to see what commands are available to you.\`\`\`
` );
  }
};
