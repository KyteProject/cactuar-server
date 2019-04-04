import Command from '../../structures/Command';
import * as fs from 'fs-nextra';

module.exports = class Keywords extends Command {
  constructor( ...args ) {
    super( ...args, {
      name: 'keywords',
      description: 'Manage bots keywords',
      category: 'Feedback',
      permLevel: 'Bot Owner'
    } );
  }

  async run( message, [ action, ...value ], level ) {
    let keywords = this.client.feedback.keywords.sort();

    if ( !action ) {
      let output = 'Keyword List\n===========\n\n';

      keywords.forEach( ( k ) => {
        output += `${k}, `;
      } );

      return message.channel.send( output.toProperCase(), { code: 'md' } );
    }

    if ( action === 'add' ) {
      if ( !value.length ) {
        return message.channel.send( 'Please provide a value to add.' );
      }

      try {
        const word = value[ 0 ].toLowerCase().replace( /[^a-z.]/gi, '' );

        if ( keywords.includes( word ) ) {
          return message.channel.send( 'Keyword already exists!' );
        }

        keywords.push( word );

        fs.writeJson( `${process.cwd()}/assets/keywords.json`, keywords );

        return message.react( '✅' );
      } catch ( err ) {
        this.client.log.error( err );
        return message.react( '❌' );
      }
    }

    if ( action === 'remove' ) {
      if ( !value.length ) {
        return message.channel.send( 'Please provide a value to remove.' );
      }

      try {
        const word = value[ 0 ].toLowerCase().replace( /[^a-z.]/gi, '' );

        if ( !keywords.includes( word ) ) {
          return message.channel.send( 'Keyword doesn\'t exist!' );
        }

        keywords = keywords.filter( ( a ) => a !== word );

        fs.writeJson( `${process.cwd()}/assets/keywords.json`, keywords );

        return message.react( '✅' );
      } catch ( err ) {
        this.client.log.error( err );
        return message.react( '❌' );
      }
    }
  }
};
