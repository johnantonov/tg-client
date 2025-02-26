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
const input = require('input');
const patterns = [/Розыгрыш/i, /выиграй/i, /приз/i];
function checkMessagesInChannel(channelId) {
    return __awaiter(this, void 0, void 0, function* () {
        const messages = yield client_1.client.getMessages(channelId, { limit: 100 });
        const users = [];
        messages.forEach(message => {
            var _a;
            const msg = message.message;
            try {
                const user = (_a = msg === null || msg === void 0 ? void 0 : msg.split('@')[1]) === null || _a === void 0 ? void 0 : _a.split(" ")[0];
                users.push(user);
            }
            catch (_b) {
            }
            // if (patterns.some(pattern => pattern.test(message.message))) {
            //   console.log(`Found matching message in channel ${channelId}: ${message.message}`);
            // }
        });
        console.log(users);
    });
}
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield client_1.client.start({
            phoneNumber: () => __awaiter(void 0, void 0, void 0, function* () { return yield input.text("number ?"); }),
            password: () => __awaiter(void 0, void 0, void 0, function* () { return yield input.text("password?"); }),
            phoneCode: () => __awaiter(void 0, void 0, void 0, function* () { return yield input.text("Code ?"); }),
            onError: (err) => console.log(err),
        });
        checkMessagesInChannel('cashmbozon');
    }
    catch (err) {
        console.error('Произошла ошибка:', err);
    }
}))();
