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

    // Handle feedback
    if ( message.channel.id === message.settings.feedbackchannel ) {
      const args = message.content.trim().split( / +/g );

      // handle feedback requests
      if ( this.client.feedback.isRequest( message ) ) {
        const jID = `${message.guild.id}-${message.author.id}`;

        try {
          const user = this.client.db.getUser( jID );
        } catch ( err ) {
          this.client.db.addUser( jID, message.author.username );
        }

        // check if hve met threshold

        // delete/allow

        // update user

        // pin message
        if ( message.settings.pin ) {
          return message.pin();
        }
      }

      // handle submission requests
      if ( message.mentions.memebers ) {
        const mentioned = message.mentions.members.first();

        // verify users exist and are in DB
        // check if mentioned user has submitted feedback
        // score feedback
        // update users
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
