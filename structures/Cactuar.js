import { Client } from 'discord.js';
import Config from './Config';
import CommandStore from './CommandStore';
import EventStore from './EventStore';
import Database from '../queries';
import Logger from './Logger';

export default class Cactuar extends Client {
  constructor( options ) {
    super( options );

    this.config = new Config();
    this.db = new Database( this );
    this.log = Logger;
    this.commands = new CommandStore( this );
    this.events = new EventStore( this );
    this.settingsCache = {};
    this.levelCache = {};
    this.methods = {
      util: require( '../util/util.js' )
    };
    this.ready = false;

    this.on( 'ready', this._ready.bind( this ) );
  }

  async login( token ) {
    await this.init();
    return super.login( token );
  }

  _ready() {
    this.ready = true;
    this.emit( 'botReady' );
  }

  get ping() {
    return this.pings.reduce( ( prev, p ) => prev + p, 0 ) / this.pings.length;
  }

  get status() {
    return this.ws.connection ? this.ws.connection.status : null;
  }

  permlevel( message ) {
    let permlvl = 0;

    const permOrder = this.config.permLevels.slice( 0 ).sort( ( prev, val ) => ( prev.level < val.level ? 1 : -1 ) );

    while ( permOrder.length ) {
      const currentLevel = permOrder.shift();

      if ( currentLevel.check( message ) ) {
        permlvl = currentLevel.level;
        break;
      }
    }
    return permlvl;
  }

  async updateCache() {
    this.settingsCache = await this.db.getSettings();
  }

  getGuildSettings( guild ) {
    if ( !guild ) {
      return this.config.defaultSettings;
    }

    if ( this.settingsCache.has( guild ) ) {
      return this.settingsCache.get( guild );
    }

    return this.config.defaultSettings;
  }

  async init() {
    const [ commands, events ] = await Promise.all( [ this.commands.loadFiles(), this.events.loadFiles() ] );

    await this.updateCache();

    this.log.data( `Loaded a total of ${commands} commands` );
    this.log.data( `Loaded a total of ${events} events` );
    this.log.data( `Cached ${this.settingsCache.size} servers settings.` );

    for ( let i = 0; i < this.config.permLevels.length; i++ ) {
      const thisLevel = this.config.permLevels[ i ];

      this.levelCache[ thisLevel.name ] = thisLevel.level;
    }
  }
}
