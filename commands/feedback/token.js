import Command from '../../structures/Command';
import * as fs from 'fs-nextra';

module.exports = class Token extends Command {
  constructor( ...args ) {
    super( ...args, {
      name: 'token',
      description: 'Add, remove, or check tokens',
      usage: '',
      category: 'Feedback',
      permLevel: 'Moderator'
    } );
  }

  async run( message, [ action, ...user ] ) {
    if ( !message.settings.tokens ) {
      return message.channel.send( 'Token system has been disabled by the guild owner.' );
    }

    if ( !action || !user.length ) {
      return message.channel.send( 'You must supply an action and a user.\ne.g `.token add @Dan`' );
    }

    if ( action === 'add' || action === 'remove' ) {
      try {
        const target = message.mentions.members.first(),
          jID = `${message.guild.id}-${target.id}`;

        await this.client.feedback.verifyUser( jID );

        if ( action === 'add' ? await this.client.db.addToken( jID ) : await this.client.db.removeToken( jID ) ) {
          return message.react( '✅' );
        }
      } catch ( err ) {
        return message.react( '❌' );
      }
    }
  }
};
