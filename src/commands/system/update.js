import Command from '../../structures/Command';

module.exports = class Update extends Command {
  constructor( ...args ) {
    super( ...args, {
      name: 'update',
      description: 'Pushes update message to all guilds into the feedback channel.',
      category: 'System',
      permLevel: 'Bot Owner'
    } );
  }

  run( message, args ) {
    if ( args.length < 1 ) {
      return message.reply( 'Please provide a message.' );
    }

    this.client.settingsCache.forEach( async( guild ) => {
      try {
        const channelid = await message.verifyChannel( guild.feedback_channel );

        if ( channelid ) {
          const channel = await message.guild.channels.cache.get( channelid );

          setTimeout( () => {
            channel.send( args.join( ' ' ) );
          }, 100 * args.join( ' ' ).length / 2 );
        }
      } catch ( err ) {
        return this.client.log.debug( `Failed to send message to: ${guild.name}` );
      }
    } );
  }
};
