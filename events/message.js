import Event from '../structures/Event.js';

module.exports = class extends Event {
  constructor( ...args ) {
    super( ...args );
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

    // Handle commands
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

      return;
    }

    // Handle Feedback
    if ( message.channel.id === message.settings.feedbackchannel ) {
      const args = message.content.trim().split( / +/g ),
        [ jID, mID, gID, aID ] = [
          `${message.guild.id}-${message.author.id}`,
          message.id,
          message.guild.id,
          message.author.id
        ];

      // Feedback Requests
      if ( this.client.feedback.isRequest( message ) ) {
        const user = await this.client.feedback.verifyUser( jID, message.author.tag );

        // Process rejection
        if ( user.keywords < message.settings.threshold && user.tokens <= 0 ) {
          if ( message.settings.delete ) {
            message.delete();
          }

          if ( message.settings.response ) {
            const oldMessages = await this.client.db.fetchMessages( gID, 5 ),
              oldMsg = await this.client.feedback.verifyMessage( message, oldMessages );

            this.client.feedback.rejectMessage( message, oldMsg );
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
              oldMsg = await this.client.feedback.verifyMessage( message, oldMessages );

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

      // Feedback Submissions
      if ( !message.mentions.members.size ) {
        return;
      }

      const mentioned = message.mentions.members.first();

      if ( mentioned.id === message.author.id || mentioned.user.bot ) {
        return;
      }

      try {
        const user = await this.client.feedback.verifyUser( jID, message.author.tag ),
          oldMessages = await this.client.db.fetchMessages( gID, 5 );

        // Check mentioned user has registered feedback
        if ( !oldMessages.find( ( msg ) => msg.author === mentioned.id ) ) {
          return;
        }

        // score feedback
        this.client.feedback.score( message );

        // update users
      } catch ( err ) {
        this.client.log.error( err );
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
};
