import { expectApiResponse } from './errors'
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

export function createDailyMenuApi(client: PomiClient) {
  async function listDailyMenus(
    startDate: string,
    endDate = startDate,
  ): Promise<ReadonlyArray<DailyMenu>> {
    const query = new URLSearchParams({ startDate, endDate })
    const response = await client.dataApiRequest(`/daily-menus?${query}`)
    await expectApiResponse(response)
    return (await response.json()) as ReadonlyArray<DailyMenu>
  }

  return { listDailyMenus }
}
