import { client } from './client';
import { isWithinLast30Days } from './utils';
import { getChatIdByName } from './methods';
const input = require('input'); 

const patterns = [/Розыгрыш/i, /выиграй/i, /приз/i, /розыгрыша/i];
const chat = '3x (2x)'

async function checkMessagesInChannel(channelId: string, destinationChatId?: bigInt.BigInteger) {
  const chatId = await getChatIdByName(chat)
  if (!chatId) return
  const chatEntity = await client.getEntity(chatId); 
  const messages = await client.getMessages(channelId, { limit: 1000 });

  for (let i = 0; i < messages.length; i++) {
    const message = messages[i]
    const msg = message.message;
    const msgDate = message.date

    if (isWithinLast30Days(msgDate)) {
      if (patterns.some(pattern => pattern.test(msg))) {
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
    
    // const chatId = await getChatIdByName(chat);
    // console.log(chatId)

    // if (chatId) {
      await checkMessagesInChannel('Wylsared');
    // }

  } catch (err) {
    console.error('An error occurred:', err);
  }
})();