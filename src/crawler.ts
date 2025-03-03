import { client } from './client';
import { isWithinLastXDays } from './utils';
import { giftPatterns } from './data/patterns';
import { config } from './data/config';
import { getChatIdByName } from './methods';

export async function checkMessagesInChannel(channelId: string, destinationChatId: number, days: number) {
  // const messages = await client.getMessages(channelId, { limit: 1000 });
  const messages: any[] = [];

  console.log('start getting dest chat id')
  const chatId = await getChatIdByName(config.destChatName)
  console.log(chatId)
  const chatEntity = await client.getEntity(chatId!); 
  console.log(chatEntity)

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