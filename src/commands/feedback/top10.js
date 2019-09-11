import { MessageEmbed } from 'discord.js';
import Command from '../../structures/Command';

module.exports = class Top10 extends Command {
  constructor( ...args ) {
    super( ...args, {
      name: 'top10',
      description: 'Display the top 10 users in the guild.',
      category: 'Feedback',
      guildOnly: true,
      usage: '.top10'
    } );
  }

  async run( message ) {
    try {
      let x = 1;
      const ranking = await this.client.db.fetchRanking( message.guild.id, 10 ),
        embed = new MessageEmbed()
          .setAuthor( `Top 10 Rankings - ${message.guild.name}`, this.client.user.avatarURL() )
          .setColor( '00d919' );

      ranking.forEach( ( row ) => {
        embed.addField(
          `${x}: ${row.name}`,
          `Level: ${row.level} || Points: ${row.current}/${row.next} (${row.total} total)`
        );
        x++;
      } );

      return message.channel.send( { embed } );
    } catch ( err ) {
      return this.client.log.error( err );
    }
  }
};
