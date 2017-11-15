module.exports = (client) => {

  //Clean text input
  client.clean = async (client, text) => {
    if (text && text.constructor.name == 'Promise')
      text = await text;
    if (typeof evaled !== 'string') text = require('util').inspect(text, { depth: 1 });
    
    text = text
      .replace(/`/g, '`' + String.fromCharCode(8203))
      .replace(/@/g, '@' + String.fromCharCode(8203))
      .replace(client.config.token, 'token? lol');

    return text;
  };

  // Pluralise string
  String.prototype.toPlural = function() {
    return this.replace(/((?:\D|^)1 .+?)s/g, '$1');
  };

  //Randomise Array
  Array.prototype.random = function() {
    return this[Math.floor(Math.random() * this.length)];
  };

  // Capitalises Every Word Like This
  String.prototype.toProperCase = function() {
    return this.replace(/([^\W_]+[^\s-]*) */g, function(txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  };

  // `await client.wait(1000);` to "pause" for 1 second.
  client.wait = require('util').promisify(setTimeout);
  
  //Error handling
  process.on('uncaughtException', (err) => {
    const errorMsg = err.stack.replace(new RegExp(`${__dirname}/`, 'g'), './');
    console.error('Uncaught Exception: ', errorMsg);
    process.exit(1);
  });
    
  process.on('unhandledRejection', err => {
    console.error('Uncaught Promise Error: ', err);
  });
};