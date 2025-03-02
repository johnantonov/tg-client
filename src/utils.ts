import { Api } from "telegram";

export function isWithinLastXDays(days: number, date: Api.Message['date']): boolean {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - days);
  const messageDate = new Date(date * 1000);
  return messageDate > thirtyDaysAgo;
}