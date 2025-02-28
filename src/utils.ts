import { Api } from "telegram";

export function isWithinLast30Days(date: Api.Message['date']): boolean {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const messageDate = new Date(date * 1000);
  return messageDate > thirtyDaysAgo;
}