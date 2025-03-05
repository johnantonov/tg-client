import { client } from './client';
import { isWithinLastXDays, sleep } from './utils';
import { giftPatterns, antiGiftPatterns } from './data/patterns';  
import { Api } from 'telegram';
import bigInt from "big-integer";
import { updateChannelInfo, getChannels } from './db_utils';
import { FloodWaitError } from 'telegram/errors';

const cachedChatEntity = new Api.InputPeerChannel({
  channelId: bigInt(2257400192),
  accessHash: bigInt(-8056487850660300),
});

export async function checkMessagesInChannel(channelData: any, days: number) {
  let { chatId, accessHash, chatUsername } = channelData;
  console.log('Processing channel ' + (chatUsername || chatId));
  const lastChecked = new Date().toISOString();

  if (!chatId) {
    console.log('Chat ID is missing, resolving username to get numeric chatId');
    if (!chatUsername) {
      console.error('Username is missing, cannot resolve chatId');
      return;
    }

    try {
      const entity = await client.getEntity(chatUsername);
      
      if (entity instanceof Api.Channel) {
        chatId = entity.id.toString();
        accessHash = entity.accessHash;
        console.log(`Resolved chatId: ${chatId} for username: ${chatUsername}`);
      } else {
        console.error('Failed to resolve entity for', chatUsername);
        return;
      }

      await updateChannelInfo([{ chatId, accessHash, chatUsername, lastChecked }]);
      console.log(`Saved chatId: ${chatId}, accessHash: ${accessHash}, username: ${chatUsername} to the database.`);
    } catch (e) {
      if (e instanceof FloodWaitError) {
        console.log(`Flood wait error encountered. Waiting for ${e.seconds + 10} seconds.`);
        await sleep(e.seconds * 1000 + 10000);
      } else {
        console.error('Error resolving username:', e);
      }
      return;
    }
  } else {
    await updateChannelInfo([{ chatId, accessHash, chatUsername, lastChecked }]);
  }

  await sleep({ random: true });
  console.log('Start getting messages');
  const inputPeerChannel = new Api.InputPeerChannel({
    channelId: chatId,
    accessHash: accessHash
  });
  
  try {
    const messages = await client.getMessages(inputPeerChannel, { limit: 100 });
    const targetMessages = [];
    let peerId = null;

    for (let message of messages) {
      if (isWithinLastXDays(days, message.date)) {
        if (antiGiftPatterns.some(pattern => pattern.test(message.message))) {
          console.log('Message skipped due to anti-pattern: ' + message.id);
          continue;
        }

        if (giftPatterns.some(pattern => pattern.test(message.message))) {
          try {
            console.log('Found message ' + message.id);
            targetMessages.push(message.id);
            peerId = message.peerId;
          } catch (e) {
            console.error(e);
          }
        }
      }
    }

    await sleep({ random: true });
    if (messages?.length > 0 && peerId) {
      await client.forwardMessages(cachedChatEntity, {
        messages: targetMessages,
        fromPeer: peerId,
      });
      console.log('Successfully forwarded messages: ' + targetMessages);
    } 
  } catch (e) {
    if (e instanceof FloodWaitError) {
      console.log(`Flood wait error encountered. Waiting for ${e.seconds + 10} seconds.`);
      await sleep(e.seconds * 1000 + 10000);
    } else {
      console.error('Error getting messages:', e);
    }
  }
}
