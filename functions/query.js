const sql = require('sqlite');

module.exports = (client) => {

  client.createGuild = async () => {
    await sql.run('CREATE TABLE IF NOT EXISTS guild_config (gID TEXT NOT NULL UNIQUE, prefix TEXT NOT NULL, feedbackChannel TEXT NOT NULL, botLogEnable INTEGER NOT NULL, modRole TEXT NOT NULL, adminRole TEXT NOT NULL, enableBadges INTEGER NOT NULL, badgeNotice INTEGER NOT NULL, scoreTime INTEGER NOT NULL, pointsReward INTEGER NOT NULL, minPoints INTEGER NOT NULL, maxPoints INTEGER NOT NULL, pointCost INTEGER NOT NULL, deleteSwitch INTEGER NOT NULL, response TEXT NOT NULL, pinMessage INTEGER NOT NULL, welcomeMessage INTEGER NOT NULL, PRIMARY KEY(`gID`))');
  };

  client.insertGuild = async (client, guild) => {
    await sql.run('INSERT INTO guild_config (gID, prefix, feedbackChannel, botLogEnable, modRole, adminRole, enableBadges, badgeNotice, scoreTime, pointsReward, minPoints, maxPoints, pointCost, deleteSwitch, response, pinMessage, welcomeMessage) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [ guild.id,
        client.config.defaultSettings.prefix,
        client.config.defaultSettings.feedbackChannel,
        client.config.defaultSettings.botLogEnable,
        client.config.defaultSettings.modRole,
        client.config.defaultSettings.adminRole,
        client.config.defaultSettings.enableBadges,
        client.config.defaultSettings.badgeNotice,
        client.config.defaultSettings.scoreTime,
        client.config.defaultSettings.pointsReward,
        client.config.defaultSettings.minPoints,
        client.config.defaultSettings.maxPoints,
        client.config.defaultSettings.pointCost,
        client.config.defaultSettings.deleteSwitch,
        client.config.defaultSettings.response,
        client.config.defaultSettings.pinMessage,
        client.config.defaultSettings.welcomeMessage
      ]);
  };

  client.createMessage = async () => {
    await sql.run('CREATE TABLE IF NOT EXISTS guild_message (gID TEXT NOT NULL UNIQUE, channelID TEXT UNIQUE, messageID TEXT UNIQUE, PRIMARY KEY(`gID`)');
  };
  
};