const rickArray = require('../resources/rick.js');

module.exports = (client, message) => {
  const rand = rickArray[Math.floor(Math.random() * rickArray.length)];
  message.channel.send(rand);
};