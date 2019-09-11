import Command from '../../structures/Command';

module.exports = class Token extends Command {
  constructor( ...args ) {
    super( ...args, {
      name: 'token',
      description: 'Add, remove, or check tokens',
      usage: '.token <add/remove> @Dan',
      category: 'Feedback',
      permLevel: 'Moderator',
      extended:
				'The token system allows a user to bypass the feedback check. This is useful to bypass issues, or as a reward. It\'s use is cautioned as other users feedback requests may get skipped.'
    } );
  }

  async run( message, [ action, ...value ] ) {
    if ( !message.settings.tokens ) {
      return message.channel.send( 'Token system has been disabled by the guild owner.' );
    }

    if ( !action || !value.length ) {
      return message.channel.send( 'You must supply an action and a user.\ne.g `.token add @Dan`' );
    }

    if ( action === 'add' || action === 'remove' || action === 'check' ) {
      try {
        const target = message.mentions.members.first(),
          jID = `${message.guild.id}-${target.id}`,
          user = await this.client.feedback.verifyUser( jID, target.user.tag );

        if ( !user ) {
          throw new Error();
        }

        if ( action === 'check' ) {
          return message.channel.send( `${user.name} has: ${user.tokens} tokens.` );
        }

        if ( action === 'add' ? await this.client.db.addToken( jID ) : await this.client.db.removeToken( jID ) ) {
          return message.react( '✅' );
        }
      } catch ( err ) {
        return message.react( '❌' );
      }
    }
  }
};
