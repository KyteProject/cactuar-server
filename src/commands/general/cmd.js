import Command from '../../structures/Command';

module.exports = class Say extends Command {
  constructor( ...args ) {
    super( ...args, {
      name: 'cmd',
      description: 'Show the commands available to you or get extended help.',
      usage: '.cmd <command name>',
      extended:
				'If no argument provided this command will list all available commands to you. If used with a command name it will show extended help.',
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

      const sorted = commands.sort(
        // eslint-disable-next-line no-nested-ternary
        ( p, c ) => ( p.category > c.category ? 1 : p.name > c.name && p.category === c.category ? 1 : -1 )
      );

      sorted.forEach( ( c ) => {
        const cat = c.category.toProperCase();

        if ( currentCategory !== cat ) {
          output += `\u200b\n== ${cat} ==\n`;
          currentCategory = cat;
        }
        output += `• ${message.settings.prefix}${c.name}${' '.repeat( 8 - c.name.length )} :: ${c.description}\n`;
      } );

      message.author.send( output, { code: 'asciidoc', split: { char: '\u200b' } } );
      message.channel.send( 'Command list sent.  Please check your DM\'s.' );
    } else {
      let command = args[ 0 ];

      if ( this.client.commands.has( command ) ) {
        command = this.client.commands.get( command );
      } else if ( this.client.aliases.has( command ) ) {
        command = this.client.commands.get( this.client.aliases.get( command ) );
      } else {
        return;
      }

      if ( !message.guild && command.guildOnly === true ) {
        return;
      }
      if ( level < this.client.levelCache[ command.permLevel ] ) {
        return;
      }
      message.channel.send(
        `= ${command.name} = \n${command.description}\ncategory:: ${command.category}\nusage:: ${command.usage}\ndetails:: ${command.extended}`,
        { code: 'asciidoc' }
      );
    }
  }
};
