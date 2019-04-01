import { MessageEmbed } from 'discord.js';

export default class Feedback {
  constructor( client ) {
    this.client = client;
    this.urls = require( '../assets/urls.json' );
    this.keywords = require( '../assets/keywords.json' );
  }

  isRequest( message ) {
    const fileRegex = /\.(mp3|wav|wma|flac|ogg|m4a|mp4|m4b|aac)/gim;

    for ( let i = 0; i < this.urls.length; i++ ) {
      if ( message.cleanContent.includes( this.urls[ i ] ) ) {
        return true;
      }
    }

    if ( message.attachments.size ) {
      message.attachments.each( ( file ) => {
        if ( fileRegex.exec( file.name ) !== null ) {
          return true;
        }
      } );
    }
  }

  async verifyUser( jID, name ) {
    try {
      let user = await this.client.db.getUser( jID );

      if ( !user ) {
        user = await this.client.db.addUser( jID, name );
      }

      return user;
    } catch ( err ) {
      return this.client.log.error( err );
    }
  }

  rejectMessage( message, oldMsg ) {
    try {
      let embed = new MessageEmbed();

      if ( oldMsg.attachments.size > 0 ) {
        let files = [];

        oldMsg.attachments.each( ( file ) => {
          files.push( file );
        } );

        embed.setDescription( oldMsg.cleanContent ).attachFiles( files );
      }

      if ( oldMsg.embeds.length > 0 ) {
        embed = oldMsg.embeds[ 0 ];
      }

      if ( oldMsg.embeds.length === 0 && oldMsg.attachments.size === 0 ) {
        embed.setDescription( oldMsg.cleanContent );
      }

      embed
        .setAuthor( 'Last Request:', this.client.user.avatarURL() )
        .setColor( '00d919' )
        .setTimestamp( oldMsg.createdAt )
        .setFooter( oldMsg.author.username, oldMsg.author.avatarURL() );

      return message.reply( `❌ **Feedback Denied!** ❌\n${message.settings.response}`, embed );
    } catch ( err ) {
      //
    }
  }
}
