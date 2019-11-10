const assert = require('assert');
const logger = require('../loaders/logger');

const findAllUsers = (db, callback) => {
  const collection = db.collection('users');

  collection.find({}).toArray((err, docs) => {
    assert.equal(err, null);
    logger.info('Finding all users');
    callback(docs);
  });
};

module.exports = {
  findAllUsers,
};
