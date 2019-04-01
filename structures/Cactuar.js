import { Client, Collection } from 'discord.js';
import Config from './Config';
import CommandStore from './CommandStore';
import EventStore from './EventStore';
import Database from '../queries';
import Feedback from './Feedback';
import Logger from './Logger';

export default class Cactuar extends Client {
  constructor( options ) {
    super( options );

    this.log = Logger;
    this.config = new Config();
    this.db = new Database( this );
    this.feedback = new Feedback( this );
    this.commands = new CommandStore( this );
    this.events = new EventStore( this );
    this.settingsCache = new Collection();
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
    const res = await this.db.getSettings();

    res.forEach( ( item ) => {
      this.settingsCache.set( item.gid, item );
    } );

    this.log.data( `Cached ${this.settingsCache.size} server' settings.` );
  }

  getGuildSettings( guild ) {
    if ( !guild || !this.settingsCache.size ) {
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

    this.log.data( `Loaded ${commands} commands` );
    this.log.data( `Loaded ${events} events` );

    for ( let i = 0; i < this.config.permLevels.length; i++ ) {
      const thisLevel = this.config.permLevels[ i ];

      this.levelCache[ thisLevel.name ] = thisLevel.level;
    }
  }
}
