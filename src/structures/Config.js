/* eslint-disable camelcase */

export default class Config {
  constructor() {
    this.owner = '113226391771717632';
    this.version = '3.1.1';

    this.defaultSettings = {
      prefix: '.',
      modrole: 'Moderator',
      adminrole: 'Administrator',
      feedback_channel: 'Insert channel ID',
      delete: true, // Enables auto removal of failed requests
      pin: true, // Enables pinning of latest feedback msg
      badges: true, // Enables badges/acheivements
      tokens: true, // Enables the token gain use system
      threshold: 5,
      respond: true,
      response: 'Have you thought about giving feedback to others before asking for feedback yourself?' // Sets bots response message
    };

    this.permLevels = [
      {
        level: 0,
        name: 'User',
        check: () => true
      },
      {
        level: 1,
        name: 'Moderator',
        check: ( message ) => {
          try {
            const modRole = message.guild.roles.cache.find(
              role => role.name.toLowerCase() === message.settings.mod_role.toLowerCase()
            );

            if ( modRole && message.member.roles.cache.has( modRole.id ) ) {
              return true;
            }
          } catch ( err ) {
            return false;
          }
        }
      },
      {
        level: 2,
        name: 'Administrator',
        check: ( message ) => {
          if ( message.member.permissions.has( 'ADMINISTRATOR', true ) ) {
            return true;
          }

          try {
            const adminRole = message.guild.roles.cache.find(
              role => role.name.toLowerCase() === message.settings.admin_role.toLowerCase()
            );

            return adminRole && message.member.roles.cache.has( adminRole.id );
          } catch ( err ) {
            return false;
          }
        }
      },
      {
        level: 3,
        name: 'Server Owner',
        check: message =>
          ( message.channel.type === 'text' ? message.guild.owner.user.id === message.author.id : false )
      },
      {
        level: 4,
        name: 'Bot Owner',
        check: message => this.owner === message.author.id
      }
    ];
  }
}
