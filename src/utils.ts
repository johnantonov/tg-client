import { Api } from "telegram";

export function isWithinLastXDays(days: number, date: Api.Message['date']): boolean {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - days);
  const messageDate = new Date(date * 1000);
  return messageDate > thirtyDaysAgo;
}

export function sleep(ms: number | { random: boolean }) {
  let timeToSleep: number;
  
  if (typeof ms === 'object' && ms.random) {
    timeToSleep = Math.floor(Math.random() * (40000 - 25000 + 1)) + 25000;
  } else {
    timeToSleep = ms as number;
  }

  return new Promise(resolve => setTimeout(resolve, timeToSleep));
}