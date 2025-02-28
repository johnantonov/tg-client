import { client } from './client';
import { isWithinLast30Days } from './utils';
import { getChatIdByName } from './methods';
const input = require('input'); 

const patterns = [/Розыгрыш/i, /выиграй/i, /приз/i, /розыгрыша/i];
const chat = '3x (2x)'

async function checkMessagesInChannel(channelId: string, destinationChatId: bigInt.BigInteger) {
  const messages = await client.getMessages(channelId, { limit: 100 });

  messages.forEach(message => {
    const msg = message.message;
    const msgDate = message.date

    if (isWithinLast30Days(msgDate)) {
      if (patterns.some(pattern => pattern.test(msg))) {
        console.log(`Found matching message in channel ${channelId}: ${msg}`);
      
        client.sendMessage(destinationChatId, { message: `Matching message from channel ${channelId}: ${msg}` });
      }
    }
  });
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
    
    const chatId = await getChatIdByName(chat);
    console.log(chatId)

    if (chatId) {
      await checkMessagesInChannel('Wylsared', chatId);
    }

  } catch (err) {
    console.error('An error occurred:', err);
  }
})();