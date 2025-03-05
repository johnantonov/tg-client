import cron from 'node-cron';
import { getChannels } from './db_utils';
import { checkMessagesInChannel } from './crawler';
import { startClient } from './client';
import { sleep } from './utils';
import { FloodWaitError } from 'telegram/errors';

let cachedChannels: { chatId: string | null,  chatUsername: string, accessHash: string | null, lastChecked: string | null }[] = [];

async function parseChannels() {
  console.log(`[${new Date().toISOString()}] Start updating channels...`);

  try {
    const currentChannels = await getChannels();

    if (cachedChannels.length === 0) {
      console.log('First start: caching channels and crawling by 30 days if accessHash is missing');
      cachedChannels = currentChannels;

      for (const channel of cachedChannels) {
        // const daysToCheck = channel.accessHash ? 0 : 30;
        const daysToCheck = 0;
        await checkMessagesInChannel(channel, daysToCheck);
        await sleep({ random: true });
      }
      console.log('Successfully crawled all channels');
    } else {
      const newChannels = currentChannels.filter(ch => !cachedChannels.find(cached => cached.chatUsername === ch.chatUsername));
      const oldChannels = currentChannels.filter(ch => cachedChannels.find(cached => cached.chatUsername === ch.chatUsername));

      console.log(`Found ${newChannels.length} new channels, ${oldChannels.length} old channels.`);

      cachedChannels = currentChannels;

      for (const channel of newChannels) {
        await checkMessagesInChannel(channel, 30);
        await sleep({ random: true });
      }

      for (const channel of oldChannels) {
        await checkMessagesInChannel(channel, 1);
        await sleep({ random: true });
      }
    }
  } catch (err) {
    if (err instanceof FloodWaitError) {
      console.log(`Flood wait error encountered. Waiting for ${err.seconds + 10} seconds.`);
      await sleep(err.seconds * 1000 + 10000);
    } else {
      console.error('Error updating channels:', err);
    }
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
