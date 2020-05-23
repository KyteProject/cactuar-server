import request from 'request-promise';

class Util {
  constructor() {
    throw new Error( 'This class may not be initiated with new' );
  }

  static regExpEsc( str ) {
    return str.replace( Util.REGEXPESC, '\\$&' );
  }
}

// Naughty stuff~ ;<
Array.prototype.random = function() {
  return this[ Math.floor( Math.random() * this.length ) ];
};

String.prototype.toProperCase = function() {
  return this.replace( /([^\W_]+[^\s-]*) */g, txt => txt.charAt( 0 ).toUpperCase() + txt.substr( 1 ).toLowerCase() );
};

Util.wait = require( 'util' ).promisify( setTimeout );

Util.REGEXPESC = /[-/\\^$*+?.()|[\]{}]/g;

Util.checkUrl = async( url ) => {
  const lastResponse = JSON.parse( await request.get( url ) );

  console.log( lastResponse );
};

module.exports = Util;
