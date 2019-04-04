import { MessageEmbed } from 'discord.js';
import Command from '../../structures/Command';

module.exports = class Last extends Command {
  constructor( ...args ) {
    super( ...args, {
      name: 'stats',
      description: 'Shows some feedback bot stats!',
      category: 'Feedback'
    } );
  }

  async run( message ) {
    const stats = await this.client.db.fetchStats(),
      embed = new MessageEmbed()
        .setAuthor( 'Cactuar Stats', this.client.user.avatarURL() )
        .setDescription( 'Here are some global stats for the feedback bot :smile:' )
        .setColor( '00d919' )
        .addField( 'Total points earned', stats.points, true )
        .addField( 'Total feedback given', stats.submissions, true )
        .addField( 'Total tracks submitted', stats.requests, true );

    message.channel.send( embed );
  }
};
