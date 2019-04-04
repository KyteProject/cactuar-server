import { MessageEmbed } from 'discord.js';
import Command from '../../structures/Command';

module.exports = class Last extends Command {
  constructor( ...args ) {
    super( ...args, {
      name: 'last',
      description: 'Shows the last tracks submitted for feedback.',
      extended:
				'Using \'.last all\' will return the last 5 tracks recorded. It only works for those submitted as a link, not attachments.',
      usage: '.last or .last all',
      category: 'Feedback'
    } );

    this.urlRegex = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/;
  }

  async run( message, [ action ] ) {
    if ( message.channel.id !== message.settings.feedbackchannel ) {
      return message.channel.send( 'You can only execute this command in the designated feedback channel.' );
    }

    // grab list of messages
    const oldMessages = await this.client.db.fetchMessages( message.guild.id, 5 );

    if ( action === 'all' ) {
      let x = 1;
      const oldMsg = await this.client.feedback.verifyAllMessage( message, oldMessages ),
        embed = new MessageEmbed()
          .setAuthor( `Last 5 tracks - ${message.guild.name}`, this.client.user.avatarURL() )
          .setColor( '00d919' );

      oldMsg.forEach( ( row ) => {
        const link = row.content.match( this.urlRegex );

        if ( link ) {
          embed.addField( `${x}: ${row.author.tag} - ${row.createdAt.toDateString()}`, `Track: ${link[ 0 ]}` );

          x++;
        }
      } );

      return message.channel.send( { embed } );
    }

    const oldMsg = await this.client.feedback.verifyMessage( message, oldMessages );

    this.client.feedback.rejectMessage( message, oldMsg, 'command' );
  }
};
