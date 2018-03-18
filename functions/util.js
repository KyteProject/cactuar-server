module.exports = (client) => {

  client.keywords = require(`${process.cwd()}/resources/keywords.json`);
  client.urls = require(`${process.cwd()}/resources/links.json`);

  client.verifyUser = async (user) => {
    try {
      const match = /(?:<@!?)?([0-9]{17,20})>?/gi.exec(user);
      if (!match) throw 'Invalid user';
      const id = match[1];
      const check = await client.users.fetch(id);
      if (check.username !== undefined) return check;
    } catch (error) {
      // client.logger.log(error, 'error');
    }
  };

  client.verifyMember = async (guild, member) => {
    try {
      const user = await this.verifyUser(member);
      const target = await guild.fetchMember(user);
      return target;
    } catch (error) {
      throw error;
    }
  };

  client.verifyMessage = async (message, msgid) => {
    try {
      const match = /([0-9]{17,20})/.exec(msgid);
      if (!match) throw 'Invalid message id.';
      const id = match[1];
      const check = await message.channel.messages.fetch(id);
      if (check.cleanContent !== undefined) return id;
    } catch (error) {
      client.logger.log(error, 'error');
    }
  };

  client.verifyChannel = async (message, chanid) => {
    try {
      const match = /([0-9]{17,20})/.exec(chanid);
      if (!match) return message.channel.id;
      const id = match[1];
      const check = await client.channels.resolve(id);
      if (check.name !== undefined && check.type === 'text') return id;
    } catch (error) {
      throw error;
    }
  };

  // Clean text input
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

  // Sanitise settings input
  client.verifyKey = async (message, settings, key, input) => {
    if (key === 'botLogEnable' || key === 'enableBadges' || 
        key === 'deleteSwitch' || key === 'pinMessage') {
      const match = /[0-1]/.exec(input);
      if (!match || (input.length != 1)) return message.reply('Value must be a 1 or a 0  (1 = enabled / 0 = dissabled)');
      settings[key] = parseInt(input, 10);
      return settings;
    } 
    else if (key === 'feedbackChannel') {
      try {
        const match = /([0-9]{17,20})/.exec(input);
        if (!match) return message.reply('Not a valid channel');
        const id = match[1];
        const check = await client.channels.resolve(id);
        if (check.name !== undefined && check.type === 'text') {
          settings[key] = check.id;
          return settings;
        }
      } catch (error) {
        throw message.reply('This channel does not exist.');
      }
    }
    else if (key === 'messageID') {
      try {
        const match = /([0-9]{17,20})/.exec(input);
        if (!match) throw message.reply('Invalid message id.');
        settings[key] = input;
        return settings;
      }
      catch (error) {
        throw error;
      }
    }
    else if (key === 'modRole' || key === 'adminRole') {
      try {
        const match = /([0-9]{17,20})/.exec(input);
        if (!match) return message.reply('not a valid Role.');
        const id = match[1];
        const check = await message.guild.roles.resolve(id);
        if (check.name !== undefined) {
          settings[key] = check.name;
          return settings;
        }
      }
      catch (error) {
        throw message.reply('This role does not exist.');
      }
    }
    else if (key === 'response') {
      try {
        if (input.length > 250) return message.reply('Invalid response string. Input must be alphanumeric, include only `(_.,!?:;&()^`, and be under 250 characters');
        settings[key] = input.replace(/[^a-z0-9 _.,!)?:(;&^]/gi, '');
        return settings;
      }
      catch (error) {
        throw error;
      }
    }
  };

  client.awaitReply = async (message, question, filter, limit = 50000, embed) => {
    await message.channel.send(question, embed);
    try {
      const collected = await message.channel.awaitMessages(filter, { max: 1, time: limit, errors: ["time"] });
      return collected.first().content;
    } catch (error) {
      client.logger.error(error);
      return false;
    }
  };

  // Pluralise string
  String.prototype.toPlural = function() {
    return this.replace(/((?:\D|^)1 .+?)s/g, '$1');
  };

  // Randomise Array
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