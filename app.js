require( 'dotenv' ).config();

import Cactuar from './structures/Cactuar';

const errorDirnameRegex = new RegExp( `${__dirname}/`, 'g' ),
  client = new Cactuar( {
    disabledEvents: [
      'CHANNEL_PINS_UPDATE',
      'GUILD_BAN_ADD',
      'GUILD_BAN_REMOVE',
      'RELATIONSHIP_ADD',
      'RELATIONSHIP_REMOVE',
      'TYPING_START',
      'USER_NOTE_UPDATE',
      'USER_SETTINGS_UPDATE',
      'VOICE_SERVER_UPDATE',
      'VOICE_STATE_UPDATE'
    ],
    disableEveryone: true,
    messageCacheMaxSize: 100,
    messageCacheLifetime: 240,
    messageSweepInterval: 300,
    shardCount: 'auto'
  } );

client.login( process.env.TOKEN );

client
  .on( 'disconnect', () => console.log( 'Bot is disconnecting...' ) )
  .on( 'reconnecting', () => console.log( 'Bot reconnecting...' ) )
  .on( 'error', ( err ) => console.error( err ) )
  .on( 'warn', ( info ) => console.warn( info ) );

process.on( 'uncaughtException', ( err ) => {
  const errorMsg = err.stack.replace( errorDirnameRegex, './' );

  console.error( `Uncaught Exception: ${errorMsg}` );
  process.exit( 1 );
} );
