const rickArray = require('../resources/rick.js');

module.exports = (client, message) => {
  message.channel.send(rickArray.random());
};