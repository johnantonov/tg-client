import dotenv from 'dotenv';
import { TelegramClient } from 'telegram';
import { StringSession } from 'telegram/sessions';

dotenv.config();

const API_ID = process.env.API_ID;
const API_HASH = process.env.API_HASH;

export const client = new TelegramClient(new StringSession(''), +API_ID!, API_HASH!, {
  connectionRetries: 5,
});
