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

  score( message ) {
    const regex = /\s+/gi,
      score = {
        multiplier: 1,
        wordCount: message.cleanContent.replace( regex, ' ' ).split( ' ' ).length,
        charCount: message.cleanContent.replace( regex, '' ).length,
        keywords: this.countKeywords( message.cleanContent )
      };

    score.points = Math.round(
      ( score.wordCount * 0.2 + score.charCount / 100 + score.keywords * 9 ) * score.multiplier
    );
    score.token = score.points >= 300 && message.settings.tokens ? 1 : 0;

    this.client.log.info( `${message.author.tag} Feedback score: ${score.points}` );
    return score;
  }

  countKeywords( input ) {
    let count = 0;

    this.keywords.forEach( ( word ) => {
      if ( input.includes( word ) ) {
        count++;
      }
    } );

    return count;
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
      this.client.log.error( err );

      return message.channel.send(
        'Feedback has been denied! The previous request message cannot be found, try scrolling up and finding some older tracks to give feedback to 😄'
      );
    }
  }
}
