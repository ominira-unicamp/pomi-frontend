import type { DailyMenu as GeneratedDailyMenu } from './generated/data/domain.js'
import type { PomiSdkClient } from './generatedClient.js'

export type DailyMenu = GeneratedDailyMenu
export type DailyMeal = DailyMenu['meals'][number]

type ListDailyMenusInput = Readonly<{ startDate: string; endDate: string }>

export function createDailyMenuApi(client: PomiSdkClient) {
  function listDailyMenus({ startDate, endDate }: ListDailyMenusInput) {
    return client.data.dailyMenus.list({
      filter: { date: { gte: startDate, lte: endDate } },
    })
  }

  return { listDailyMenus }
}
