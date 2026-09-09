import { pomiApi } from '@/api/client'

export type { DailyMeal, DailyMenu } from '@pomi/pomi-ts-sdk/daily-menu'

export function listDailyMenus(startDate: string, endDate = startDate) {
  return pomiApi.dailyMenu.listDailyMenus({ startDate, endDate })
}
