import { client } from './client';
import { isWithinLastXDays, sleep } from './utils';
import { giftPatterns } from './data/patterns';
import { Api } from 'telegram';
import bigInt from "big-integer";
import { updateChannelInfo } from './db_utils';

const cachedChatEntity = new Api.InputPeerChannel({
  channelId: bigInt(2257400192),
  accessHash: bigInt(-8056487850660300),
});

export async function checkMessagesInChannel(channelData: any, days: number) {
  let { chatId, accessHash } = channelData;
  console.log('process '+ chatId)

  if (!accessHash) {
    console.log('start getting chat entity')
    const entity = await client.getEntity(chatId);

    if (entity instanceof Api.Channel) {
      accessHash = entity.accessHash;
    } else if (entity instanceof Api.User) {
      accessHash = entity.accessHash;
    } else if (entity instanceof Api.Chat) {
      console.log('This is a chat group, no accessHash');
    } else {
      console.error('Unknown entity type:', entity);
    }

    const lastChecked = new Date().toISOString();
    await updateChannelInfo([{ chatId, accessHash, lastChecked }]);
  }

  const inputPeerChannel = new Api.InputPeerChannel({
    channelId: bigInt(chatId),
    accessHash: bigInt(accessHash),
  });

  await sleep(30000);
  console.log('start getting messages')
  const messages = await client.getMessages(inputPeerChannel, { limit: 100 });

  for (let message of messages) {
    if (isWithinLastXDays(days, message.date)) {
      if (giftPatterns.some(pattern => pattern.test(message.message))) {
        try {
          console.log('Found message ' + message.id);
          await sleep(30000);

          await client.forwardMessages(cachedChatEntity, {
            messages: message.id,
            fromPeer: message.peerId,
          });

          console.log('Successfully forwarded message: ' + message.id);
        } catch (e) {
          console.error(e);
        }
      }
    }
  }
}