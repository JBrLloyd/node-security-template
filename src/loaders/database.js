const { MongoClient } = require('mongodb');
const config = require('config');
const logger = require('./logger');

let database = null;

async function startDatabase() {
  logger.info('Starting connection to database...');

  const mongoDbURL = process.env.MONGODB_URL || config.get('MONGODB_URL');
  const connection = await MongoClient.connect(mongoDbURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  database = connection.db();

  logger.info('Connection to database established');
}

async function getDatabase() {
  if (!database) await startDatabase();
  return database;
}

module.exports = {
  getDatabase,
  startDatabase,
};
