import { Structures } from 'discord.js';

module.exports = Structures.extend(
  'Message',
  ( Message ) =>
    class extends Message {
      constructor( ...args ) {
        super( ...args );

        this.settings = this.guild					? this.client.getGuildSettings( this.guild.id )					: this.client.getGuildSettings();
      }

      get member() {
        if ( this.guild ) {
          return super.member;
        }
        return {
          user: this.channel.recipient,
          displayName: this.channel.recipient.username
        };
      }

      async verifyChannel( value ) {
        try {
          const match = /([0-9]{17,20})/.exec( value );
          let check;

          if ( !match ) {
            throw new Error( 'Not a valid channel.' );
          }

          try {
            check = await this.client.channels.resolve( match[ 1 ] );
          } catch ( e ) {
            throw new Error( 'Channel does not exist.' );
          }

          if ( !check.type === 'text' ) {
            throw new Error( 'Not a text channel.' );
          }

          return match[ 1 ];
        } catch ( err ) {
          throw err.message;
        }
      }

      async verifyMessage( message, input ) {
        for ( let i = 0; i < input.length; i++ ) {
          try {
            const oldMsg = await message.channel.messages.fetch( input[ i ].msg );

            if ( oldMsg ) {
              return oldMsg;
            }
          } catch ( err ) {
            this.client.db.removeMessage( input[ i ].msg );
          }
        }
      }

      async verifyAllMessage( message, input ) {
        let msgArray = [];

        for ( let i = 0; i < input.length; i++ ) {
          try {
            const oldMsg = await message.channel.messages.fetch( input[ i ].msg );

            if ( oldMsg ) {
              msgArray.push( oldMsg );
            }
          } catch ( err ) {
            this.client.db.removeMessage( input[ i ].msg );
          }
        }

        return msgArray;
      }

      async awaitReply( question, filter, limit = 60000, embed ) {
        await this.channel.send( question, embed );

        return this.channel
          .awaitMessages( filter, { max: 1, time: limit, errors: [ 'time' ] } )
          .then( ( collected ) => collected.first().content )
          .catch( () => false );
      }
    }
);
