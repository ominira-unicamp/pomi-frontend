import { pomiApi } from '@/api/client'

export type {
  SharedPeriodPlanning,
  SharedPeriodYearPeriod,
} from '@ominira/pomi-sdk/shared-period-planning'

export const {
  listSharedPeriodPlanningsForPerson,
  getPublicSharedPeriodPlanning,
  getSharedPeriodPlanningForStudent,
  copySharedPeriodPlanning,
} = pomiApi.sharedPeriodPlanning
