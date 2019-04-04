import Command from '../../structures/Command';
import * as fs from 'fs-nextra';

module.exports = class Last extends Command {
  constructor( ...args ) {
    super( ...args, {
      name: 'last',
      description: 'Shows the last tracks submitted for feedback.',
      category: 'Feedback'
    } );
  }

  async run( message, [ action, ...value ], level ) {
    //
  }
};
