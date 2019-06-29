import { version } from 'discord.js';
import moment from 'moment';
import Command from '../../structures/Command';
require( 'moment-duration-format' );

module.exports = class Bstat extends Command {
  constructor( ...args ) {
    super( ...args, {
      name: 'bstat',
      description: 'Bot statistics',
      category: 'System',
      permLevel: 'Bot Owner',
      usage: '.bstat'
    } );
  }

  async run( message ) {
    const duration = moment.duration( this.client.uptime ).format( ' D [days], H [hrs], m [mins], s [secs]' ),
      dbSize = await this.client.db.schemaSize(),
      stats = {
        Uptime: duration,
        Users: this.client.users.size.toLocaleString(),
        Servers: this.client.guilds.size.toLocaleString(),
        Channels: this.client.channels.size.toLocaleString(),
        Commands: this.client.commands.size.toLocaleString(),
        Bot: `v${this.client.config.version}`,
        Discord: `v${version}`,
        Node: process.version,
        Memory: `${( process.memoryUsage().heapUsed / 1024 / 1024 ).toFixed( 2 )} MB`
      },
      array = [];

    dbSize.forEach( ( table ) => {
      stats[ table.relation.replace( 'bot.', 'DB.' ) ] = table.total_size;
    } );

    Object.entries( stats ).forEach( ( [ k, v ] ) => {
      array.push(
        `| <${k}>${' '.repeat( 16 - k.length )}| < ${v} > ${' '.repeat( 19 - String( v ).slice( 0, 19 ).length )}|`
      );
    } );

    message.channel.send(
      `\`\`\`md\nBot Statistics\n==============\n\n| Stat              | Value                   |\n|:-----------------:| -----------------------:|\n${array.join(
        '\n'
      )}\`\`\``
    );
  }
};
