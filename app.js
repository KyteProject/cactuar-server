/*
TODO: Set up DB
TODO: setup command permissions
TODO: link submission to system
TODO: If link is youtube check to see if the word 'feedback' appears in teh same message, if so perform a check that requires y/n input from user.
TODO: React to sccessfull link
TODO: do not allow multi-links
TODO: acheivements
TODO: feedback master role
*/

if (process.version.slice(1).split('.')[0] < 8) throw new Error('Node 8.0.0 or higher is required. Update Node on your system.');

const { Client } = require('discord.js');
const Discord = require('discord.js');
const timestamp = require('log-timestamp');
const {readdir} = require('fs-nextra');
const klaw = require('klaw');
const path = require('path');
const sql = require('sqlite');


class FeedBot extends Client {
  constructor(options) {
    super(options);
    this.config = require('./config.js');
  }
}

const client = new FeedBot({
  fetchAllMembers: true,
  disabledEvents: ['TYPING_START'],
});

sql.open('./score.sqlite');

require('./functions/util.js')(client);

const init = async () => {

  // commands TODO: command handler
  client.commands = new Discord.Collection();
  client.commands.set('eval', require('./commands/eval.js'));
  client.commands.set('botstat', require('./commands/botstat.js'));
  client.commands.set('ping', require('./commands/ping.js'));
  client.commands.set('rick', require('./commands/rick.js'));
  client.commands.set('say', require('./commands/rick.js'));
  client.commands.set('serverinfo', require('./commands/serverinfo.js'));

  const eventFiles = await readdir('./events/');
  eventFiles.forEach(file => {
    const eventName = file.split('.')[0];
    const event = new require(`./events/${file}`);
    client.on(eventName, event.bind(null, client));  
    client.log('System', `Loading Event: ${eventName}. ✔`);
    delete require.cache[require.resolve(`./events/${file}`)];  
  });

  client.login(client.config.token);
};

init();
