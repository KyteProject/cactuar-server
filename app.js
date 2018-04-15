require(`${process.cwd()}/extenders/Guild.js`);
require(`${process.cwd()}/modules/Prototypes.js`);
if (Number(process.version.slice(1).split('.')[0]) < 8) throw new Error('Node 8.0.0 or higher is required.');

const { Client, Collection } = require('discord.js');
const klaw = require('klaw');
const path = require('path');
const sql = require('sqlite');

class FeedBot extends Client {
  constructor(options) {
    super(options);
    this.config = require(`${process.cwd()}/config.js`);
    this.logger = require(`${process.cwd()}/functions/logger`);
    this.query = require(`${process.cwd()}/functions/query.js`);
    this.ccxt = require ('ccxt');
    this.commands = new Collection();
    this.aliases = new Collection();
    this.rateLimits = new Collection();
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
    } catch (error) {
      return `Unable to load command ${commandName}: ${error}`;
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
  fetchAllMembers: false,
  disableEveryone: true,
  disabledEvents:['GUILD_BAN_REMOVE', 'TYPING_START', 'USER_NOTE_UPDATE', 'USER_SETTINGS_UPDATE', 'VOICE_SERVER_UPDATE', 'VOICE_STATE_UPDATE'],
  messageCacheSize: 100,
  messageCacheLifetime: 300,
  messageSweepInterval: 150
});

require(`${process.cwd()}/functions/feedback.js`)(client);
require(`${process.cwd()}/functions/util.js`)(client);

if (sql.open(`${process.cwd()}/database/feedbot.sqlite`)) {client.logger.log('SQLite DB loaded.');}

const init = async () => {

  const commandList = [];
  klaw('./commands').on('data', (item) => {
    const file = path.parse(item.path);
    if (!file.ext || file.ext !== '.js') return;
    const response = client.loadCommand(file.dir, `${file.name}${file.ext}`);
    commandList.push(file.name);
    if (response) client.logger.error(response);
  }).on('end', () => {
    client.logger.log(`Loaded a total of ${commandList.length} commands.`);
  }).on('error', (error) => client.logger.error(error));

  const extendList = [];
  klaw("./extenders").on("data", (item) => {
    const extFile = path.parse(item.path);
    if (!extFile.ext || extFile.ext !== ".js") return;
    try {
      require(`${extFile.dir}${path.sep}${extFile.base}`);
      extendList.push(extFile.name);
    } catch (error) {
      client.logger.error(`Error loading ${extFile.name} extension: ${error}`);
    }
  }).on("end", () => {
    client.logger.log(`Loaded a total of ${extendList.length} extensions.`);
  }).on("error", (error) => client.logger.error(error));

  const eventList = [];
  klaw('./events').on('data', (item) => {
    const eventFile = path.parse(item.path);
    if (!eventFile.ext || eventFile.ext !== '.js') return;
    const eventName = eventFile.name.split('.')[0];
    try {
      const event = new (require(`${eventFile.dir}${path.sep}${eventFile.name}${eventFile.ext}`))(client);
      eventList.push(event);
      client.on(eventName, (...args) => event.run(...args));
      client.logger.log(`Loading Event: ${eventName}. ✔`);
      delete require.cache[require.resolve(`${eventFile.dir}${path.sep}${eventFile.name}${eventFile.ext}`)];
    } catch (error) {
      client.logger.error(`Error loading event ${eventFile.name}: ${error}`);
    }
  }).on('end', () => {
    client.logger.log(`Loaded a total of ${eventList.length} events.`);
  }).on('error', (error) => client.logger.error(error));

  client.levelCache = {};
  for (let i = 0; i < client.config.permLevels.length; i++) {
    const thisLevel = client.config.permLevels[i];
    client.levelCache[thisLevel.name] = thisLevel.level;
  }

  client.login(client.config.token);
};

init();

client.on('disconnect', () => client.logger.warn('Bot is disconnecting...'))
  .on('reconnect', () => client.logger.log('Bot reconnecting...', 'log'))
  .on('error', error => client.logger.error(error))
  .on('warn', info => client.logger.warn(info));
