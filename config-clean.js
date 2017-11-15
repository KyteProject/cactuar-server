const config = {
  'token': 'Gw456hWG%45g6J-NOT-A-REAL-TOKEN-tH56s5hDHDFGtyDTHdrTHy',
  'prefix': '.',
  'ownerID': '113226391771717632',
  'admins': [],
  'support': [],

  // Default per-server settings. New guilds have these settings. 
  'defaultSettings' : {
    'prefix': '.',                        // Command prefix
    'feedbackChannel': 'feedback-tunes',  // Name of channel for bot to function
    'botLogEnable': 1,                    // true - toggles bot log output
    'modRole': 'Moderator',               // Name of Mod role in server
    'adminRole': 'Administrator',         // Name of Admin role in server
    'enableBadges': 1,                    // true - toggles badge system
    'badgeNotice': 1,                     // true - toggles badge notifcations
    'scoreTime': 5,
    'pointsReward': 250,
    'minPoints': 1,
    'maxPoints': 50,
    'pointCost': 10,
    'deleteSwitch' : 1,                   // true - Toggles auto moderation of messages
    'response' : '*brrp* Don\'t be such a morty... Have you thought about *burp* giving feedback to others before asking for feedback yourself?',  // Sets bots response
    'pinMessage' : 1                      // true  - Toggles auto message pin
  },

  permLevels: [
    // non-roled users.
    { level: 0,
      name: 'User', 
      check: () => true
    },

    { level: 2,
      name: 'Moderator',
      check: (message) => {
        try {
          const modRole = message.guild.roles.find(r => r.name.toLowerCase() === message.settings.modRole.toLowerCase());
          if (modRole && message.member.roles.has(modRole.id)) return true;
        } catch (e) {
          return false;
        }
      }
    },

    { level: 3,
      name: 'Administrator', 
      check: (message) => {
        try {
          const adminRole = message.guild.roles.find(r => r.name.toLowerCase() === message.settings.adminRole.toLowerCase());
          return (adminRole && message.member.roles.has(adminRole.id));
        } catch (e) {
          return false;
        }
      }
    },

    { level: 4,
      name: 'Server Owner', 
      check: (message) => message.channel.type === 'text' ? (message.guild.owner.user.id === message.author.id ? true : false) : false
    },

    { level: 8,
      name: 'Bot Support',
      check: (message) => config.support.includes(message.author.id)
    },

    { level: 9,
      name: 'Bot Admin',
      check: (message) => config.admins.includes(message.author.id)
    },

    { level: 10,
      name: 'Bot Owner', 
      check: (message) => message.client.config.ownerID === message.author.id
    }
  ]
};

module.exports = config;
