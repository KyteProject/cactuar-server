/*
TODO: link submission to system
TODO: If link is youtube check to see if the word 'feedback' appears in teh same message, if so perform a check that requires y/n input from user.
TODO: React to sccessfull link
TODO: do not allow multi-links
TODO: acheivements
TODO: feedback master role
TODO: say command will not delete message if channel is specified.
TODO: ready event, check for guilds added offline
*/

if (process.version.slice(1).split('.')[0] < 8) throw new Error('Node 8.0.0 or higher is required. Update Node on your system.');

const { Client } = require('discord.js');
const { Collection } = require('discord.js');
//const timestamp = require('log-timestamp');
const {readdir} = require('fs-nextra');
const klaw = require('klaw');
const path = require('path');
const sql = require('sqlite');


class FeedBot extends Client {
  constructor(options) {
    super(options);
    this.config = require('./config.js');
    this.logger = require('./functions/logger');
    this.commands = new Collection();
    this.aliases = new Collection();
  }

  permlevel(message) {
    let permlvl = 0;
    const permOrder = client.config.permLevels.slice(0).sort((p, c) => p.level < c.level ? 1 : -1);
    while (permOrder.length) {
      const currentLevel = permOrder.shift();
      if (message.guild && currentLevel.guildOnly) continue;
      if (currentLevel.check(message)) {
        permlvl = currentLevel.level;
        break;
      }
    }
    return permlvl;
  }

  // // Console log mofified
  // log(type, message, title) {
  //   if (!title) title = 'Log';
  //   console.log(`[${type}] [${title}] ${message}`);
  // }

  permCheck(message, perms) {
    if (message.channel.type !== 'text') return;
    return message.channel.permissionsFor(message.guild.me).missing(perms);
  }

  loadCommand(commandPath, commandName) {
    try {
      const props = new require(`${commandPath}${path.sep}${commandName}`);
      props.conf.location = commandPath;
      client.logger.log(`Loading Command: ${props.help.name}. ✔`);
      if (props.init) {
        props.init(client);
      }
      client.commands.set(props.help.name, props);
      props.conf.aliases.forEach(alias => {
        client.aliases.set(alias, props.help.name);
      });
      return false;
    } catch (e) {
      return `Unable to load command ${commandName}: ${e}`;
    }
  }

  async unloadCommand(commandPath, commandName) {
    let command;
    if (client.commands.has(commandName)) {
      command = client.commands.get(commandName);
    } else if (client.aliases.has(commandName)) {
      command = client.commands.get(client.aliases.get(commandName));
    }
    if (!command) return `The command \`${commandName}\` doesn"t seem to exist, nor is it an alias. Try again!`;
    
    if (command.shutdown) {
      await command.shutdown(client);
    }
    delete require.cache[require.resolve(`${commandPath}/${commandName}.js`)];
    return false;
  }
}

const client = new FeedBot({
  fetchAllMembers: true,
  disabledEvents: ['TYPING_START'],
});

require('./functions/util.js')(client);
require('./functions/query.js')(client);
if (sql.open('./database/feedbot.sqlite')) {client.logger.log('SQLite DB loaded.');}

const init = async () => {
  klaw('./commands').on('data', (item) => {
    const file = path.parse(item.path);
    if (!file.ext || file.ext !== '.js') return;
    const response = client.loadCommand(file.dir, `${file.name}${file.ext}`);
    if (response) client.logger.log(response);
  });

  const eventFiles = await readdir('./events/');
  client.logger.log(`Loading a total of ${eventFiles.length} events.`);
  eventFiles.forEach(file => {
    const eventName = file.split('.')[0];
    const event = new require(`./events/${file}`);
    client.on(eventName, event.bind(null, client));  
    client.logger.log(`Loading Event: ${eventName}. ✔`);
    delete require.cache[require.resolve(`./events/${file}`)];  
  });
  
  client.levelCache = {};
  for (let i = 0; i < client.config.permLevels.length; i++) {
    const thisLevel = client.config.permLevels[i];
    client.levelCache[thisLevel.name] = thisLevel.level;
  }

  client.login(client.config.token);
};

init();
