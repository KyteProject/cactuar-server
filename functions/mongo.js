const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

exports.dbConnect = async (client) => {
  try {
    mongo = await MongoClient.connect(client.config.dbUrl);
    client.logger.log('conencted to mongodb server');

    client.db = mongo.db(client.config.dbName);
    client.logger.log(`using DB: ${client.config.dbName}`);
  } catch (err) {
    console.log(err.stack);
  }
};

const createGuild = async (client) => {
  client.db.createCollection(
    'test',
    {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['gID', 'prefix', 'major', 'gpa'],
          properties: {
            name: {
              bsonType: 'string',
              description: 'must be a string and is required',
            },
            gender: {
              bsonType: 'string',
              description: 'must be a string and is not required',
            },
            year: {
              bsonType: 'int',
              minimum: 2017,
              maximum: 3017,
              exclusiveMaximum: false,
              description: 'must be an integer in [ 2017, 3017 ] and is required',
            },
            major: {
              enum: ['Math', 'English', 'Computer Science', 'History', null],
              description: 'can only be one of the enum values and is required',
            },
            gpa: {
              bsonType: ['double'],
              minimum: 0,
              description: 'must be a double and is required',
            },
          },
        },
      },
    },
  );
};
