import cron from 'node-cron';
import { getChannels } from './db_utils';
import { checkMessagesInChannel } from './crawler';
import { config } from './data/config';
import { startClient } from './client';
import { sleep } from './utils';

let cachedChannels: string[] = [];

async function parseChannels() {
  console.log(`[${new Date().toISOString()}] Start updating channels...`);

  try {
    const currentChannels = await getChannels();

    if (cachedChannels.length === 0) {
      console.log('First start: cashing channels and crawling by 1 day');
      cachedChannels = currentChannels;
      for (const channel of cachedChannels) {
        await sleep(30000)
        await checkMessagesInChannel(channel, 0);
      }
      console.log('Succesfully crawled all channels');
    } else {
      const newChannels = currentChannels.filter(ch => !cachedChannels.includes(ch));
      const oldChannels = currentChannels.filter(ch => cachedChannels.includes(ch));

      console.log(`Found ${newChannels.length} new channels, ${oldChannels.length} old channels.`);

      cachedChannels = currentChannels;

      for (const channel of newChannels) {
        await sleep(30000)
        await checkMessagesInChannel(channel, 30);
      }

      for (const channel of oldChannels) {
        await sleep(30000)
        await checkMessagesInChannel(channel, 1);
      }
    }
  } catch (err) {
    console.error('Error updating channels:', err);
  }
}

async function startScheduler() {
  await startClient();
  await parseChannels();

  cron.schedule('0 3 * * *', parseChannels, {
    timezone: 'UTC',
  });
}

startScheduler();
