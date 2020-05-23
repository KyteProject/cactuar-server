import { MessageAttachment } from 'discord.js';
import Event from '../structures/Event.js';

module.exports = class extends Event {
  constructor( ...args ) {
    super( ...args );
  }

  async run( message ) {
    if ( message.author.bot ) {
      return;
    }

    if ( message.mentions.members.size && message.mentions.members.first().user.bot ) {
      const attachment = new MessageAttachment( './assets/cac-respond.png' );

      return message.channel.send( `*uses **10,000 needles** on <@${message.author.id}>*`, attachment );
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
        await this.runCommand( message, cmd, args, level );
      }

      return;
    }

    // Handle Feedback
    if ( message.channel.id === message.settings.feedback_channel ) {
      const [ jID, mID, gID, aID ] = [
        `${message.guild.id}-${message.author.id}`,
        message.id,
        message.guild.id,
        message.author.id
      ];

      // Feedback Requests
      try {
        if ( this.client.feedback.isRequest( message ) ) {
          this.client.feedback.processRequest( jID, mID, gID, aID, message );
        }
      } catch ( err ) {
        this.client.log.error( `Feedback Request fault: ${err}` );
      }

      if ( !message.mentions.members.size ) {
        return;
      }

      // Feedback Submissions
      try {
        const mentioned = message.mentions.members.first();

        if ( mentioned.id === message.author.id || mentioned.user.bot ) {
          return;
        }

        this.client.feedback.processSubmission( jID, gID, message, mentioned );
      } catch ( err ) {
        return this.client.log.error( `Feedback Submission fault: ${err}` );
      }
    }
  }

  async runCommand( message, cmd, args, level ) {
    try {
      await cmd.run( message, args, level );
    } catch ( err ) {
      this.client.log.error( err );
    }
  }
};
