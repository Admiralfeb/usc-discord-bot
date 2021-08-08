import { mongo_conn } from '../config';
import { MongoClient } from 'mongodb';

export const getValue = async (key: string): Promise<unknown> => {
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

export const setValue = async (key: string, value: unknown): Promise<void> => {
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
