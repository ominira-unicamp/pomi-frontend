import { pomiSdk } from '@/api/client'

export type { DailyMeal, DailyMenu } from '@ominira/pomi-sdk/daily-menu'

export function listDailyMenus(startDate: string, endDate = startDate) {
  return pomiSdk.data.dailyMenus.list({
    filter: { date: { gte: startDate, lte: endDate } },
  })
}
