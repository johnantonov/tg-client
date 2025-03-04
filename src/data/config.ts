import dotenv from 'dotenv';
dotenv.config();

export const config = {
  destChatId: -1002257400192,
  destChatName: '3x (2x)',
  API_ID: +process.env.API_ID!,
  API_HASH: process.env.API_HASH!,
  WEB_APP_URL: process.env.WEB_APP_URL!,
  connectionRetries: 2, 
};