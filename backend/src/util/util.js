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
  return this.replace( /([^\W_]+[^\s-]*) */g, ( txt ) => txt.charAt( 0 ).toUpperCase() + txt.substr( 1 ).toLowerCase() );
};

Util.wait = require( 'util' ).promisify( setTimeout );

Util.REGEXPESC = /[-/\\^$*+?.()|[\]{}]/g;

module.exports = Util;
