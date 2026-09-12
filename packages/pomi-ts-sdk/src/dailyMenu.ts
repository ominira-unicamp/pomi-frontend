import type {
  DailyMenu as GeneratedDailyMenu,
  Meal as GeneratedMeal,
} from './generated/data/domain.js'
import type { PomiSdkClient } from './generatedClient.js'

export type DailyMenu = GeneratedDailyMenu
export type DailyMeal = GeneratedMeal

type ListDailyMenusInput = Readonly<{ startDate: string; endDate: string }>

export function createDailyMenuApi(client: PomiSdkClient) {
  function listDailyMenus({ startDate, endDate }: ListDailyMenusInput) {
    return client.data.dailyMenus.list({
      filter: { date: { gte: startDate, lte: endDate } },
    })
  }

  return { listDailyMenus }
}
