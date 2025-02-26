import dotenv from 'dotenv';
import { TelegramClient } from 'telegram';
import { StringSession } from 'telegram/sessions';

dotenv.config();

const API_ID = process.env.API_ID;
const API_HASH = process.env.API_HASH;

export const client = new TelegramClient(new StringSession(''), +API_ID!, API_HASH!, {
  connectionRetries: 5,
});


// (async () => {
//   await client.start({
//     phoneNumber: async () => await input.text('Введите ваш номер телефона:'),
//     password: async () => await input.text('Введите ваш пароль:'),
//     phoneCode: async () => await input.text('Введите код подтверждения из Telegram:'),
//     onError: (err) => console.log(err),
//   });

//   console.log('Вы вошли в систему');
// })();
