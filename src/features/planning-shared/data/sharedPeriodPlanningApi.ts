import { pomiApi } from '@/api/client'

export type {
  SharedPeriodPlanning,
  SharedPeriodYearPeriod,
} from '@pomi/pomi-ts-sdk/shared-period-planning'

export const {
  listSharedPeriodPlanningsForPerson,
  getPublicSharedPeriodPlanning,
  getSharedPeriodPlanningForStudent,
  copySharedPeriodPlanning,
} = pomiApi.sharedPeriodPlanning
