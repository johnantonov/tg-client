import cron from 'node-cron';
import { getChannels } from './db_utils';
import { checkMessagesInChannel } from './crawler';
import { config } from './data/config';
import { startClient } from './client';

let cachedChannels: string[] = [];

async function updateChannels() {
  console.log(`[${new Date().toISOString()}] Start updating channels...`);

  try {
    const currentChannels = await getChannels();

    if (cachedChannels.length === 0) {
      console.log('First start: cashing channels and crawling by 1 day');
      cachedChannels = currentChannels;
      for (const channel of cachedChannels) {
        await checkMessagesInChannel(channel, config.destChatId, 1);
      }
      console.log('Succesfully crawled all channels');
    } else {
      const newChannels = currentChannels.filter(ch => !cachedChannels.includes(ch));
      const oldChannels = currentChannels.filter(ch => cachedChannels.includes(ch));

      console.log(`Found ${newChannels.length} new channels, ${oldChannels.length} old channels.`);

      cachedChannels = currentChannels;

      for (const channel of newChannels) {
        await checkMessagesInChannel(channel, config.destChatId, 30);
      }

      for (const channel of oldChannels) {
        await checkMessagesInChannel(channel, config.destChatId, 1);
      }
    }
  } catch (err) {
    console.error('Error updating channels:', err);
  }
}

async function startScheduler() {
  await startClient();
  await updateChannels();

  cron.schedule('0 3 * * *', updateChannels, {
    timezone: 'UTC',
  });
}

startScheduler();
