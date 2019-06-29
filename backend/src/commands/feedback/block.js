import Command from '../../structures/Command';

module.exports = class Block extends Command {
  constructor( ...args ) {
    super( ...args, {
      name: 'block',
      description: 'Add or remove user block.',
      usage: '.block @Dan',
      category: 'Feedback',
      permLevel: 'Moderator',
      extended:
				'This command will toggle the feedback blocking system. When enabled a blocked user will not be able to make feedback requests regarless of threshold/tokens.'
    } );
  }

  async run( message, userArg ) {
    if ( !userArg ) {
      return message.channel.send( 'You must supply a user.\ne.g `.block @Dan`' );
    }

    try {
      const target = message.mentions.members.first(),
        jID = `${message.guild.id}-${target.id}`,
        user = await this.client.feedback.verifyUser( jID, target.user.tag );

      if ( !user ) {
        throw new Error();
      }

      await this.client.db.block( jID );

      return message.channel.send(
        `✅ - ${user.name} has been ${user.disabled ? 'unblocked' : 'blocked'} from feedback.`
      );
    } catch ( err ) {
      return message.react( '❌' );
    }
  }
};
