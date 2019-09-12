import Command from '../../structures/Command';

module.exports = class Conf extends Command {
  constructor( ...args ) {
    super( ...args, {
      name: 'conf',
      description: 'This is the primary configuration command.',
      category: 'System',
      permLevel: 'Administrator',
      guildOnly: true,
      usage: '.conf <edit> <key> <value>',
      extended:
				'This is the primary configuration command. Using it without arguments will list the current guild config, find a value you wish to change and use this command with the edit argument to change it - see usage above.'
    } );
  }

  async run( message, [ action, key, ...value ] ) {
    const settings = message.settings;

    delete settings.gid;
    delete settings.name;

    if ( !action ) {
      const array = [];

      Object.entries( settings ).forEach( ( [ k, v ] ) => {
        array.push(
          `| <${k}>${' '.repeat( 19 - k.slice( 0, 19 ).length )}| < ${v} > ${' '.repeat(
            19 - String( v ).slice( 0, 19 ).length
          )}|`
        );
      } );

      message.channel.send(
        `\`\`\`md\nGuild Settings\n==============\n\n| Key                  | Value                   |\n|:--------------------:| -----------------------:|\n${array.join(
          '\n'
        )}\n\nTo change use: .conf edit <key> < value >\n> .conf edit adminRole Admin\`\`\``
      );
    }

    if ( action === 'edit' ) {
      if ( !key ) {
        return message.channel.send( 'Please specify a setting to edit.' );
      }

      if ( settings[ key ] === undefined ) {
        return message.channel.send( `The key "${key}" does not exist.` );
      }

      if ( !value.length ) {
        return message.channel.send( 'Please specify a new value.' );
      }

      // eslint-disable-next-line eqeqeq
      if ( value.join( ' ' ) == String( settings[ key ] ) ) {
        return message.channel.send( 'This key already has that value.' );
      }

      // Prefix validity checking
      if ( key === 'prefix' && value.join( '' ).length !== 1 ) {
        return message.channel.send( 'Prefix should be a single character.' );
      }

      // Channel validity checking
      if ( key === 'feedback_channel' ) {
        try {
          value[ 0 ] = await message.verifyChannel( value );
        } catch ( err ) {
          return message.channel.send( err );
        }
      }

      // Role validity checking
      if ( key === 'admin_role' || key === 'mod_role' ) {
        const match = /([0-9]{17,20})/.exec( value );

        if ( !match ) {
          return message.channel.send( 'Not a valid role.' );
        }

        try {
          const check = await message.guild.roles.resolve( match[ 1 ] );

          if ( !check.name ) {
            throw err;
          }

          value[ 0 ] = check.name;
        } catch ( err ) {
          return message.channel.send( 'This role does not exist.' );
        }
      }

      // Write to DB and update cache
      try {
        const res = await this.client.db.writeSettings( key, value.join( ' ' ), message.guild.id );

        this.client.updateCache();

        message.channel.send( `${res}` );
      } catch ( err ) {
        this.client.log.error( err );
      }
    }
  }
};
