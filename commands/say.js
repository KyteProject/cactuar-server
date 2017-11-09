module.exports = (client, message, args) => {
  if (args.length < 1) throw 'Bot needs a message';

  message.delete().catch(err => {
    client.log('Command', err, 'Error');
  });
  
  message.channel.send(args.join(''));
};
