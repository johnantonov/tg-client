import { client } from './client';
import { isWithinLastXDays, sleep } from './utils';
import { giftPatterns } from './data/patterns';
import { Api } from 'telegram';
import bigInt from "big-integer";

const cachedChatEntity = new Api.InputPeerChannel({
  channelId: bigInt(2257400192),
  accessHash: bigInt(-8056487850660300),
});

export async function checkMessagesInChannel(channelId: string, days: number) {
  console.log('getting messages from ' + channelId)
  const messages = await client.getMessages(channelId, { limit: 100 });

  for (let message of messages) {
    if (isWithinLastXDays(days, message.date)) {
      if (giftPatterns.some(pattern => pattern.test(message.message))) {
        try {
          console.log('found msg ' + message.id)
          await sleep(30000); 
          
          await client.forwardMessages(cachedChatEntity, {
            messages: message.id,
            fromPeer: message.peerId,
          });
          console.log('succesfully forward msg: ' + message.id)
        } catch (e) {
          console.error(e);
        }
      }
    }
  }
};