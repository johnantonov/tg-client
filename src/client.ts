// import dotenv from 'dotenv';
import { TelegramClient } from 'telegram';
import { StringSession } from 'telegram/sessions';
import { config } from './data/config';

// dotenv.config();

// const API_ID = process.env.API_ID;
// const API_HASH = process.env.API_HASH;

export const client = new TelegramClient(new StringSession(''), config.API_ID, config.API_HASH, {
  connectionRetries: config.connectionRetries,
});
