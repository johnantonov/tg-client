import { client } from "./client";
const input = require('input'); 

const patterns = [/Розыгрыш/i, /выиграй/i, /приз/i];

async function checkMessagesInChannel(channelId: string) {
  const messages = await client.getMessages(channelId, { limit: 100 })
  const users: string[] = [];
  messages.forEach(message => {
    const msg = message.message
    try {
      const user = msg?.split('@')[1]?.split(" ")[0]
      users.push(user)
    } catch {

    }
    // if (patterns.some(pattern => pattern.test(message.message))) {
    //   console.log(`Found matching message in channel ${channelId}: ${message.message}`);
    // }
  });

  console.log(users)
}

(async () => {
  try {
    await client.start({
      phoneNumber: async () => await input.text("number ?"),
      password: async () => await input.text("password?"),
      phoneCode: async () => await input.text("Code ?"),
      onError: (err) => console.log(err),
    });
    
    checkMessagesInChannel('cashmbozon')
  } catch (err) {
    console.error('Произошла ошибка:', err);
  }
})();
