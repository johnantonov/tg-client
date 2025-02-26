"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.client = void 0;
const telegram_1 = require("telegram");
const sessions_1 = require("telegram/sessions");
const API_ID = 29585850;
const API_HASH = 'fb6b2737b35a0a78ccb0606e8dec6a2d';
exports.client = new telegram_1.TelegramClient(new sessions_1.StringSession(''), API_ID, API_HASH, {
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
