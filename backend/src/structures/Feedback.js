import { MessageEmbed } from 'discord.js';
import linksList from '../assets/urls';
import keywordList from '../assets/keywords';

export default class Feedback {
  constructor( client ) {
    this.client = client;
    this.urls = linksList;
    this.keywords = keywordList;
  }

  isRequest( message ) {
    const fileRegex = /\.(mp3|wav|wma|flac|ogg|m4a|mp4|m4b|aac)/gim;
    let ret;

    for ( let i = 0; i < this.urls.length; i++ ) {
      if ( message.cleanContent.includes( this.urls[ i ] ) ) {
        return true;
      }
    }

    if ( message.attachments.size ) {
      message.attachments.each( ( file ) => {
        if ( fileRegex.exec( file.name ) !== null ) {
          ret = true;
        }
      } );
    }

    return ret;
  }

  nextLevel( level ) {
    const nextPoints = 1 / 4 * Math.floor( level + 300 * Math.pow( 1.5, level / 7 ) );

    return Math.floor( nextPoints );
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
    score.tokens = score.points >= 300 && message.settings.tokens ? 1 : 0;

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

  rejectMessage( message, oldMsg, type ) {
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

      if ( type !== 'command' ) {
        return message.reply( `❌ **Feedback Denied!** ❌\n${message.settings.response}`, embed );
      }

      return message.channel.send( embed );
    } catch ( err ) {
      this.client.log.error( err );

      return message.channel.send(
        'Feedback has been denied! The previous message cannot be found, ask a mod to update the database.'
      );
    }
  }

  async processRequest( jID, mID, gID, aID, message ) {
    const user = await this.verifyUser( jID, message.author.tag );

    if ( user.disabled ) {
      return message.delete();
    }

    // Process rejection
    if ( user.keywords < message.settings.threshold && user.tokens <= 0 ) {
      if ( message.settings.delete ) {
        message.delete();
      }

      if ( message.settings.response ) {
        const oldMessages = await this.client.db.fetchMessages( gID, 5 ),
          oldMsg = await this.verifyMessage( message, oldMessages );

        this.rejectMessage( message, oldMsg );
      }

      return this.client.log.info( `Feedback denied for: ${message.author.tag}` );
    }

    // Check for token use
    if ( user.keywords < message.settings.threshold && user.tokens > 0 ) {
      this.client.db.removeToken( jID );
    }

    // Pin/Unpin messages
    if ( message.settings.pin ) {
      try {
        const oldMessages = await this.client.db.fetchMessages( gID, 1 ),
          oldMsg = await this.verifyMessage( message, oldMessages );

        message.pin();
        oldMsg.unpin();
      } catch ( err ) {
        this.client.log.error( err );
      }
    }

    // Update user info and msg DB
    try {
      this.client.db.insertMessage( mID, gID, aID );
      this.client.db.updateUserRequest( jID, message.createdAt.toString() );

      return message.react( '537604635687518245' );
    } catch ( err ) {
      return this.client.log.error( err );
    }
  }

  async processSubmission( jID, gID, message, mentioned ) {
    try {
      const user = await this.verifyUser( jID, message.author.tag ),
        oldMessages = await this.client.db.fetchMessages( gID, 5 );

      if ( !oldMessages.find( msg => msg.author === mentioned.id ) ) {
        return;
      }

      const score = this.score( message ),
        data = {
          current: user.current + score.points,
          total: user.total + score.points,
          tokens: user.tokens + score.tokens,
          submissions: user.submissions + 1,
          keywords: user.keywords + score.keywords
        };

      if ( data.current >= user.next ) {
        data.current = 0;
        data.level = user.level + 1;
        data.next = user.next + this.nextLevel( data.level );

        message.channel.send( `${message.author.username} just reached level ${data.level}! 🎵` );
      } else {
        data.level = user.level;
        data.next = user.next;
      }

      await this.client.db.updateUserSubmission( jID, data );

      if ( user.keywords < message.settings.threshold && data.keywords >= message.settings.threshold ) {
        message.reply( 'You can now request feedback! <:cactuar:537604635687518245>' );
      }

      return;
    } catch ( err ) {
      return this.client.log.error( err );
    }
  }
}
