const { mongo_conn } = require('../config.json');
const { MongoClient } = require('mongodb');

const getValue = async (key) => {
  const client = new MongoClient(mongo_conn);
  try {
    await client.connect();

    const database = client.db('usc');
    const collection = database.collection('discordKeys');

    const query = { key };
    const doc = await collection.findOne(query);

    const value = doc?.value;

    return value;
  } finally {
    await client.close();
  }
};

const setValue = async (key, value) => {
  const client = new MongoClient(mongo_conn);
  try {
    await client.connect();

    const database = client.db('usc');
    const collection = database.collection('discordKeys');

    const query = { key };
    const update = { $set: { key, value } };
    const options = { upsert: true };
    await collection.updateOne(query, update, options);
  } finally {
    await client.close();
  }
};

module.exports = {
  getValue,
  setValue,
};
