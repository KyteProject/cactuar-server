const sql = require('sqlite');

module.exports = (client, guild) =>  {
  client.log('Event', `I have been added to the guild: ${guild.name}, Owned by: ${guild.owner.user.tag}, with ${guild.memberCount} members.`); 
  
  //Add guild to settings.
  sql.get(`SELECT * FROM guild_config WHERE gID = "${guild.id}"`).then(row => {
    if (!row) {
      sql.run('INSERT INTO guild_config (gID, prefix, feedbackChannel, botLogEnable, modRole, adminRole, enableBadges, badgeNotice, scoreTime, pointsReward, minPoints, maxPoints, pointCost, deleteSwitch, response, pinMessage) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
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
          client.config.defaultSettings.pinMessage
        ]);
    }
  }).catch(() => {
    console.error; // Gotta log those errors
    sql.run('CREATE TABLE IF NOT EXISTS guild_config (gID TEXT, prefix TEXT, feedbackChannel TEXT, botLogEnable INTEGER, modRole TEXT, adminRole TEXT, enableBadges INTEGER, badgeNotice INTEGER, scoreTime INTEGER, pointsReward INTEGER, minPoints INTEGER, maxPoints INTEGER, pointCost INTEGER, deleteSwitch INTEGER, response TEXT, pinMessage INTEGER)').then(() => {
      sql.run('INSERT INTO guild_config (gID, prefix, feedbackChannel, botLogEnable, modRole, adminRole, enableBadges, badgeNotice, scoreTime, pointsReward, minPoints, maxPoints, pointCost, deleteSwitch, response, pinMessage) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
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
          client.config.defaultSettings.pinMessage
        ]);
    });
  });
};
