import { MessageEmbed } from 'discord.js';
import Command from '../../structures/Command';

module.exports = class Last extends Command {
  constructor( ...args ) {
    super( ...args, {
      name: 'stats',
      description: 'Shows some feedback bot stats!',
      category: 'Feedback'
    } );
  }

  async run( message ) {
    //
  }
};
