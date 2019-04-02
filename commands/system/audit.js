import { MessageAttachment } from 'discord.js';
import Command from '../../structures/Command';

module.exports = class Audit extends Command {
  constructor( ...args ) {
    super( ...args, {
      name: 'audit',
      description: 'Fetch logs',
      category: 'System',
      permLevel: 'Bot Owner'
    } );
  }

  async run( message ) {
    const errorLog = new MessageAttachment( 'error.log' ),
      combinedLog = new MessageAttachment( 'combined.log' );

    message.channel.send( 'Combined log', combinedLog );
    message.channel.send( 'Error log', errorLog );
  }
};
