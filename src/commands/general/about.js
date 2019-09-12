import Command from '../../structures/Command';
import { MessageEmbed } from 'discord.js';

module.exports = class About extends Command {
  constructor( ...args ) {
    super( ...args, {
      name: 'about',
      description: 'About the bot',
      category: 'General',
      usage: '.about'
    } );
  }

  async run( message ) {
    const embed = new MessageEmbed()
      .setAuthor( 'About', this.client.user.avatarURL() )
      .setDescription(
        `Cactuar is a custom chat bot for music production Discord communities. The bot addresses the need for automating the moderation of feedback channels.

        The issue is that in channels dedicated to artist feedback many users do not give others feedback, only dropping their tracks and expecting other people to give them feedback. This causes these channels to be flooded with spam and provide little value. The bot prevents anyone from sharing their music unless they pass a requirement of providing feedback to others first. It does this by analysing the messages in the channel and using an algorithm to assign a score, once the threshold has been passed the bot will allow users to post their track, updating records in the process.
        
        There are several other beneficial commands, and an experience/leveling system in order to gamify the process in the hope to encourage and reward those who contribute the most.`
      )
      .setColor( '00d919' )
      .addField( 'Author:', '<@113226391771717632>', true )
      .addField( 'Website:', 'In development', true );

    message.channel.send( embed );
  }
};
