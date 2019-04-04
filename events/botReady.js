import Event from '../structures/Event.js';
import ActivityUpdate from './../structures/ActivityUpdate';

module.exports = class extends Event {
  async run() {
    try {
      if ( this.client.users.has( '1' ) ) {
        this.client.users.delete( '1' );
      }

      this.client.guilds.each( async( g ) => {
        if ( !await this.client.settingsCache.get( g.id ) ) {
          await this.client.db.insertSettings( g.id, g.name );
          this.client.updateCache();
        }
      } );

      setInterval( async() => {
        await ActivityUpdate.fetch( this.client );
      }, 20000 );

      this.client.log.data(
        `${this.client.user.tag}, ready to roll! ${this.client.users.size} users in ${this.client.guilds
          .size} servers.`
      );
    } catch ( err ) {
      this.client.log.error( `Error in ready event: ${err}` );
    }
  }
};
