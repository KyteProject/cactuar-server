export default class Feedback {
  constructor() {
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
}
