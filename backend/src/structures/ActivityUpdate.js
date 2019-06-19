import request from 'request-promise';

class ActivityUpdate {
  constructor() {
    this.presence = {
      status: 'online',
      afk: 0,
      activity: {
        name: '',
        type: 'LISTENING'
      }
    };
    // prettier-ignore
    this.url = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=LodestoneMusic&api_key=${process.env.LASTFM}&format=json&limit=1`;
  }

  async fetch( client ) {
    try {
      const lastResponse = JSON.parse( await request.get( this.url ) ).recenttracks.track[ 0 ];

      if ( !lastResponse[ '@attr' ].nowplaying ) {
        throw new Error();
      }

      const currentTrack = `${lastResponse.artist[ '#text' ]} - ${lastResponse.name}`;

      return this.update( client, currentTrack );
    } catch ( e ) {
      return this.update( client, 'feedback' );
    }
  }

  update( client, track ) {
    if ( this.presence.activity.name === track ) {
      return;
    }

    this.presence.activity.name = track;

    client.user.setPresence( this.presence );
    return client.log.info( `Activity changed to: ${this.presence.activity.name}` );
  }
}

export default new ActivityUpdate();
