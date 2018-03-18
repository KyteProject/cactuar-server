exports.run = async (client, message, [action, key, ...value], level) => {
// set feedback channel by mention, veryifychannel and store id in db
  const settings = message.settings;
  const defaults = client.config.defaultSettings;

  if (action === 'edit') {
    if (!key) return message.reply('Please specify a setting to edit.');
    if ((!settings[key]) && (settings[key] != 0)) return message.reply('This key does not exist.');
    if (value.length < 1) return message.reply('Please specify a new value.');
    
    value = value.join(' ');
    await client.verifyKey(message, settings, key, value);
    client.query.setConf(client, message, settings);
    message.reply(`${key} value is: ${settings[key]}`);
  } 
  else if (action === 'del' || action === 'reset') {
    if (!key) return message.reply('Please specify a setting to rese.');
    if ((!settings[key]) && (settings[key] != 0)) return message.reply('This key does not exist.');
    
    const filter = m => m.author.id === message.author.id;
    const response = await client.awaitReply(message, `Are you sure you want to reset \`${key}\` to \`${defaults[key]}\`?`, filter, undefined, null);

    if (['y', 'yes'].includes(response)) {
      settings[key] = defaults[key];
      client.query.setConf(client, message, settings);
      message.reply(`${key} was successfully reset to default.`);
    }
    else if (['n','no','cancel'].includes(response)) {
      message.reply(`Your setting for \`${key}\` remains at \`${settings[key]}\``);
    }
  } 
  else if (action === 'get') {
    if (!key) return message.reply('Please specify a setting to view.');
    if (!settings[key]) return message.reply('This key does not exist.');
    message.reply(`The value of ${key} is currently ${settings[key]}`);
  } 
  else {
    const array = [];
    Object.entries(settings).forEach(([key, value]) => {
      array.push(`${key}${' '.repeat(20 - key.length)}::  ${value}`); 
    });
    await message.channel.send(`= Current Guild Settings =
${array.join('\n')}`, {code: 'asciidoc'});
  }
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['conf', 'set'],
  permLevel: 'Administrator',
  botPerms: []
};

exports.help = {
  name: 'conf',
  category: 'system',
  description: 'View or change settings for your server.',
  extended: 'This command will let you view (get) or change (set) the configuration for your server.',
  usage: 'conf [get/set] [key] [value]'
};