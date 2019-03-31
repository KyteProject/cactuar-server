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

Util.wait = require( 'util' ).promisify( setTimeout );

Util.REGEXPESC = /[-/\\^$*+?.()|[\]{}]/g;

module.exports = Util;
