import { client } from './client';
import { isWithinLastXDays, sleep } from './utils';
import { giftPatterns } from './data/patterns';
import { Api } from 'telegram';
import bigInt from "big-integer";
import { updateChannelInfo, getChannels } from './db_utils';

const cachedChatEntity = new Api.InputPeerChannel({
  channelId: bigInt(2257400192),
  accessHash: bigInt(-8056487850660300),
});

export async function checkMessagesInChannel(channelData: any, days: number) {
  let { chatId, accessHash, chatUsername } = channelData;
  console.log('Processing channel ' + (chatUsername || chatId));

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

      const lastChecked = new Date().toISOString();
      await updateChannelInfo([{ chatId, accessHash, chatUsername, lastChecked }]); 
      console.log(`Saved chatId: ${chatId}, accessHash: ${accessHash}, username: ${chatUsername} to the database.`);
    } catch (e) {
      console.error('Error resolving username:', e);
      return;
    }
  }

  const inputPeerChannel = new Api.InputPeerChannel({
    channelId: bigInt(chatId),
    accessHash: bigInt(accessHash),
  });

  await sleep(30000);
  console.log('Start getting messages');
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
