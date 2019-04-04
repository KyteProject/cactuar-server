export default class Config {
  constructor() {
    this.owner = '113226391771717632';
    this.version = '3.0.0';

    this.defaultSettings = {
      prefix: '.',
      modrole: 'Moderator',
      adminrole: 'Administrator',
      feedbackchannel: 'Insert channel ID',
      delete: true, // Enables auto removal of failed requests
      pin: true, // Enables pinning of latest feedback msg
      badges: true, // Enables badges/acheivements
      tokens: true, // Enables the token gain use system
      threshold: 5,
      response: 'Have you thought about giving feedback to others before asking for feedback yourself?', // Sets bots response message
      respond: true
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
            const modRole = message.guild.roles.find(
              ( r ) => r.name.toLowerCase() === message.settings.modRole.toLowerCase()
            );

            if ( modRole && message.member.roles.has( modRole.id ) ) {
              return true;
            }
          } catch ( e ) {
            return false;
          }
        }
      },
      {
        level: 2,
        name: 'Administrator',
        check: ( message ) => {
          try {
            const adminRole = message.guild.roles.find(
              ( r ) => r.name.toLowerCase() === message.settings.adminRole.toLowerCase()
            );

            return adminRole && message.member.roles.has( adminRole.id );
          } catch ( e ) {
            return false;
          }
        }
      },
      {
        level: 3,
        name: 'Server Owner',
        check: ( message ) =>
          ( message.channel.type === 'text' ? message.guild.owner.user.id === message.author.id : false )
      },
      {
        level: 4,
        name: 'Bot Owner',
        check: ( message ) => this.owner === message.author.id
      }
    ];
  }
}
