import type { listDailyMenusOutput } from './generated/data/operations.js'
import type { PomiSdkClient } from './generatedClient.js'

export type DailyMenu = Readonly<listDailyMenusOutput[number]>
export type DailyMeal = DailyMenu['meals'][number]

type ListDailyMenusInput = Readonly<{ startDate: string; endDate: string }>

export function createDailyMenuApi(client: PomiSdkClient) {
  function listDailyMenus({ startDate, endDate }: ListDailyMenusInput) {
    return client.data.listDailyMenus({
      filter: { date: { gte: startDate, lte: endDate } },
    })
  }

  return { listDailyMenus }
}
