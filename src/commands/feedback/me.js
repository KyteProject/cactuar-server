import { MessageEmbed } from 'discord.js';
import Command from '../../structures/Command';

module.exports = class Me extends Command {
  constructor( ...args ) {
    super( ...args, {
      name: 'me',
      description: 'Display your feedback profile.',
      category: 'Feedback',
      guildOnly: true,
      usage: '.me'
    } );
  }

  async run( message ) {
    try {
      const jID = `${message.guild.id}-${message.author.id}`,
        user = await this.client.feedback.verifyUser( jID, message.author.tag );
      let feedbackStatus;

      if ( user.keywords >= message.settings.threshold ) {
        feedbackStatus = '✅ Able to make a request';
      } else if ( user.keywords < message.settings.threshold && user.tokens >= 1 ) {
        feedbackStatus = '✅ Able to make a request with a token';
      } else {
        feedbackStatus = '❌ Unable to make a request';
      }

      const embed = new MessageEmbed()
        .setAuthor( `${message.member.displayName}'s Feedback Profile`, this.client.user.avatarURL() )
        .setColor( '00d919' )
        .setThumbnail( message.author.avatarURL() )
        .addField(
          'User Stats',
          `Level: ${user.level} Points: ${user.current}/${user.next} (${user.total} total)`,
          true
        )
        .addField(
          'Feedback Stats',
          `Tokens: ${user.tokens} Request Ratio: ${user.requests}:${user.submissions}`,
          true
        )
        .addField( 'Last Request', user.last_request, true )
        .addField( 'Status:', feedbackStatus, true );

      return message.channel.send( { embed } );
    } catch ( err ) {
      return this.client.log.error( err );
    }
  }
};
