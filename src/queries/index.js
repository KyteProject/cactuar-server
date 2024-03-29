import { Pool } from 'pg';

export default class Database {
  constructor( client ) {
    this.client = client;

    this.pool = new Pool( {
      user: process.env.NODE_ENV === 'production' ? process.env.DB_USER : process.env.DEV_USER,
      host: process.env.NODE_ENV === 'production' ? process.env.DB_HOST : process.env.DEV_HOST,
      database: process.env.NODE_ENV === 'production' ? process.env.DB_NAME : process.env.DEV_NAME,
      password: process.env.NODE_ENV === 'production' ? process.env.DB_PASS : process.env.DEV_PASS,
      port: process.env.NODE_ENV === 'production' ? process.env.DB_PORT : process.env.DEV_PORT
    } );
  }

  async getSettings() {
    try {
      const text = `
        SELECT
          *
        FROM
          settings
      `,
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

    try {
      let settings = {};

      if ( !guild ) {
        return def;
      }

      const text = `
        SELECT
          *
        FROM
          settings
        WHERE
          gid = $1
      `,
        values = [ guild ],
        res = await this.pool.query( text, values );

      settings = res.rowCount > 0 ? res.rows[ 0 ] : def;

      return settings;
    } catch ( err ) {
      this.client.log.error( `getSettings() query failed: ${err}` );
      return def;
    }
  }

  async writeSettings( key, value, guild ) {
    if ( !key || !value || !guild ) {
      return this.client.log.debug( 'Missing arguments: requires a key and value.' );
    }

    try {
      const response = `Wrote setting: ${key} = ${value} for guild: ${guild}`,
        text = `
          UPDATE
            settings
          SET
            ${key} = $1
          WHERE
            gid = $2
        `,
        values = [ value, guild ];

      await this.pool.query( text, values );

      this.client.log.data( response );

      return response;
    } catch ( err ) {
      this.client.log.error( `writeSettings() query failed: ${err}` );
      return err;
    }
  }

  async insertSettings( guild, name ) {
    if ( !guild || !name ) {
      return this.client.log.debug( 'Missing arguments: requires a guild and name.' );
    }

    try {
      const text = `
        INSERT INTO
          settings ( gid, name )
        VALUES
          ($1, $2)
      `,
        values = [ guild, name ],
        res = await this.pool.query( text, values );

      if ( res.rowCount ) {
        this.client.log.data( `${name} (guild) has been added to database` );
      }
    } catch ( err ) {
      return this.client.log.error( `insertSettings() failed: ${err}` );
    }
  }

  async getUser( user ) {
    try {
      const text = `
        SELECT
          *
        FROM
          users
        WHERE
          jid = $1
      `,
        values = [ user ],
        res = await this.pool.query( text, values );

      return res.rows[ 0 ];
    } catch ( err ) {
      return this.client.log.error( `getUser() query failed: ${err}` );
    }
  }

  async addUser( jID, name ) {
    try {
      const text = `
        INSERT INTO
          users ( jid, name )
        VALUES
          ( $1, $2 )
        RETURNING
          *
      `,
        values = [ jID, name ],
        res = await this.pool.query( text, values );

      this.client.log.data( `Added user: ${jID} - ${name} to database.` );

      return res.rows[ 0 ];
    } catch ( err ) {
      return this.client.log.error( `addUser() query failed: ${err}` );
    }
  }

  updateUserRequest( jID, date ) {
    try {
      const text = `
        UPDATE
          users 
        SET
          submissions = submissions + 1,
          last_request = $2,
          keywords = 0 
        WHERE
          jid = $1
      `,
        values = [ jID, date ];

      this.pool.query( text, values );

      return this.client.log.data( `Updated user via request: ${jID}` );
    } catch ( err ) {
      return this.client.log.error( `updateUserRFequest() query failed: ${err}` );
    }
  }

  async updateUserSubmission( jID, data ) {
    try {
      const text = `
        UPDATE
          users 
        SET
          level = $1,
          current = $2,
          next = $3,
          total = $4,
          tokens = $5,
          submissions = $6,
          keywords = $7 
        WHERE
          jid = $8
      `,
        values = [
          data.level,
          data.current,
          data.next,
          data.total,
          data.tokens,
          data.submissions,
          data.keywords,
          jID
        ];

      await this.pool.query( text, values );

      return this.client.log.data( `Updated user via submission: ${jID}` );
    } catch ( err ) {
      return this.client.log.error( `updateUserSubmission() query failed: ${err}` );
    }
  }

  async fetchStats() {
    try {
      const text = `
        SELECT
          *
        FROM
          stats
      `,
        values = [],
        res = await this.pool.query( text, values );

      return res.rows[ 0 ];
    } catch ( err ) {
      this.client.log.error( err );
    }
  }

  async updateStats() {
    try {
      const text = `
        UPDATE
          stats 
        SET 
          points = sub_q.points,
          submissions = sub_q.submissions,
          requests = sub_q.requests,
          challenges = chal_q.challenges 
        FROM
          ( SELECT SUM ( total ) AS points, SUM ( submissions ) AS submissions, SUM ( requests ) AS requests FROM users ) AS sub_q,
          ( SELECT COUNT ( * ) AS challenges FROM challenges ) AS chal_q
      `,
        values = [],
        res = await this.pool.query( text, values );

      return res.rows[ 0 ];
    } catch ( err ) {
      this.client.log.error( err );
    }
  }

  async fetchRanking( gID, limit ) {
    try {
      const text = `
        SELECT
          jid,
          name,
          level,
          current,
          next,
          total 
        FROM
          users 
        WHERE
          jid LIKE $1 
        ORDER BY
          total DESC 
          LIMIT $2
      `,
        values = [ `${gID}%`, limit ],
        res = await this.pool.query( text, values );

      return res.rows;
    } catch ( err ) {
      this.client.log.error( err );
    }
  }

  async addToken( jID ) {
    try {
      const text = `
        UPDATE
          users 
        SET
          tokens = tokens + 1 
        WHERE
          jid = $1
      `,
        values = [ jID ];

      await this.pool.query( text, values );

      return this.client.log.data( `Added token for: ${jID}` );
    } catch ( err ) {
      throw this.client.log.error( `addToken() query failed: ${err}` );
    }
  }

  async removeToken( jID ) {
    try {
      const text = `
        UPDATE
          users 
        SET
          tokens = tokens - 1 
        WHERE
          jid = $1
      `,
        values = [ jID ];

      await this.pool.query( text, values );

      return this.client.log.data( `Removed token for: ${jID}` );
    } catch ( err ) {
      throw this.client.log.error( `removeToken() query failed: ${err}` );
    }
  }

  async fetchMessages( guild, limit ) {
    try {
      const text = `
        SELECT
          * 
        FROM
          messages 
        WHERE
          guild = $1 
        ORDER BY
          msg DESC 
          LIMIT $2
      `,
        values = [ guild, limit ],
        res = await this.pool.query( text, values );

      return res.rows;
    } catch ( err ) {
      return this.client.log.error( `fetchMessages() query failed: ${err}` );
    }
  }

  removeMessage( message ) {
    try {
      const text = `
        DELETE FROM
          messages 
        WHERE
          msg = $1
      `,
        values = [ message ];

      this.pool.query( text, values );

      return this.client.log.data( `Removed message: ${message}` );
    } catch ( err ) {
      this.client.log.error( `removeMessahe() query failed: ${err}` );
    }
  }

  insertMessage( message, guild, author ) {
    try {
      const text = `
        INSERT INTO
          messages (msg, guild, author)
        VALUES
          ($1, $2, $3)
      `,
        values = [ message, guild, author ];

      this.pool.query( text, values );

      this.client.log.data( `Added message: ${message}` );
    } catch ( err ) {
      return this.client.log.error( `addUser() query failed: ${err}` );
    }
  }

  async schemaSize() {
    try {
      const text = `
        SELECT
          nspname || '.' || relname AS "relation",
          pg_size_pretty (
            pg_total_relation_size ( C.oid )
          ) AS "total_size" 
        FROM
          pg_class
          C LEFT JOIN pg_namespace N ON ( N.oid = C.relnamespace ) 
        WHERE
          nspname NOT IN ( 'pg_catalog', 'information_schema' ) 
          AND C.relkind <> 'i' 
          AND nspname !~ '^pg_toast' 
        ORDER BY
          pg_total_relation_size ( C.oid ) DESC
      `,
        values = [],
        res = await this.pool.query( text, values );

      return res.rows;
    } catch ( err ) {
      this.client.log.error( `schemaSize() query failed: ${err}` );
    }
  }

  block( jID ) {
    try {
      const text = `
        UPDATE
          users 
        SET 
          disabled = NOT disabled
        WHERE
          jid = $1
      `,
        values = [ jID ];

      this.pool.query( text, values );
    } catch ( err ) {
      throw this.client.log.error( `block() query failed: ${err}` );
    }
  }
}
