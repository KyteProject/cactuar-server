import Command from '../../structures/Command';
import * as fs from 'fs-nextra';

module.exports = class Urls extends Command {
  constructor( ...args ) {
    super( ...args, {
      name: 'urls',
      description: 'Fetch logs',
      category: 'System',
      permLevel: 'Bot Owner'
    } );
  }

  async run( message, [ action, ...value ], level ) {
    if ( !action ) {
      const links = this.client.feedback.urls.sort();
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

        if ( this.client.feedback.urls.includes( word ) ) {
          return message.channel.send( 'URL already exists!' );
        }

        this.client.feedback.urls.push( word );

        fs.writeJson( `${process.cwd()}/assets/urls.json`, this.client.feedback.urls );
      } catch ( err ) {
        this.client.log.error( err );

        return message.channel.send( 'Failed to write.' );
      }

      return message.channel.send( 'URL\'s updated.' );
    }

    if ( action === 'remove' ) {
      //
    }
  }
};
