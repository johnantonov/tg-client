import axios from "axios";
import { config } from "./data/config";

export async function getChannels(): Promise<string[]> {
  const res = await axios.post(config.WEB_APP_URL)
  if (res) {
    return res.data
  }
  return []
};