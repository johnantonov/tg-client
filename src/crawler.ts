import { client } from './client';
import { isWithinLastXDays } from './utils';
import { getChatIdByName } from './methods';
import { giftPatterns } from './data/patterns';
import { getChannels } from './db_utils';
const input = require('input'); 

const chat = '3x (2x)'

async function checkMessagesInChannel(channelId: string, destinationChatId?: bigInt.BigInteger) {
  const chatId = await getChatIdByName(chat)
  if (!chatId) return
  const chatEntity = await client.getEntity(chatId); 
  const messages = await client.getMessages(channelId, { limit: 200 });

  for (let i = 0; i < messages.length; i++) {
    const message = messages[i]
    const msg = message.message;
    const msgDate = message.date

    if (isWithinLastXDays(0, msgDate)) {
      if (giftPatterns.some(pattern => pattern.test(msg))) {
        console.log(JSON.stringify(message))
        await client.forwardMessages(chatEntity, {
          messages: message.id,
          fromPeer: channelId,
        });
      }
    }
  }
}

(async () => {
  try {
    await client.start({
      phoneNumber: async () => await input.text('Enter your phone number:'),
      password: async () => await input.text('Enter your password (if applicable):'),
      phoneCode: async () => await input.text('Enter the code sent to your phone:'),
      onError: (err) => console.log('Error:', err),
    });

    console.log('Client started successfully!');
    
    const channels = await getChannels();
    
    for (const channel of channels) {
      await checkMessagesInChannel(channel);
    }

  } catch (err) {
    console.error('An error occurred:', err);
  }
})();