import { pomiApi } from '@/api/client'

export type { DailyMeal, DailyMenu } from '@pomi/pomi-ts-sdk/daily-menu'

export const { listDailyMenus } = pomiApi.dailyMenu
