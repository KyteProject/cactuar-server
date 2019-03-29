import Command from '../../structures/Command';

module.exports = class Conf extends Command {
  constructor( ...args ) {
    super( ...args, {
      name: 'conf',
      description: 'View or change server configuration.',
      category: 'System',
      permLevel: 'Administrator'
    } );
  }

  run( message, [ action, key, ...value ], level ) {
    const settings = message.settings;

    delete settings.gid;
    delete settings.name;

    if ( !action ) {
      const array = [];

      Object.entries( settings ).forEach( ( [ k, v ] ) => {
        array.push(
          `| <${k}>${' '.repeat( 16 - k.length )}| < ${v} > ${' '.repeat( 19 - String( v ).slice( 0, 19 ).length )}|`
        );
      } );

      message.channel.send(
        `\`\`\`md\nGuild Settings\n==============\n\n| Key               | Value                   |\n|:-----------------:| -----------------------:|\n${array.join(
          '\n'
        )}\n\nTo change use: .conf edit <key> < value >\n> .conf edit adminRole Admin\`\`\``
      );
    }

    if ( action === 'edit' ) {
      //
    }
  }
};
