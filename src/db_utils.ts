import axios from "axios";
import { config } from "./data/config";

export async function getChannels(): Promise<{ chatId: string | null, accessHash: string | null, chatUsername: string, lastChecked: string | null }[]> {
  const res = await axios.get(config.WEB_APP_URL);
  if (res) {
    return res.data;
  }
  return [];
};

export async function updateChannelInfo(channels: { chatId: string, accessHash: any, chatUsername: string, lastChecked: string }[]) {
  try {
    await axios.post(config.WEB_APP_URL, channels);
  } catch (error) {
    console.error('Failed to update channel info:', error);
  }
}