import Command from '../../structures/Command';
import Youtube from '../../structures/Youtube';
import ActivityUpdate from '../../structures/ActivityUpdate';

module.exports = class Song extends Command {
  constructor( ...args ) {
    super( ...args, {
      name: 'song',
      description: 'Display the bots current song and attempt to get youtube link.',
      category: 'General',
      usage: '.song',
      extended:
				'The Youtube grab is not 100% accurate as the song may not exist or some other upload has snatched the most relevant result.'
    } );
  }

  async run( message ) {
    if ( ActivityUpdate.presence.activity.name === 'feedback' ) {
      return message.channel.send( 'Not listening to anything!' );
    }

    const song = await Youtube.search( ActivityUpdate.presence.activity.name, message );

    message.channel.send(
      `Currently listening to: **${ActivityUpdate.presence.activity
        .name}**\n\nhttps://www.youtube.com/watch?v=${song}`
    );
  }
};
