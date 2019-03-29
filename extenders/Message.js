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

      async awaitReply( question, filter, limit = 60000, embed ) {
        await this.channel.send( question, embed );

        return this.channel
          .awaitMessages( filter, { max: 1, time: limit, errors: [ 'time' ] } )
          .then( ( collected ) => collected.first().content )
          .catch( () => false );
      }
    }
);
