import { TelegramClient } from 'telegram';
import { StringSession } from 'telegram/sessions';
import * as fs from 'fs';
import { config } from './data/config';
const input = require('input');

const SESSION_FILE = './session.txt';

let sessionString = '';
if (fs.existsSync(SESSION_FILE)) {
  sessionString = fs.readFileSync(SESSION_FILE, 'utf8');
}

const stringSession = new StringSession(sessionString);
export const client = new TelegramClient(stringSession, config.API_ID, config.API_HASH, {
  connectionRetries: config.connectionRetries,
});

export async function startClient() {
  await client.start({
    phoneNumber: async () => await input.text('Enter your phone number:'),
    password: async () => await input.text('Enter your password (if applicable):'),
    phoneCode: async () => await input.text('Enter the code sent to your phone:'),
    onError: (err) => console.log('Error:', err),
  });

  console.log('Client started successfully!');

  fs.writeFileSync(SESSION_FILE, stringSession.save());
}
