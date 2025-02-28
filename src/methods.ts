import { client } from './client';

export async function getChatIdByName(chatTitle: string) {
  try {
    for await (const dialog of client.iterDialogs({})) {
      if (dialog.title === chatTitle) {
        console.log(`Chat ID for ${chatTitle}: ${dialog.id}`);
        return dialog.id;
      }
    }
    console.error(`Chat with title "${chatTitle}" not found.`);
  } catch (error) {
    console.error('Error fetching chat entity:', error);
  }
}