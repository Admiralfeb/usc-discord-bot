import { mongo_conn } from '../config';
import { MongoClient } from 'mongodb';
import { JoinRequest } from '../models/joinRequest';
import { ICMDR } from '../models/cmdr';

export const getValue = async <T>(key: string): Promise<T> => {
  const client = new MongoClient(mongo_conn);
  try {
    await client.connect();

    const database = client.db('usc');
    const collection = database.collection('discordKeys');

    const query = { key };
    const doc = await collection.findOne(query);

    const value = doc?.value as T;

    return value;
  } finally {
    await client.close();
  }
};

export const setValue = async <T>(key: string, value: T): Promise<void> => {
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

/**
 * Sets email in the USC database.
 * @param tag Discord Tag
 * @param email Email to set
 */
export const setEmail = async (tag: string, email: string): Promise<void> => {
  const client = new MongoClient(mongo_conn);
  try {
    await client.connect();
    const database = client.db('usc');
    const collection = database.collection<ICMDR>('cmdrs');

    const cursor = collection.find({});
    const cmdrs = await cursor.toArray();
    cursor.close();

    const cmdr = cmdrs.find(
      (x) => x.discordName.toLowerCase().trim() === tag.toLowerCase().trim()
    );
    if (cmdr) {
      try {
        const result = await collection.updateOne(
          { _id: cmdr._id },
          { $set: { email } },
          { upsert: false }
        );
        if (result.modifiedCount !== 1)
          throw new Error(
            'CMDR not updated. Please contact Admiralfeb for assistance.'
          );
      } catch (e) {
        console.error(e);
        throw e;
      }
    } else {
      throw new Error('Cmdr not found');
    }
  } finally {
    client.close();
  }
};
