import Command from '../../structures/Command';

module.exports = class Say extends Command {
  constructor( ...args ) {
    super( ...args, {
      name: 'cmd',
      description: 'Show the commands available to you or get extended help.',
      usage: '.cmd <command name>',
      extnded:
				'If no argument provided this command will list all available commands to you. If used with a command name it will show extended help about that command.',
      category: 'General',
      guildOnly: true
    } );
  }

  async run( message, args, level ) {
    const settings = message.settings;

    if ( !args[ 0 ] ) {
      const commands = [];

      this.client.commands.forEach( ( cmd ) => {
        if ( this.client.levelCache[ cmd.permLevel ] <= level ) {
          commands.push( cmd );
        }
      } );

      let currentCategory = '',
        output = `= Command List =\n\n[Use ${settings.prefix}cmd <commandname> for details]\n`;
    } else {
      let command = args[ 0 ];

      if ( this.client.commands.has( command ) ) {
        command = this.client.commands.get( command );
      } else if ( this.client.aliases.has( command ) ) {
        command = this.client.commands.get( this.client.aliases.get( command ) );
      } else {
        return;
      }

      if ( !message.guild && command.conf.guildOnly === true ) {
        return;
      }
      if ( level < this.client.levelCache[ command.conf.permLevel ] ) {
        return;
      }
      message.channel.send(
        `= ${command.help.name} = \n${command.help.description}\ncategory:: ${command.help
          .category}\nusage:: ${command.help.usage}\naliases:: ${command.conf.aliases.join(
          ', '
        )}\ndetails:: ${command.help.extended}`,
        { code: 'asciidoc' }
      );
    }
  }
};
