import { client } from './client';

export async function getChatIdByName(chatUsername: string) {
  try {
    const entity = await client.getEntity(chatUsername);
    console.log(`Chat ID for ${chatUsername}: ${entity.id}`);
    return entity.id;
  } catch (error) {
    console.error('Error fetching chat entity:', error);
  }
}
