import { mongo_conn } from '../config';
import { MongoClient } from 'mongodb';
import { JoinRequest } from '../models/joinRequest';

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

export const getJoinRequest = async (
  discordUserName: string
): Promise<JoinRequest | undefined> => {
  const client = new MongoClient(mongo_conn);
  try {
    await client.connect();
    const database = client.db('usc');
    const collection = database.collection('joiners');

    const cursor = collection.find<JoinRequest>({}).sort({ discord: 1 });
    const requests = await cursor.toArray();
    cursor.close();

    const request = requests.find(
      (x) => x.discord.toLowerCase() === discordUserName.toLowerCase()
    );
    return request;
  } finally {
    client.close();
  }
};
