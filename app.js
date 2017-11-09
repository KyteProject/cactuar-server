/*
TODO: link submission to system
TODO: If link is youtube check to see if the word 'feedback' appears in teh same message, if so perform a check that requires y/n input from user.
TODO: React to sccessfull link
TODO: do not allow multi-links
TODO: acheivements
TODO: feedback master role
*/

if (process.version.slice(1).split('.')[0] < 8) throw new Error('Node 8.0.0 or higher is required. Update Node on your system.');

const Discord = require('discord.js');
const config = require('./config.js');
const timestamp = require('log-timestamp');
const {readdir} = require('fs-nextra');
// const Enmap = require('enmap');
// const EnmapLevel = require('enmap-level');
// const klaw = require('klaw');
// const path = require('path');

const client = new Discord.Client({
  fetchAllMembers: true,
  disabledEvents: ['TYPING_START'],
});

client.config = config;
client.log = require('./functions/log.js');
client.commands = new Discord.Collection();

client.commands.set('ping', require('./commands/ping.js'));
client.commands.set('rick', require('./commands/rick.js'));
client.commands.set('say', require('./commands/rick.js'));
client.commands.set('serverinfo', require('./commands/serverinfo.js'));
client.commands.set('stats', require('./commands/stats.js'));

const init = async () => {

  const evtFiles = await readdir('./events/');
  client.log('Event', `Loading a total of ${evtFiles.length} events.`);
  // evtFiles.forEach(file => {
  //   const eventName = file.split('.')[0];
  //   const event = new (require(`./events/${file}`))(client);
  //   client.on(eventName, (...args) => event.execute(...args));
  //   client.log('log', `Loading Event: ${eventName}. ✔`);
  //   delete require.cache[require.resolve(`./events/${file}`)];
  // });

  client.on('message', message => require('./events/message.js')(client, message));
  client.on('guildCreate', guild => require('./events/guildCreate.js')(client, guild));
  client.on('ready', () => require('./events/ready.js')(client));
  client.on('guildMemberAdd', member => require('./events/guildMemberAdd.js')(client, member));

  client.login(client.config.token);
};

init();
