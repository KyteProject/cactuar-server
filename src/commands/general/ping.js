import Command from '../../structures/Command';

module.exports = class Ping extends Command {
  constructor( ...args ) {
    super( ...args, {
      name: 'ping',
      description: 'Get latency info',
      category: 'General',
      permLevel: 'Moderator',
      usage: '.ping'
    } );
  }

  run( message ) {
    message.channel
      .send( 'Pinging...' )
      .then( ( msg ) => {
        return msg.edit(
          `Latency is ${msg.createdTimestamp - message.createdTimestamp}ms. API latency is ${Math.round(
            this.client.ws.ping
          )}ms`
        );
      } )
      .catch( ( err ) => {
        this.client.logger.log( err );
      } );
  }
};
