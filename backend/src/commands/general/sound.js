import { MessageEmbed } from 'discord.js';
import request from 'request-promise';
import Command from '../../structures/Command';

module.exports = class Sound extends Command {
  constructor( ...args ) {
    super( ...args, {
      name: 'sound',
      description: 'Search freesound.org for some sounds!',
      category: 'General',
      PermLevel: 'Bot Owner'
    } );
  }

  async run( message, [ ...args ] ) {
    // eslint-ignore-next-line
    const query = args.join( ' ' ),
      page = 1,
      pageSize = 150,
      fields =				'id,username,created,tags,description,type,duration,filesize,samplerate,bitdepth,channels,download',
      filter = 'license:"Creative Commons 0"',
      sort = 'score',
      url = `https://freesound.org/apiv2/search/text/?format=json&query=${query}&filter=${filter}&sort=${sort}&page_size=${pageSize}&fields=${fields}&token=${process
        .env.FREESOUND}`;

    try {
      const res = JSON.parse( await request.get( url ) ),
        pages = res.count > 150 ? Math.round( res.count / 150 ) : 1,
        num = Math.floor( Math.random() * Math.floor( 150 ) ),
        sound = res.results[ num ],
        embed = new MessageEmbed()
          .setAuthor( 'Random FreeSound.org Sample', this.client.user.avatarURL() )
          .setColor( '00d919' )
          .setDescription( `https://freesound.org/s/${sound.id}` )
          .addField( 'Tags', sound.tags.join( ', ' ) )
          .addField( 'Type', sound.type, true )
          .addField( 'Duration', sound.duration, true )
          .addField( 'File Size', `${Math.round( sound.filesize / 1024 )} KB`, true )
          .addField( 'Samplerate', `${sound.samplerate} Hz`, true )
          .addField( 'Bit Depth', `${sound.bitdepth} bit`, true )
          .addField( 'Channels', `${sound.channels > 1 ? 'Stereo' : 'Mono'}`, true )
          .setFooter( `Search completed with a total of ${res.count} results.` );

      message.channel.send( 'This command is in beta and is quite limited.', embed );
    } catch ( err ) {
      return this.client.log.error( err );
    }
  }
};
