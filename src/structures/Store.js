import { Collection } from 'discord.js';
import path from 'path';
import * as fs from 'fs-nextra';

class Store extends Collection {
  constructor( client, name ) {
    super();

    this.client = client;
    this.name = name;
    this.dir = `${path.dirname( require.main.filename )}${path.sep}${name}`;
  }

  set( piece ) {
    const exists = this.get( piece.name );

    if ( exists ) {
      this.delete( piece.name );
    }

    super.set( piece.name, piece );
    return piece;
  }

  delete( key ) {
    const exists = this.get( key );

    return !exists ? false : super.delete( key );
  }

  load( file ) {
    const filepath = path.join( this.dir, file );

    try {
      const parsedFile = {
          path: file,
          name: path.parse( filepath ).name
        },
        piece = this.set( new ( require( filepath ) )( this.client, parsedFile ) );

      delete require.cache[ filepath ];
      return piece;
    } catch ( err ) {
      console.error( `Failed to load ${this.name.slice( 0, -1 )} (${filepath}). Error:\n${err.stack || err}` );
      return null;
    }
  }

  async loadFiles() {
    this.clear();
    await this.walkFiles();
    return this.size;
  }

  async walkFiles() {
    return fs
      .scan( this.dir, { filter: ( stats, filepath ) => stats.isFile() && path.extname( filepath ) === '.js' } )
      .then( files => Promise.all( [ ...files.keys() ].map( file => this.load( path.relative( this.dir, file ) ) ) ) )
      .catch( err => console.error( err ) );
  }
}

export default Store;
