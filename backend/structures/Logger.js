import { createLogger, format, transports, addColors } from 'winston';

const config = {
  levels: {
    error: 0,
    debug: 1,
    warn: 2,
    data: 3,
    feedback: 4,
    info: 4,
    verbose: 5,
    silly: 6
  },
  colors: {
    error: 'red',
    debug: 'blue',
    warn: 'yellow',
    data: 'green',
    feedback: 'white',
    info: 'white',
    verbose: 'cyan',
    silly: 'magenta'
  }
};

addColors( config.colors );

const Logger = createLogger( {
  level: 'info',
  levels: config.levels,
  format: format.combine(
    format.colorize( { all: true } ),
    format.timestamp( {
      format: 'DD-MM-YY HH:mm:ss'
    } ),
    format.printf( ( info ) => `[${info.timestamp}] [${info.level}]: ${info.message}` )
  ),
  transports: [
    new transports.Console(),
    new transports.File( { filename: 'error.log', level: 'error' } ),
    new transports.File( { filename: 'combined.log' } )
  ]
} );

export default Logger;
