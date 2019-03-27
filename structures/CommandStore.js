import Store from './Store';

class CommandStore extends Store {
  constructor( client ) {
    super( client, 'commands' );
  }

  get( name ) {
    return super.get( name );
  }

  has( name ) {
    return super.has( name );
  }

  set( command ) {
    super.set( command );

    return command;
  }

  delete( command ) {
    const exists = this.get( command );

    return !exists ? flase : super.delete( command );
  }

  clear() {
    super.clear();
  }
}

export default CommandStore;
