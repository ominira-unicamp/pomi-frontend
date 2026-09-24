export const courseOfferingPeriodValues = ["ALL_PERIODS", "ODD_PERIODS", "EVEN_PERIODS", "UNIT_DISCRETION", null] as const
export type CourseOfferingPeriod = (typeof courseOfferingPeriodValues)[number]

export const catalogCoursePrerequisiteFulfillmentValues = ["FULL", "PARTIAL"] as const
export type CatalogCoursePrerequisiteFulfillment = (typeof catalogCoursePrerequisiteFulfillmentValues)[number]

export const catalogCourseSpecialRequirementTypeValues = ["AUTHORIZATION", "PROGRESSION_COEFFICIENT"] as const
export type CatalogCourseSpecialRequirementType = (typeof catalogCourseSpecialRequirementTypeValues)[number]

export const catalogProgramEntityShiftValues = ["DAYTIME", "NIGHT", null] as const
export type CatalogProgramEntityShift = (typeof catalogProgramEntityShiftValues)[number]

export const catalogProgramEntityCreditLimitTypeValues = ["NONE", "FIXED", "CR_FORMULA", null] as const
export type CatalogProgramEntityCreditLimitType = (typeof catalogProgramEntityCreditLimitTypeValues)[number]

export const courseRequirementTypeValues = ["any", "prefix", "specific"] as const
export type CourseRequirementType = (typeof courseRequirementTypeValues)[number]

export const yearPeriodValues = ["SUMMER", "FIRST_SEMESTER", "WINTER", "SECOND_SEMESTER"] as const
export type YearPeriod = (typeof yearPeriodValues)[number]

export const dayOfWeekValues = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"] as const
export type DayOfWeek = (typeof dayOfWeekValues)[number]

export const mealPeriodValues = ["LUNCH", "DINNER"] as const
export type MealPeriod = (typeof mealPeriodValues)[number]

export const mealDietValues = ["TRADITIONAL", "VEGAN"] as const
export type MealDiet = (typeof mealDietValues)[number]

export const mealStatusValues = ["AVAILABLE", "NOT_REGISTERED"] as const
export type MealStatus = (typeof mealStatusValues)[number]

export const enumValueNames = {
    "CourseOfferingPeriod": "courseOfferingPeriodValues",
    "CatalogCoursePrerequisiteFulfillment": "catalogCoursePrerequisiteFulfillmentValues",
    "CatalogCourseSpecialRequirementType": "catalogCourseSpecialRequirementTypeValues",
    "CatalogProgramEntity.shift": "catalogProgramEntityShiftValues",
    "CatalogProgramEntity.creditLimitType": "catalogProgramEntityCreditLimitTypeValues",
    "CourseRequirementType": "courseRequirementTypeValues",
    "YearPeriod": "yearPeriodValues",
    "DayOfWeek": "dayOfWeekValues",
    "MealPeriod": "mealPeriodValues",
    "MealDiet": "mealDietValues",
    "MealStatus": "mealStatusValues"
} as const
