export const catalogCourseEntityPrerequisitesAnyArrayAllArrayKindValues = ["FULL", "PARTIAL", "SPECIAL"] as const
export type CatalogCourseEntityPrerequisitesAnyArrayAllArrayKind = (typeof catalogCourseEntityPrerequisitesAnyArrayAllArrayKindValues)[number]

export const courseOfferingPeriodValues = ["ALL_PERIODS", "ODD_PERIODS", "EVEN_PERIODS", "UNIT_DISCRETION", null] as const
export type CourseOfferingPeriod = (typeof courseOfferingPeriodValues)[number]

export const catalogProgramEntityBaseMandatoryArrayTypeValues = ["any", "prefix", "specific"] as const
export type CatalogProgramEntityBaseMandatoryArrayType = (typeof catalogProgramEntityBaseMandatoryArrayTypeValues)[number]

export const catalogProgramEntityBaseElectivesArrayCoursesArrayTypeValues = ["any", "prefix", "specific"] as const
export type CatalogProgramEntityBaseElectivesArrayCoursesArrayType = (typeof catalogProgramEntityBaseElectivesArrayCoursesArrayTypeValues)[number]

export const catalogProgramEntityModalitiesArrayBlocksMandatoryArrayTypeValues = ["any", "prefix", "specific"] as const
export type CatalogProgramEntityModalitiesArrayBlocksMandatoryArrayType = (typeof catalogProgramEntityModalitiesArrayBlocksMandatoryArrayTypeValues)[number]

export const catalogProgramEntityModalitiesArrayBlocksElectivesArrayCoursesArrayTypeValues = ["any", "prefix", "specific"] as const
export type CatalogProgramEntityModalitiesArrayBlocksElectivesArrayCoursesArrayType = (typeof catalogProgramEntityModalitiesArrayBlocksElectivesArrayCoursesArrayTypeValues)[number]

export const catalogProgramEntityLanguagesArrayBlocksMandatoryArrayTypeValues = ["any", "prefix", "specific"] as const
export type CatalogProgramEntityLanguagesArrayBlocksMandatoryArrayType = (typeof catalogProgramEntityLanguagesArrayBlocksMandatoryArrayTypeValues)[number]

export const catalogProgramEntityLanguagesArrayBlocksElectivesArrayCoursesArrayTypeValues = ["any", "prefix", "specific"] as const
export type CatalogProgramEntityLanguagesArrayBlocksElectivesArrayCoursesArrayType = (typeof catalogProgramEntityLanguagesArrayBlocksElectivesArrayCoursesArrayTypeValues)[number]

export const curriculumSuggestionEntityTypeValues = ["GENERAL", "SPECIALIZATION", "PRE_OPTION"] as const
export type CurriculumSuggestionEntityType = (typeof curriculumSuggestionEntityTypeValues)[number]

export const classEntityStudyPeriodYearPeriodValues = ["SUMMER", "FIRST_SEMESTER", "WINTER", "SECOND_SEMESTER"] as const
export type ClassEntityStudyPeriodYearPeriod = (typeof classEntityStudyPeriodYearPeriodValues)[number]

export const classScheduleEntityDayOfWeekValues = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"] as const
export type ClassScheduleEntityDayOfWeek = (typeof classScheduleEntityDayOfWeekValues)[number]

export const classScheduleEntityStudyPeriodYearPeriodValues = ["SUMMER", "FIRST_SEMESTER", "WINTER", "SECOND_SEMESTER"] as const
export type ClassScheduleEntityStudyPeriodYearPeriod = (typeof classScheduleEntityStudyPeriodYearPeriodValues)[number]

export const mealPeriodValues = ["LUNCH", "DINNER"] as const
export type MealPeriod = (typeof mealPeriodValues)[number]

export const mealDietValues = ["TRADITIONAL", "VEGAN"] as const
export type MealDiet = (typeof mealDietValues)[number]

export const mealStatusValues = ["AVAILABLE", "NOT_REGISTERED"] as const
export type MealStatus = (typeof mealStatusValues)[number]

export const studyPeriodEntityYearPeriodValues = ["SUMMER", "FIRST_SEMESTER", "WINTER", "SECOND_SEMESTER"] as const
export type StudyPeriodEntityYearPeriod = (typeof studyPeriodEntityYearPeriodValues)[number]

export const enumValueNames = {
    "CatalogCourseEntity.prerequisites.any[].all[].kind": "catalogCourseEntityPrerequisitesAnyArrayAllArrayKindValues",
    "CourseOfferingPeriod": "courseOfferingPeriodValues",
    "CatalogProgramEntity.base.mandatory[].type": "catalogProgramEntityBaseMandatoryArrayTypeValues",
    "CatalogProgramEntity.base.electives[].courses[].type": "catalogProgramEntityBaseElectivesArrayCoursesArrayTypeValues",
    "CatalogProgramEntity.modalities[].blocks.mandatory[].type": "catalogProgramEntityModalitiesArrayBlocksMandatoryArrayTypeValues",
    "CatalogProgramEntity.modalities[].blocks.electives[].courses[].type": "catalogProgramEntityModalitiesArrayBlocksElectivesArrayCoursesArrayTypeValues",
    "CatalogProgramEntity.languages[].blocks.mandatory[].type": "catalogProgramEntityLanguagesArrayBlocksMandatoryArrayTypeValues",
    "CatalogProgramEntity.languages[].blocks.electives[].courses[].type": "catalogProgramEntityLanguagesArrayBlocksElectivesArrayCoursesArrayTypeValues",
    "CurriculumSuggestionEntity.type": "curriculumSuggestionEntityTypeValues",
    "ClassEntity.studyPeriodYearPeriod": "classEntityStudyPeriodYearPeriodValues",
    "ClassScheduleEntity.dayOfWeek": "classScheduleEntityDayOfWeekValues",
    "ClassScheduleEntity.studyPeriodYearPeriod": "classScheduleEntityStudyPeriodYearPeriodValues",
    "Meal.period": "mealPeriodValues",
    "Meal.diet": "mealDietValues",
    "Meal.status": "mealStatusValues",
    "StudyPeriodEntity.yearPeriod": "studyPeriodEntityYearPeriodValues"
} as const
