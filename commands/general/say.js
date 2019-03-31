import Command from '../../structures/Command';

module.exports = class Say extends Command {
  constructor( ...args ) {
    super( ...args, {
      name: 'say',
      description: 'Have the bot say something, defaults to current channel if none provided.',
      usage: '.say <#channel> <message>',
      category: 'General',
      permLevel: 'Moderator',
      guildOnly: true
    } );
  }

  async run( message, args ) {
    if ( args.length < 1 ) {
      return message.reply( 'Please provide a message.' );
    }

    try {
      let channelid = await message.verifyChannel( args[ 0 ] );

      if ( channelid !== message.channel.id ) {
        args.shift();

        channelid = message.channel.id;
      }

      const channel = message.guild.channels.get( channelid );

      message.delete();

      channel.startTyping();
      setTimeout( () => {
        channel.send( args.join( ' ' ) );
        channel.stopTyping( true );
      }, 100 * args.join( ' ' ).length / 2 );
    } catch ( err ) {
      return this.client.log.error( err );
    }
  }
};
