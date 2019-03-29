import { Pool } from 'pg';
import { Collection } from 'discord.js';

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

  async getSettings() {
    try {
      const text = 'SELECT * FROM bot.settings',
        res = await this.pool.query( text );

      if ( !res.rowCount ) {
        return this.client.log.warn( 'No settings found for any servers to cache' );
      }

      return res.rows;
    } catch ( err ) {
      return this.client.log.error( `getSettings() query failed: ${err}` );
    }
  }

  async getGuildSettings( guild ) {
    const def = this.client.config.defaultSettings;
    let settings = {};

    if ( !guild ) {
      return def;
    }

    try {
      const text = 'SELECT * FROM bot.settings where GID = $1',
        values = [ guild ],
        res = await this.pool.query( text, values );

      settings = res.rowCount > 0 ? res.rows[ 0 ] : def;
    } catch ( err ) {
      this.client.log.error( `getSettings() query failed: ${err}` );
      return def;
    }

    return settings;
  }

  async writeSettings( key, value, guild ) {
    if ( !key || !value || !guild ) {
      return this.client.log.debug( 'Missing arguments: requires a key and value.' );
    }

    try {
      const text = 'UPDATE bot.settings SET $1 = $2 WHERE GID = $3',
        values = [ key, value, guild ],
        res = await this.pool.query( text, values );
    } catch ( err ) {
      return this.client.log.error( `writeSettings() query failed: ${err}` );
    }

    return this.client.log.data( `Wrote setting: ${key}: ${value} for guild: ${guild}` );
  }

  async insertSettings( guild, name ) {
    if ( !guild || !name ) {
      return this.client.log.debug( 'Missing arguments: requires a guild and name.' );
    }

    try {
      const text = 'INSERT INTO bot.settings (GID, NAME) VALUES ($1, $2)',
        values = [ guild, name ],
        res = await this.pool.query( text, values );

      if ( res.rowCount ) {
        this.client.log.data( `${name} (guild) has been added to database` );
      }
    } catch ( err ) {
      return this.client.log.error( `insertSettings() failed: ${err}` );
    }
  }
}
