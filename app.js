if (process.version.slice(1).split('.')[0] < 8) throw new Error('Node 8.0.0 or higher is required. Update Node on your system.');

const CLIENT = require('discord.js');
const config = require('./config.js');
const {readdir} = require('fs-nextra');
const Enmap = require('enmap');
const EnmapLevel = require('enmap-level');
const klaw = require('klaw');
const path = require('path');

const client = new CLIENT.Client({
  fetchAllMembers: true,
  disabledEvents: ['TYPING_START'],
});

const handleMessage = async (message) => {
  if (message.author.bot) return;

  if (message.content.indexOf(config.prefix) !== 0) return;

  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  if (command === 'ping') {
    message.channel.send('Pong...').then((msg) => {
      msg.edit(`Pong! Latency is ${msg.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms`);
    });
  } else

  if (command === 'serverinfo') {
  // const bans = message.guild.fetchBans().then((b)=> {console.log(b.size);});
    const bans = await message.guild.fetchBans().then((b)=> b.size);

    const embed = new CLIENT.MessageEmbed()
      .setAuthor('Server info', message.guild.iconURL)
      .setColor(3447003)
      .setDescription(`Owner: ${message.guild.owner.user.tag} (${message.guild.owner.id})`)
      .addField('Member Count', `${message.guild.memberCount - message.guild.members.filter(m => m.user.bot).size} + ${message.guild.members.filter(m => m.user.bot).size} bots`, true)
      .addField('Banned', bans, true)
      .addField('Location', message.guild.region, true)
      .addField('Created', message.guild.createdAt.toLocaleString(), true)
      .addField('Channels', `${message.guild.channels.filter(chan => chan.type === 'voice').size} voice / ${message.guild.channels.filter(chan => chan.type === 'text').size} text`, true)
      .addField('Roles', message.guild.roles.size, true)
      .setFooter(message.guild.owner.user.tag, message.guild.owner.user.avatarURL(), true);
    message.channel.send({embed});
  }
};

const handleGuildCreate = (guild) => {
  console.log(`I have been added to the guild: ${guild.name}, Owned by: ${guild.owner.user.tag}, with ${guild.memberCount} members.`);
};

const handleReady = () => {
  console.log(`Logged in as ${client.user.tag}!`);
};

const handleGuildMemberAdd = (member) => {
  console.log(`${member.user.tag} (${member.id}) has joined ${member.guild.name} (${member.guild.id})`);
  const welcomeChannel = member.guild.channels.find('name', 'welcome');
  if (welcomeChannel) {
    welcomeChannel.send(`Please welcome ${member.user.tag} to our wonderful guild!`);
  }
};

const init = async () => {

  client.on('message', handleMessage);
  client.on('guildCreate', handleGuildCreate);
  client.on('ready', handleReady);
  client.on('guildMemberAdd', handleGuildMemberAdd);

  client.login(config.token);
};

init();
