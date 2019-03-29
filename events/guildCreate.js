import Event from '../structures/Event.js';

module.exports = class extends Event {
  async run( guild ) {
    if ( !guild.available ) {
      return;
    }

    this.client.db.insertSettings( guild.id, guild.name );

    console.log( `New guild has been joined: ${guild.name} with ${guild.memberCount - 1} members` );

    guild.owner.send(
      'Greetings!\n\n  My purpose is to help improve the quality of engagement in feedback channels for music production servers.  There are a few things you will need to setup in order for me to be effective.  The most important being to set the channel ID for your feedback channel, this can be done with the configuration command.  A full setup guide can be found at: *coming soon* \n\n  Here are a few commands to get you started:\n\n  `.help` - Display some help info.\n\n  `.commands` - Send a list of commands you can use, or extended help on a specifc command.\n\n  `.config` - Allows you to view and set your servers configuration options.\n\n  For support, feedback, suggestions, bugs .etc you can message: `@Dan <113226391771717632>`'
    );
  }
};
