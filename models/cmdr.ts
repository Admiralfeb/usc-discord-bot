import { ObjectId } from 'mongodb';

export interface ICMDR {
  _id: ObjectId;
  discordName: string;
  email: string;
}
