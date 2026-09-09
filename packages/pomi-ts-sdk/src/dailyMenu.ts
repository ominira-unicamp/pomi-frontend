import { dataApi } from './endpoint'
import type { PomiClient } from './client'

export type DailyMeal = Readonly<{
  id: number
  period: 'LUNCH' | 'DINNER'
  diet: 'TRADITIONAL' | 'VEGAN'
  status: 'AVAILABLE' | 'NOT_REGISTERED'
  mainDish: string | null
  items: ReadonlyArray<string>
  observations: ReadonlyArray<string>
  serviceNotes: ReadonlyArray<string>
}>

export type DailyMenu = Readonly<{
  id: number
  date: string
  meals: ReadonlyArray<DailyMeal>
  createdAt: string
  updatedAt: string
  _paths: Readonly<{ self: string }>
}>

type ListDailyMenusInput = Readonly<{ startDate: string; endDate: string }>

const dailyMenuInterface = dataApi.interface('/daily-menus')
const dailyMenuEndpoints = dailyMenuInterface.define({
  listDailyMenus: dailyMenuInterface.get<
    ReadonlyArray<DailyMenu>,
    ListDailyMenusInput
  >('', {
    query: ({ startDate, endDate }) => ({ startDate, endDate }),
  }),
})

export function createDailyMenuApi(client: PomiClient) {
  return client.bind(dailyMenuEndpoints)
}
