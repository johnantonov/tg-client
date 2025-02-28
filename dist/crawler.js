"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("./client");
const utils_1 = require("./utils");
const methods_1 = require("./methods");
const input = require('input');
const patterns = [/Розыгрыш/i, /выиграй/i, /приз/i, /розыгрыша/i];
const chat = '3x (2x)';
function checkMessagesInChannel(channelId, destinationChatId) {
    return __awaiter(this, void 0, void 0, function* () {
        const messages = yield client_1.client.getMessages(channelId, { limit: 100 });
        messages.forEach(message => {
            const msg = message.message;
            const msgDate = message.date;
            if ((0, utils_1.isWithinLast30Days)(msgDate)) {
                if (patterns.some(pattern => pattern.test(msg))) {
                    console.log(`Found matching message in channel ${channelId}: ${msg}`);
                    client_1.client.sendMessage(destinationChatId, { message: `Matching message from channel ${channelId}: ${msg}` });
                }
            }
        });
    });
}
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield client_1.client.start({
            phoneNumber: () => __awaiter(void 0, void 0, void 0, function* () { return yield input.text('Enter your phone number:'); }),
            password: () => __awaiter(void 0, void 0, void 0, function* () { return yield input.text('Enter your password (if applicable):'); }),
            phoneCode: () => __awaiter(void 0, void 0, void 0, function* () { return yield input.text('Enter the code sent to your phone:'); }),
            onError: (err) => console.log('Error:', err),
        });
        console.log('Client started successfully!');
        const chatId = yield (0, methods_1.getChatIdByName)(chat);
        console.log(chatId);
        if (chatId) {
            yield checkMessagesInChannel('Wylsared', chatId);
        }
    }
    catch (err) {
        console.error('An error occurred:', err);
    }
}))();
