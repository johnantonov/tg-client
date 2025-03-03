import { client } from './client';
import { isWithinLastXDays } from './utils';
import { giftPatterns } from './data/patterns';
import { config } from './data/config';

export async function checkMessagesInChannel(channelId: string, destinationChatId: number, days: number) {
  const messages = await client.getMessages(channelId, { limit: 1000 });

  for (let message of messages) {
    if (isWithinLastXDays(days, message.date)) {
      if (giftPatterns.some(pattern => pattern.test(message.message))) {
        console.log(JSON.stringify(message));
        await client.forwardMessages(destinationChatId, {
          messages: message.id,
          fromPeer: channelId,
        });
      }
    }
  }
};