import Event from '../structures/Event.js';

module.exports = class extends Event {
  constructor( ...args ) {
    super( ...args );

    this.urlRegex = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/;
  }

  async run( message, args ) {
    if ( message.author.bot ) {
      return;
    }

    if ( message.guild && !message.guild.me ) {
      await message.guild.members.fetch( this.client.user );
    }

    if ( message.guild && !message.channel.id ) {
      return;
    }

    const prefix = new RegExp(
      `^<@!?${this.client.user.id}> |^${this.client.methods.util.regExpEsc( message.settings.prefix )}`
    ).exec( message.content );

    if ( prefix ) {
      const args = message.content
          .slice( prefix[ 0 ].length )
          .trim()
          .split( / +/g ),
        cmd = this.client.commands.get( args.shift().toLowerCase() );

      if ( cmd ) {
        if ( cmd.guildOnly && !message.guild ) {
          return message.channel.send( 'Please run this command in a guild.' );
        }

        const level = this.client.permlevel( message );

        message.author.permLevel = level;

        if ( level < this.client.levelCache[ cmd.permLevel ] ) {
          return message.channel.send( 'Command level not met.' );
        }

        while ( args[ 0 ] && args[ 0 ][ 0 ] === '-' ) {
          message.flags.push( args.shift().slice( 1 ) );
        }
        await this.runCommand( message, cmd, args );
      }
    }

    if ( message.channel.id === message.settings.feedbackchannel ) {
      const args = message.content.trim().split( / +/g ),
        mentioned = message.mentions.members.first();

      // handle feedback requests
      if ( this.isRequest( message ) ) {
        //
      }

      // handle submission requests
      if ( this.isSubmission( message, args ) ) {
        //
      }
    }
  }

  async runCommand( message, cmd, args ) {
    try {
      await cmd.run( message, args );
    } catch ( err ) {
      this.client.log.error( err );
    }
  }

  isRequest( message ) {
    const fileRegex = /\.(mp3|wav|wma|flac|ogg|m4a|mp4|m4b|aac)/gim;

    urls.forEach( ( url ) => {
      if ( message.cleanContent.includes( url ) ) {
        return true;
      }
    } );

    if ( message.attachments.size ) {
      message.attachments.each( ( file ) => {
        if ( fileRegex.exec( file.name ) !== null ) {
          return true;
        }
      } );
    }
  }

  isSubmission( message ) {
    if ( !message.mentions.memebers ) {
      return false;
    }

    return message.mentions.members.first();
  }
};
