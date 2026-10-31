import { pomiSdk } from '@/api/client'

export type { DailyMenu } from '@ominira/pomi-sdk/generated/data'
export type { Meal as DailyMeal } from '@ominira/pomi-sdk/generated/data'

export function listDailyMenus(startDate: string, endDate = startDate) {
  return pomiSdk.data.dailyMenus.listAll({
    filter: { date: { gte: startDate, lte: endDate } },
  })
}
