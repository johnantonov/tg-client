import { client } from './client';
import { isWithinLastXDays } from './utils';
import { giftPatterns } from './data/patterns';
const input = require('input'); 

export async function checkMessagesInChannel(channelId: string, destinationChatId: number, days: number) {
  const chatEntity = await client.getEntity(destinationChatId);
  const messages = await client.getMessages(channelId, { limit: 200 });

  for (let message of messages) {
    if (isWithinLastXDays(days, message.date)) {
      if (giftPatterns.some(pattern => pattern.test(message.message))) {
        console.log(JSON.stringify(message));
        await client.forwardMessages(chatEntity, {
          messages: message.id,
          fromPeer: channelId,
        });
      }
    }
  }
};