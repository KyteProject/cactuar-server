require( 'dotenv' ).config();
require( './extenders/Message' );

import Cactuar from './structures/Cactuar';

const token = process.env.NODE_ENV === 'production' ? process.env.TOKEN : process.env.DEV_TOKEN,
  errorDirnameRegex = new RegExp( `${__dirname}/`, 'g' ),
  client = new Cactuar( {
    disabledEvents: [
      'CHANNEL_PINS_UPDATE',
      'GUILD_BAN_ADD',
      'GUILD_BAN_REMOVE',
      'RELATIONSHIP_ADD',
      'RELATIONSHIP_REMOVE',
      'TYPING_START',
      'VOICE_SERVER_UPDATE',
      'VOICE_STATE_UPDATE'
    ],
    disableEveryone: true,
    messageCacheMaxSize: 100,
    messageCacheLifetime: 240,
    messageSweepInterval: 300
  } );

client.login( token );

client
  .on( 'disconnect', () => client.log.warn( 'Bot is disconnecting...' ) )
  .on( 'reconnecting', () => client.log.warn( 'Bot reconnecting...' ) )
  .on( 'error', ( err ) => client.log.error( err ) )
  .on( 'warn', ( info ) => client.log.warn( info ) );

process.on( 'uncaughtException', ( err ) => {
  const errorMsg = err.stack.replace( errorDirnameRegex, './' );

  client.log.error( `Uncaught Exception: ${errorMsg}` );
  process.exit( 1 );
} );
