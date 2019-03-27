import { Permissions } from 'discord.js';

export default class Command {
  constructor( client, file, options = {} ) {
    this.client = client;
    this.name = options.name || file.name;
    this.description = options.description || 'No description provided.';
    this.category = options.category || 'General';
    this.usage = options.usage || 'No usage provided.';
    this.extended = options.extended || 'No information provided.';
    this.hidden = options.hidden || false;
    this.guildOnly = options.guildOnly || true;
    this.botPerms = new Permissions( options.botPerms || [] ).freeze();
    this.permLevel = options.permLevel || 'User';
    this.file = file;
    this.store = this.client.commands;
  }

  async run() {
    throw new Error( `Command ${this.constructor.name} doesn't provide a run method.` );
  }

  reload() {
    return this.store.load( this.file.path );
  }
}
