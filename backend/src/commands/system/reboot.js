import Command from '../../structures/Command';

module.exports = class Reboot extends Command {
  constructor( ...args ) {
    super( ...args, {
      name: 'reboot',
      description: 'Restarts the bot.',
      category: 'System',
      permLevel: 'Bot Owner',
      usage: '.reboot'
    } );
  }

  async run( message ) {
    await message.channel.send( 'Bot is shutting down...' ).catch( err => this.client.log.error( err ) );
    process.exit( 1 );
  }
};
