import { client } from './client';
import { isWithinLastXDays } from './utils';
import { giftPatterns } from './data/patterns';
import { config } from './data/config';

let cachedChatEntity: any = null;

export async function checkMessagesInChannel(channelId: string, days: number) {
  const messages = await client.getMessages(channelId, { limit: 100 });

  if (!cachedChatEntity) {
    cachedChatEntity = await client.getEntity(config.destChatId); 
    console.log('Chat entity cached:', cachedChatEntity);
  }

  console.log(channelId)

  for (let message of messages) {
    if (isWithinLastXDays(days, message.date)) {
      if (giftPatterns.some(pattern => pattern.test(message.message))) {
        // console.log(JSON.stringify(message));
        try {
          await client.forwardMessages(cachedChatEntity, {
            messages: message.id,
            fromPeer: channelId,
          });
        } catch (e) {
          console.error(e);
        }
      }
    }
  }
};
