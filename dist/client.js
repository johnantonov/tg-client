"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.client = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const telegram_1 = require("telegram");
const sessions_1 = require("telegram/sessions");
dotenv_1.default.config();
const API_ID = process.env.API_ID;
const API_HASH = process.env.API_HASH;
exports.client = new telegram_1.TelegramClient(new sessions_1.StringSession(''), +API_ID, API_HASH, {
    connectionRetries: 5,
});
