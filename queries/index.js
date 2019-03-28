import { Pool } from 'pg';

export default class Database {
  constructor( client ) {
    this.client = client;

    this.pool = new Pool( {
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      password: process.env.DB_PASS,
      port: process.env.DB_PORT
    } );
  }

  async getSettings( guild ) {
    const def = this.client.config.defaultSettings;
    let settings;

    if ( !guild ) {
      return def;
    }

    try {
      const res = await this.pool.query( `SELECT * FROM bot.settings where GID = '${guild}'` );

      settings = res.rowCount > 0 ? res.rows[ 0 ] : def;
    } catch ( err ) {
      console.log( err );
    }

    return settings;
  }
}
