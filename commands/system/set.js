import Command from '../../structures/Command';

module.exports = class Set extends Command {
  constructor( ...args ) {
    super( ...args, {
      name: 'set',
      description: 'Sets or adds a feedback track by ID',
      category: 'System',
      guildOnly: true,
      permLevel: 'Moderator'
    } );
  }

  async run( message, [ value ] ) {
    try {
      const msg = await message.channel.messages.fetch( value );

      if ( !msg ) {
        return message.channel.send( 'This message doesn\'t exist.' );
      }

      if ( msg.guild.id !== message.settings.feedbackchannel ) {
        return message.channel.send( 'This message is not from your feedback channel' );
      }

      await this.client.db.insertMessage( msg.id, msg.guild.id, msg.author.id );

      return message.react( '✅' );
    } catch ( err ) {
      this.client.log.error( err );
      return message.react( '❌' );
    }
  }
};
