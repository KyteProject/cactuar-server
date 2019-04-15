import Command from '../../structures/Command';
import * as fs from 'fs-nextra';

module.exports = class Urls extends Command {
  constructor( ...args ) {
    super( ...args, {
      name: 'urls',
      description: 'Fetch list of URL\'s to check for',
      category: 'Feedback'
    } );
  }

  async run( message, [ action, ...value ], level ) {
    let urls = this.client.feedback.urls;

    if ( !action ) {
      const links = urls.sort();
      let output = 'URL List\n========\n\n';

      links.forEach( ( k ) => {
        output += `${k}, `;
      } );

      return message.channel.send( output.toProperCase(), { code: 'md' } );
    }

    if ( level < 4 ) {
      return;
    }

    if ( action === 'add' ) {
      if ( !value.length ) {
        return message.channel.send( 'Please provide a value to add.' );
      }

      try {
        const word = value[ 0 ].toLowerCase().replace( /[^a-z.]/gi, '' );

        if ( urls.includes( word ) ) {
          return message.channel.send( 'URL already exists!' );
        }

        urls.push( word );

        fs.writeJson( `${process.cwd()}/assets/urls.json`, urls );

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

        if ( !urls.includes( word ) ) {
          return message.channel.send( 'URL doesn\'t exist!' );
        }

        urls = urls.filter( ( a ) => a !== word );

        fs.writeJson( `${process.cwd()}/assets/urls.json`, urls );

        return message.react( '✅' );
      } catch ( err ) {
        this.client.log.error( err );
        return message.react( '❌' );
      }
    }
  }
};
