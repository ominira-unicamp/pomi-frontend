import type { operations } from './openapi.js'
import type { GeneratedOperationDefinition } from '../../runtime/operation.js'

type ParameterRecord<T> = [NonNullable<T>] extends [never] ? {} : NonNullable<T>
type RequestBodyOf<T> = T extends { requestBody: { content: infer Content } }
    ? Content[keyof Content]
    : never
type BodyInput<Body, Required extends boolean> = [Body] extends [never]
    ? {}
    : Required extends true
    ? { body: Body }
    : { body?: Body }
type HeaderInput<Header> = [NonNullable<Header>] extends [never]
    ? {}
    : { headers?: NonNullable<Header> }
type OperationInput<Path, Query, Header, Body, BodyRequired extends boolean> =
    ParameterRecord<Path> & ParameterRecord<Query> & HeaderInput<Header> & BodyInput<Body, BodyRequired>

export type getCalendarEventsInput = OperationInput<operations["getCalendarEvents"]['parameters']['path'], operations["getCalendarEvents"]['parameters']['query'], operations["getCalendarEvents"]['parameters']['header'], RequestBodyOf<operations["getCalendarEvents"]>, false>
export type getCalendarEventsOutput = import('./domain.js').CalendarEvent
export type getCalendarEventsProblem = operations["getCalendarEvents"]['responses'][400]['content']["application/problem+json"] | operations["getCalendarEvents"]['responses'][404]['content']["application/problem+json"] | operations["getCalendarEvents"]['responses'][500]['content']["application/problem+json"]
export type getCalendarTagsInput = OperationInput<operations["getCalendarTags"]['parameters']['path'], operations["getCalendarTags"]['parameters']['query'], operations["getCalendarTags"]['parameters']['header'], RequestBodyOf<operations["getCalendarTags"]>, false>
export type getCalendarTagsOutput = import('./domain.js').CalendarTag
export type getCalendarTagsProblem = operations["getCalendarTags"]['responses'][400]['content']["application/problem+json"] | operations["getCalendarTags"]['responses'][404]['content']["application/problem+json"] | operations["getCalendarTags"]['responses'][500]['content']["application/problem+json"]
export type getCatalogCoursesInput = OperationInput<operations["getCatalogCourses"]['parameters']['path'], operations["getCatalogCourses"]['parameters']['query'], operations["getCatalogCourses"]['parameters']['header'], RequestBodyOf<operations["getCatalogCourses"]>, false>
export type getCatalogCoursesOutput = import('./domain.js').CatalogCourse
export type getCatalogCoursesProblem = operations["getCatalogCourses"]['responses'][400]['content']["application/problem+json"] | operations["getCatalogCourses"]['responses'][404]['content']["application/problem+json"] | operations["getCatalogCourses"]['responses'][500]['content']["application/problem+json"]
export type getCatalogProgramInput = OperationInput<operations["getCatalogProgram"]['parameters']['path'], operations["getCatalogProgram"]['parameters']['query'], operations["getCatalogProgram"]['parameters']['header'], RequestBodyOf<operations["getCatalogProgram"]>, false>
export type getCatalogProgramOutput = import('./domain.js').CatalogProgram
export type getCatalogProgramProblem = operations["getCatalogProgram"]['responses'][400]['content']["application/problem+json"] | operations["getCatalogProgram"]['responses'][404]['content']["application/problem+json"] | operations["getCatalogProgram"]['responses'][500]['content']["application/problem+json"]
export type getCatalogsInput = OperationInput<operations["getCatalogs"]['parameters']['path'], operations["getCatalogs"]['parameters']['query'], operations["getCatalogs"]['parameters']['header'], RequestBodyOf<operations["getCatalogs"]>, false>
export type getCatalogsOutput = import('./domain.js').Catalog
export type getCatalogsProblem = operations["getCatalogs"]['responses'][400]['content']["application/problem+json"] | operations["getCatalogs"]['responses'][404]['content']["application/problem+json"] | operations["getCatalogs"]['responses'][500]['content']["application/problem+json"]
export type getClassesInput = OperationInput<operations["getClasses"]['parameters']['path'], operations["getClasses"]['parameters']['query'], operations["getClasses"]['parameters']['header'], RequestBodyOf<operations["getClasses"]>, false>
export type getClassesOutput = import('./domain.js').Class
export type getClassesProblem = operations["getClasses"]['responses'][400]['content']["application/problem+json"] | operations["getClasses"]['responses'][404]['content']["application/problem+json"] | operations["getClasses"]['responses'][500]['content']["application/problem+json"]
export type getClassSchedulesInput = OperationInput<operations["getClassSchedules"]['parameters']['path'], operations["getClassSchedules"]['parameters']['query'], operations["getClassSchedules"]['parameters']['header'], RequestBodyOf<operations["getClassSchedules"]>, false>
export type getClassSchedulesOutput = import('./domain.js').ClassSchedule
export type getClassSchedulesProblem = operations["getClassSchedules"]['responses'][400]['content']["application/problem+json"] | operations["getClassSchedules"]['responses'][404]['content']["application/problem+json"] | operations["getClassSchedules"]['responses'][500]['content']["application/problem+json"]
export type getCoauthorsInput = OperationInput<operations["getCoauthors"]['parameters']['path'], operations["getCoauthors"]['parameters']['query'], operations["getCoauthors"]['parameters']['header'], RequestBodyOf<operations["getCoauthors"]>, false>
export type getCoauthorsOutput = import('./domain.js').Coauthor
export type getCoauthorsProblem = operations["getCoauthors"]['responses'][400]['content']["application/problem+json"] | operations["getCoauthors"]['responses'][404]['content']["application/problem+json"] | operations["getCoauthors"]['responses'][500]['content']["application/problem+json"]
export type getCoordinatorsInput = OperationInput<operations["getCoordinators"]['parameters']['path'], operations["getCoordinators"]['parameters']['query'], operations["getCoordinators"]['parameters']['header'], RequestBodyOf<operations["getCoordinators"]>, false>
export type getCoordinatorsOutput = import('./domain.js').Coordinator
export type getCoordinatorsProblem = operations["getCoordinators"]['responses'][400]['content']["application/problem+json"] | operations["getCoordinators"]['responses'][404]['content']["application/problem+json"] | operations["getCoordinators"]['responses'][500]['content']["application/problem+json"]
export type getCoursesInput = OperationInput<operations["getCourses"]['parameters']['path'], operations["getCourses"]['parameters']['query'], operations["getCourses"]['parameters']['header'], RequestBodyOf<operations["getCourses"]>, false>
export type getCoursesOutput = import('./domain.js').Course
export type getCoursesProblem = operations["getCourses"]['responses'][400]['content']["application/problem+json"] | operations["getCourses"]['responses'][404]['content']["application/problem+json"] | operations["getCourses"]['responses'][500]['content']["application/problem+json"]
export type getCurriculumSuggestionsInput = OperationInput<operations["getCurriculumSuggestions"]['parameters']['path'], operations["getCurriculumSuggestions"]['parameters']['query'], operations["getCurriculumSuggestions"]['parameters']['header'], RequestBodyOf<operations["getCurriculumSuggestions"]>, false>
export type getCurriculumSuggestionsOutput = import('./domain.js').CurriculumSuggestion
export type getCurriculumSuggestionsProblem = operations["getCurriculumSuggestions"]['responses'][400]['content']["application/problem+json"] | operations["getCurriculumSuggestions"]['responses'][404]['content']["application/problem+json"] | operations["getCurriculumSuggestions"]['responses'][500]['content']["application/problem+json"]
export type getDailyMenusInput = OperationInput<operations["getDailyMenus"]['parameters']['path'], operations["getDailyMenus"]['parameters']['query'], operations["getDailyMenus"]['parameters']['header'], RequestBodyOf<operations["getDailyMenus"]>, false>
export type getDailyMenusOutput = import('./domain.js').DailyMenu
export type getDailyMenusProblem = operations["getDailyMenus"]['responses'][400]['content']["application/problem+json"] | operations["getDailyMenus"]['responses'][404]['content']["application/problem+json"] | operations["getDailyMenus"]['responses'][500]['content']["application/problem+json"]
export type getDepartmentsInput = OperationInput<operations["getDepartments"]['parameters']['path'], operations["getDepartments"]['parameters']['query'], operations["getDepartments"]['parameters']['header'], RequestBodyOf<operations["getDepartments"]>, false>
export type getDepartmentsOutput = import('./domain.js').Department
export type getDepartmentsProblem = operations["getDepartments"]['responses'][400]['content']["application/problem+json"] | operations["getDepartments"]['responses'][404]['content']["application/problem+json"] | operations["getDepartments"]['responses'][500]['content']["application/problem+json"]
export type getExchangeNoticesInput = OperationInput<operations["getExchangeNotices"]['parameters']['path'], operations["getExchangeNotices"]['parameters']['query'], operations["getExchangeNotices"]['parameters']['header'], RequestBodyOf<operations["getExchangeNotices"]>, false>
export type getExchangeNoticesOutput = import('./domain.js').ExchangeNotice
export type getExchangeNoticesProblem = operations["getExchangeNotices"]['responses'][400]['content']["application/problem+json"] | operations["getExchangeNotices"]['responses'][404]['content']["application/problem+json"] | operations["getExchangeNotices"]['responses'][500]['content']["application/problem+json"]
export type getKeywordsInput = OperationInput<operations["getKeywords"]['parameters']['path'], operations["getKeywords"]['parameters']['query'], operations["getKeywords"]['parameters']['header'], RequestBodyOf<operations["getKeywords"]>, false>
export type getKeywordsOutput = import('./domain.js').Keyword
export type getKeywordsProblem = operations["getKeywords"]['responses'][400]['content']["application/problem+json"] | operations["getKeywords"]['responses'][404]['content']["application/problem+json"] | operations["getKeywords"]['responses'][500]['content']["application/problem+json"]
export type getLanguagesInput = OperationInput<operations["getLanguages"]['parameters']['path'], operations["getLanguages"]['parameters']['query'], operations["getLanguages"]['parameters']['header'], RequestBodyOf<operations["getLanguages"]>, false>
export type getLanguagesOutput = import('./domain.js').Language
export type getLanguagesProblem = operations["getLanguages"]['responses'][400]['content']["application/problem+json"] | operations["getLanguages"]['responses'][404]['content']["application/problem+json"] | operations["getLanguages"]['responses'][500]['content']["application/problem+json"]
export type getProfessorDataPortalProfilesInput = OperationInput<operations["getProfessorDataPortalProfiles"]['parameters']['path'], operations["getProfessorDataPortalProfiles"]['parameters']['query'], operations["getProfessorDataPortalProfiles"]['parameters']['header'], RequestBodyOf<operations["getProfessorDataPortalProfiles"]>, false>
export type getProfessorDataPortalProfilesOutput = import('./domain.js').ProfessorDataPortalProfile
export type getProfessorDataPortalProfilesProblem = operations["getProfessorDataPortalProfiles"]['responses'][400]['content']["application/problem+json"] | operations["getProfessorDataPortalProfiles"]['responses'][404]['content']["application/problem+json"] | operations["getProfessorDataPortalProfiles"]['responses'][500]['content']["application/problem+json"]
export type getProfessorPositionsInput = OperationInput<operations["getProfessorPositions"]['parameters']['path'], operations["getProfessorPositions"]['parameters']['query'], operations["getProfessorPositions"]['parameters']['header'], RequestBodyOf<operations["getProfessorPositions"]>, false>
export type getProfessorPositionsOutput = import('./domain.js').ProfessorPosition
export type getProfessorPositionsProblem = operations["getProfessorPositions"]['responses'][400]['content']["application/problem+json"] | operations["getProfessorPositions"]['responses'][404]['content']["application/problem+json"] | operations["getProfessorPositions"]['responses'][500]['content']["application/problem+json"]
export type getProfessorsInput = OperationInput<operations["getProfessors"]['parameters']['path'], operations["getProfessors"]['parameters']['query'], operations["getProfessors"]['parameters']['header'], RequestBodyOf<operations["getProfessors"]>, false>
export type getProfessorsOutput = import('./domain.js').Professor
export type getProfessorsProblem = operations["getProfessors"]['responses'][400]['content']["application/problem+json"] | operations["getProfessors"]['responses'][404]['content']["application/problem+json"] | operations["getProfessors"]['responses'][500]['content']["application/problem+json"]
export type getProgramsInput = OperationInput<operations["getPrograms"]['parameters']['path'], operations["getPrograms"]['parameters']['query'], operations["getPrograms"]['parameters']['header'], RequestBodyOf<operations["getPrograms"]>, false>
export type getProgramsOutput = import('./domain.js').Program
export type getProgramsProblem = operations["getPrograms"]['responses'][400]['content']["application/problem+json"] | operations["getPrograms"]['responses'][404]['content']["application/problem+json"] | operations["getPrograms"]['responses'][500]['content']["application/problem+json"]
export type getRoomsInput = OperationInput<operations["getRooms"]['parameters']['path'], operations["getRooms"]['parameters']['query'], operations["getRooms"]['parameters']['header'], RequestBodyOf<operations["getRooms"]>, false>
export type getRoomsOutput = import('./domain.js').Room
export type getRoomsProblem = operations["getRooms"]['responses'][400]['content']["application/problem+json"] | operations["getRooms"]['responses'][404]['content']["application/problem+json"] | operations["getRooms"]['responses'][500]['content']["application/problem+json"]
export type getSpecializationsInput = OperationInput<operations["getSpecializations"]['parameters']['path'], operations["getSpecializations"]['parameters']['query'], operations["getSpecializations"]['parameters']['header'], RequestBodyOf<operations["getSpecializations"]>, false>
export type getSpecializationsOutput = import('./domain.js').Specialization
export type getSpecializationsProblem = operations["getSpecializations"]['responses'][400]['content']["application/problem+json"] | operations["getSpecializations"]['responses'][404]['content']["application/problem+json"] | operations["getSpecializations"]['responses'][500]['content']["application/problem+json"]
export type getStudyPeriodsInput = OperationInput<operations["getStudyPeriods"]['parameters']['path'], operations["getStudyPeriods"]['parameters']['query'], operations["getStudyPeriods"]['parameters']['header'], RequestBodyOf<operations["getStudyPeriods"]>, false>
export type getStudyPeriodsOutput = import('./domain.js').StudyPeriod
export type getStudyPeriodsProblem = operations["getStudyPeriods"]['responses'][400]['content']["application/problem+json"] | operations["getStudyPeriods"]['responses'][404]['content']["application/problem+json"] | operations["getStudyPeriods"]['responses'][500]['content']["application/problem+json"]
export type getUnitsInput = OperationInput<operations["getUnits"]['parameters']['path'], operations["getUnits"]['parameters']['query'], operations["getUnits"]['parameters']['header'], RequestBodyOf<operations["getUnits"]>, false>
export type getUnitsOutput = import('./domain.js').Unit
export type getUnitsProblem = operations["getUnits"]['responses'][400]['content']["application/problem+json"] | operations["getUnits"]['responses'][404]['content']["application/problem+json"] | operations["getUnits"]['responses'][500]['content']["application/problem+json"]
export type listCalendarInput = OperationInput<operations["listCalendar"]['parameters']['path'], operations["listCalendar"]['parameters']['query'], operations["listCalendar"]['parameters']['header'], RequestBodyOf<operations["listCalendar"]>, false>
export type listCalendarOutput = operations["listCalendar"]['responses'][200]['content']["text/calendar"]
export type listCalendarProblem = operations["listCalendar"]['responses'][400]['content']["application/problem+json"] | operations["listCalendar"]['responses'][500]['content']["application/problem+json"]
export type listCalendarEventsInput = OperationInput<operations["listCalendarEvents"]['parameters']['path'], operations["listCalendarEvents"]['parameters']['query'], operations["listCalendarEvents"]['parameters']['header'], RequestBodyOf<operations["listCalendarEvents"]>, false>
export type listCalendarEventsOutput = ReadonlyArray<import('./domain.js').CalendarEvent>
export type listCalendarEventsProblem = operations["listCalendarEvents"]['responses'][400]['content']["application/problem+json"] | operations["listCalendarEvents"]['responses'][500]['content']["application/problem+json"]
export type listCalendarTagsInput = OperationInput<operations["listCalendarTags"]['parameters']['path'], operations["listCalendarTags"]['parameters']['query'], operations["listCalendarTags"]['parameters']['header'], RequestBodyOf<operations["listCalendarTags"]>, false>
export type listCalendarTagsOutput = ReadonlyArray<import('./domain.js').CalendarTag>
export type listCalendarTagsProblem = operations["listCalendarTags"]['responses'][400]['content']["application/problem+json"] | operations["listCalendarTags"]['responses'][500]['content']["application/problem+json"]
export type listCatalogCoursesInput = OperationInput<operations["listCatalogCourses"]['parameters']['path'], operations["listCatalogCourses"]['parameters']['query'], operations["listCatalogCourses"]['parameters']['header'], RequestBodyOf<operations["listCatalogCourses"]>, false>
export type listCatalogCoursesOutput = import('./domain.js').Page<import('./domain.js').CatalogCourse>
export type listCatalogCoursesProblem = operations["listCatalogCourses"]['responses'][400]['content']["application/problem+json"] | operations["listCatalogCourses"]['responses'][500]['content']["application/problem+json"]
export type listCatalogProgramInput = OperationInput<operations["listCatalogProgram"]['parameters']['path'], operations["listCatalogProgram"]['parameters']['query'], operations["listCatalogProgram"]['parameters']['header'], RequestBodyOf<operations["listCatalogProgram"]>, false>
export type listCatalogProgramOutput = ReadonlyArray<import('./domain.js').CatalogProgram>
export type listCatalogProgramProblem = operations["listCatalogProgram"]['responses'][400]['content']["application/problem+json"] | operations["listCatalogProgram"]['responses'][500]['content']["application/problem+json"]
export type listCatalogsInput = OperationInput<operations["listCatalogs"]['parameters']['path'], operations["listCatalogs"]['parameters']['query'], operations["listCatalogs"]['parameters']['header'], RequestBodyOf<operations["listCatalogs"]>, false>
export type listCatalogsOutput = ReadonlyArray<import('./domain.js').Catalog>
export type listCatalogsProblem = operations["listCatalogs"]['responses'][400]['content']["application/problem+json"] | operations["listCatalogs"]['responses'][500]['content']["application/problem+json"]
export type listClassesInput = OperationInput<operations["listClasses"]['parameters']['path'], operations["listClasses"]['parameters']['query'], operations["listClasses"]['parameters']['header'], RequestBodyOf<operations["listClasses"]>, false>
export type listClassesOutput = import('./domain.js').Page<import('./domain.js').Class>
export type listClassesProblem = operations["listClasses"]['responses'][400]['content']["application/problem+json"] | operations["listClasses"]['responses'][500]['content']["application/problem+json"]
export type listClassSchedulesInput = OperationInput<operations["listClassSchedules"]['parameters']['path'], operations["listClassSchedules"]['parameters']['query'], operations["listClassSchedules"]['parameters']['header'], RequestBodyOf<operations["listClassSchedules"]>, false>
export type listClassSchedulesOutput = import('./domain.js').PageClassSchedules
export type listClassSchedulesProblem = operations["listClassSchedules"]['responses'][400]['content']["application/problem+json"] | operations["listClassSchedules"]['responses'][500]['content']["application/problem+json"]
export type listCoauthorsInput = OperationInput<operations["listCoauthors"]['parameters']['path'], operations["listCoauthors"]['parameters']['query'], operations["listCoauthors"]['parameters']['header'], RequestBodyOf<operations["listCoauthors"]>, false>
export type listCoauthorsOutput = import('./domain.js').Page<import('./domain.js').Coauthor>
export type listCoauthorsProblem = operations["listCoauthors"]['responses'][400]['content']["application/problem+json"] | operations["listCoauthors"]['responses'][500]['content']["application/problem+json"]
export type listCoordinatorsInput = OperationInput<operations["listCoordinators"]['parameters']['path'], operations["listCoordinators"]['parameters']['query'], operations["listCoordinators"]['parameters']['header'], RequestBodyOf<operations["listCoordinators"]>, false>
export type listCoordinatorsOutput = import('./domain.js').Page<import('./domain.js').Coordinator>
export type listCoordinatorsProblem = operations["listCoordinators"]['responses'][400]['content']["application/problem+json"] | operations["listCoordinators"]['responses'][500]['content']["application/problem+json"]
export type listCoursesInput = OperationInput<operations["listCourses"]['parameters']['path'], operations["listCourses"]['parameters']['query'], operations["listCourses"]['parameters']['header'], RequestBodyOf<operations["listCourses"]>, false>
export type listCoursesOutput = import('./domain.js').PageCourses
export type listCoursesProblem = operations["listCourses"]['responses'][400]['content']["application/problem+json"] | operations["listCourses"]['responses'][500]['content']["application/problem+json"]
export type listCoursesEvaluationSummariesInput = OperationInput<operations["listCoursesEvaluationSummaries"]['parameters']['path'], operations["listCoursesEvaluationSummaries"]['parameters']['query'], operations["listCoursesEvaluationSummaries"]['parameters']['header'], RequestBodyOf<operations["listCoursesEvaluationSummaries"]>, false>
export type listCoursesEvaluationSummariesOutput = import('./domain.js').PageCourseEvaluationSummaries
export type listCoursesEvaluationSummariesProblem = operations["listCoursesEvaluationSummaries"]['responses'][400]['content']["application/problem+json"] | operations["listCoursesEvaluationSummaries"]['responses'][500]['content']["application/problem+json"]
export type listCurriculumSuggestionsInput = OperationInput<operations["listCurriculumSuggestions"]['parameters']['path'], operations["listCurriculumSuggestions"]['parameters']['query'], operations["listCurriculumSuggestions"]['parameters']['header'], RequestBodyOf<operations["listCurriculumSuggestions"]>, false>
export type listCurriculumSuggestionsOutput = ReadonlyArray<import('./domain.js').CurriculumSuggestion>
export type listCurriculumSuggestionsProblem = operations["listCurriculumSuggestions"]['responses'][400]['content']["application/problem+json"] | operations["listCurriculumSuggestions"]['responses'][500]['content']["application/problem+json"]
export type listDailyMenusInput = OperationInput<operations["listDailyMenus"]['parameters']['path'], operations["listDailyMenus"]['parameters']['query'], operations["listDailyMenus"]['parameters']['header'], RequestBodyOf<operations["listDailyMenus"]>, false>
export type listDailyMenusOutput = ReadonlyArray<import('./domain.js').DailyMenu>
export type listDailyMenusProblem = operations["listDailyMenus"]['responses'][400]['content']["application/problem+json"] | operations["listDailyMenus"]['responses'][500]['content']["application/problem+json"]
export type listDepartmentsInput = OperationInput<operations["listDepartments"]['parameters']['path'], operations["listDepartments"]['parameters']['query'], operations["listDepartments"]['parameters']['header'], RequestBodyOf<operations["listDepartments"]>, false>
export type listDepartmentsOutput = ReadonlyArray<import('./domain.js').Department>
export type listDepartmentsProblem = operations["listDepartments"]['responses'][400]['content']["application/problem+json"] | operations["listDepartments"]['responses'][500]['content']["application/problem+json"]
export type listEvaluationSummariesInput = OperationInput<operations["listEvaluationSummaries"]['parameters']['path'], operations["listEvaluationSummaries"]['parameters']['query'], operations["listEvaluationSummaries"]['parameters']['header'], RequestBodyOf<operations["listEvaluationSummaries"]>, false>
export type listEvaluationSummariesOutput = import('./domain.js').CourseProfessorEvaluationSummary
export type listEvaluationSummariesProblem = operations["listEvaluationSummaries"]['responses'][400]['content']["application/problem+json"] | operations["listEvaluationSummaries"]['responses'][404]['content']["application/problem+json"] | operations["listEvaluationSummaries"]['responses'][500]['content']["application/problem+json"]
export type listExchangeNoticesInput = OperationInput<operations["listExchangeNotices"]['parameters']['path'], operations["listExchangeNotices"]['parameters']['query'], operations["listExchangeNotices"]['parameters']['header'], RequestBodyOf<operations["listExchangeNotices"]>, false>
export type listExchangeNoticesOutput = ReadonlyArray<import('./domain.js').ExchangeNotice>
export type listExchangeNoticesProblem = operations["listExchangeNotices"]['responses'][400]['content']["application/problem+json"] | operations["listExchangeNotices"]['responses'][500]['content']["application/problem+json"]
export type listExchangePlacesInput = OperationInput<operations["listExchangePlaces"]['parameters']['path'], operations["listExchangePlaces"]['parameters']['query'], operations["listExchangePlaces"]['parameters']['header'], RequestBodyOf<operations["listExchangePlaces"]>, false>
export type listExchangePlacesOutput = ReadonlyArray<import('./domain.js').ExchangePlaceListItem>
export type listExchangePlacesProblem = operations["listExchangePlaces"]['responses'][400]['content']["application/problem+json"] | operations["listExchangePlaces"]['responses'][500]['content']["application/problem+json"]
export type listKeywordsInput = OperationInput<operations["listKeywords"]['parameters']['path'], operations["listKeywords"]['parameters']['query'], operations["listKeywords"]['parameters']['header'], RequestBodyOf<operations["listKeywords"]>, false>
export type listKeywordsOutput = import('./domain.js').Page<import('./domain.js').Keyword>
export type listKeywordsProblem = operations["listKeywords"]['responses'][400]['content']["application/problem+json"] | operations["listKeywords"]['responses'][500]['content']["application/problem+json"]
export type listLanguagesInput = OperationInput<operations["listLanguages"]['parameters']['path'], operations["listLanguages"]['parameters']['query'], operations["listLanguages"]['parameters']['header'], RequestBodyOf<operations["listLanguages"]>, false>
export type listLanguagesOutput = ReadonlyArray<import('./domain.js').Language>
export type listLanguagesProblem = operations["listLanguages"]['responses'][400]['content']["application/problem+json"] | operations["listLanguages"]['responses'][500]['content']["application/problem+json"]
export type listProfessorDataPortalProfilesInput = OperationInput<operations["listProfessorDataPortalProfiles"]['parameters']['path'], operations["listProfessorDataPortalProfiles"]['parameters']['query'], operations["listProfessorDataPortalProfiles"]['parameters']['header'], RequestBodyOf<operations["listProfessorDataPortalProfiles"]>, false>
export type listProfessorDataPortalProfilesOutput = import('./domain.js').Page<import('./domain.js').ProfessorDataPortalProfileSummary>
export type listProfessorDataPortalProfilesProblem = operations["listProfessorDataPortalProfiles"]['responses'][400]['content']["application/problem+json"] | operations["listProfessorDataPortalProfiles"]['responses'][500]['content']["application/problem+json"]
export type listProfessorPositionsInput = OperationInput<operations["listProfessorPositions"]['parameters']['path'], operations["listProfessorPositions"]['parameters']['query'], operations["listProfessorPositions"]['parameters']['header'], RequestBodyOf<operations["listProfessorPositions"]>, false>
export type listProfessorPositionsOutput = ReadonlyArray<import('./domain.js').ProfessorPosition>
export type listProfessorPositionsProblem = operations["listProfessorPositions"]['responses'][400]['content']["application/problem+json"] | operations["listProfessorPositions"]['responses'][500]['content']["application/problem+json"]
export type listProfessorsInput = OperationInput<operations["listProfessors"]['parameters']['path'], operations["listProfessors"]['parameters']['query'], operations["listProfessors"]['parameters']['header'], RequestBodyOf<operations["listProfessors"]>, false>
export type listProfessorsOutput = import('./domain.js').PageProfessors
export type listProfessorsProblem = operations["listProfessors"]['responses'][400]['content']["application/problem+json"] | operations["listProfessors"]['responses'][500]['content']["application/problem+json"]
export type listProfessorsEvaluationSummariesInput = OperationInput<operations["listProfessorsEvaluationSummaries"]['parameters']['path'], operations["listProfessorsEvaluationSummaries"]['parameters']['query'], operations["listProfessorsEvaluationSummaries"]['parameters']['header'], RequestBodyOf<operations["listProfessorsEvaluationSummaries"]>, false>
export type listProfessorsEvaluationSummariesOutput = import('./domain.js').PageProfessorEvaluationSummaries
export type listProfessorsEvaluationSummariesProblem = operations["listProfessorsEvaluationSummaries"]['responses'][400]['content']["application/problem+json"] | operations["listProfessorsEvaluationSummaries"]['responses'][500]['content']["application/problem+json"]
export type listProgramsInput = OperationInput<operations["listPrograms"]['parameters']['path'], operations["listPrograms"]['parameters']['query'], operations["listPrograms"]['parameters']['header'], RequestBodyOf<operations["listPrograms"]>, false>
export type listProgramsOutput = ReadonlyArray<import('./domain.js').Program>
export type listProgramsProblem = operations["listPrograms"]['responses'][400]['content']["application/problem+json"] | operations["listPrograms"]['responses'][500]['content']["application/problem+json"]
export type listRoomsInput = OperationInput<operations["listRooms"]['parameters']['path'], operations["listRooms"]['parameters']['query'], operations["listRooms"]['parameters']['header'], RequestBodyOf<operations["listRooms"]>, false>
export type listRoomsOutput = ReadonlyArray<import('./domain.js').Room>
export type listRoomsProblem = operations["listRooms"]['responses'][400]['content']["application/problem+json"] | operations["listRooms"]['responses'][500]['content']["application/problem+json"]
export type listSpecializationsInput = OperationInput<operations["listSpecializations"]['parameters']['path'], operations["listSpecializations"]['parameters']['query'], operations["listSpecializations"]['parameters']['header'], RequestBodyOf<operations["listSpecializations"]>, false>
export type listSpecializationsOutput = ReadonlyArray<import('./domain.js').Specialization>
export type listSpecializationsProblem = operations["listSpecializations"]['responses'][400]['content']["application/problem+json"] | operations["listSpecializations"]['responses'][500]['content']["application/problem+json"]
export type listStudyPeriodsInput = OperationInput<operations["listStudyPeriods"]['parameters']['path'], operations["listStudyPeriods"]['parameters']['query'], operations["listStudyPeriods"]['parameters']['header'], RequestBodyOf<operations["listStudyPeriods"]>, false>
export type listStudyPeriodsOutput = ReadonlyArray<import('./domain.js').StudyPeriod>
export type listStudyPeriodsProblem = operations["listStudyPeriods"]['responses'][400]['content']["application/problem+json"] | operations["listStudyPeriods"]['responses'][500]['content']["application/problem+json"]
export type listUnitsInput = OperationInput<operations["listUnits"]['parameters']['path'], operations["listUnits"]['parameters']['query'], operations["listUnits"]['parameters']['header'], RequestBodyOf<operations["listUnits"]>, false>
export type listUnitsOutput = ReadonlyArray<import('./domain.js').Unit>
export type listUnitsProblem = operations["listUnits"]['responses'][400]['content']["application/problem+json"] | operations["listUnits"]['responses'][500]['content']["application/problem+json"]

export interface OperationInputs {
    getCalendarEvents: getCalendarEventsInput
    getCalendarTags: getCalendarTagsInput
    getCatalogCourses: getCatalogCoursesInput
    getCatalogProgram: getCatalogProgramInput
    getCatalogs: getCatalogsInput
    getClasses: getClassesInput
    getClassSchedules: getClassSchedulesInput
    getCoauthors: getCoauthorsInput
    getCoordinators: getCoordinatorsInput
    getCourses: getCoursesInput
    getCurriculumSuggestions: getCurriculumSuggestionsInput
    getDailyMenus: getDailyMenusInput
    getDepartments: getDepartmentsInput
    getExchangeNotices: getExchangeNoticesInput
    getKeywords: getKeywordsInput
    getLanguages: getLanguagesInput
    getProfessorDataPortalProfiles: getProfessorDataPortalProfilesInput
    getProfessorPositions: getProfessorPositionsInput
    getProfessors: getProfessorsInput
    getPrograms: getProgramsInput
    getRooms: getRoomsInput
    getSpecializations: getSpecializationsInput
    getStudyPeriods: getStudyPeriodsInput
    getUnits: getUnitsInput
    listCalendar: listCalendarInput
    listCalendarEvents: listCalendarEventsInput
    listCalendarTags: listCalendarTagsInput
    listCatalogCourses: listCatalogCoursesInput
    listCatalogProgram: listCatalogProgramInput
    listCatalogs: listCatalogsInput
    listClasses: listClassesInput
    listClassSchedules: listClassSchedulesInput
    listCoauthors: listCoauthorsInput
    listCoordinators: listCoordinatorsInput
    listCourses: listCoursesInput
    listCoursesEvaluationSummaries: listCoursesEvaluationSummariesInput
    listCurriculumSuggestions: listCurriculumSuggestionsInput
    listDailyMenus: listDailyMenusInput
    listDepartments: listDepartmentsInput
    listEvaluationSummaries: listEvaluationSummariesInput
    listExchangeNotices: listExchangeNoticesInput
    listExchangePlaces: listExchangePlacesInput
    listKeywords: listKeywordsInput
    listLanguages: listLanguagesInput
    listProfessorDataPortalProfiles: listProfessorDataPortalProfilesInput
    listProfessorPositions: listProfessorPositionsInput
    listProfessors: listProfessorsInput
    listProfessorsEvaluationSummaries: listProfessorsEvaluationSummariesInput
    listPrograms: listProgramsInput
    listRooms: listRoomsInput
    listSpecializations: listSpecializationsInput
    listStudyPeriods: listStudyPeriodsInput
    listUnits: listUnitsInput
}

export interface OperationOutputs {
    getCalendarEvents: getCalendarEventsOutput
    getCalendarTags: getCalendarTagsOutput
    getCatalogCourses: getCatalogCoursesOutput
    getCatalogProgram: getCatalogProgramOutput
    getCatalogs: getCatalogsOutput
    getClasses: getClassesOutput
    getClassSchedules: getClassSchedulesOutput
    getCoauthors: getCoauthorsOutput
    getCoordinators: getCoordinatorsOutput
    getCourses: getCoursesOutput
    getCurriculumSuggestions: getCurriculumSuggestionsOutput
    getDailyMenus: getDailyMenusOutput
    getDepartments: getDepartmentsOutput
    getExchangeNotices: getExchangeNoticesOutput
    getKeywords: getKeywordsOutput
    getLanguages: getLanguagesOutput
    getProfessorDataPortalProfiles: getProfessorDataPortalProfilesOutput
    getProfessorPositions: getProfessorPositionsOutput
    getProfessors: getProfessorsOutput
    getPrograms: getProgramsOutput
    getRooms: getRoomsOutput
    getSpecializations: getSpecializationsOutput
    getStudyPeriods: getStudyPeriodsOutput
    getUnits: getUnitsOutput
    listCalendar: listCalendarOutput
    listCalendarEvents: listCalendarEventsOutput
    listCalendarTags: listCalendarTagsOutput
    listCatalogCourses: listCatalogCoursesOutput
    listCatalogProgram: listCatalogProgramOutput
    listCatalogs: listCatalogsOutput
    listClasses: listClassesOutput
    listClassSchedules: listClassSchedulesOutput
    listCoauthors: listCoauthorsOutput
    listCoordinators: listCoordinatorsOutput
    listCourses: listCoursesOutput
    listCoursesEvaluationSummaries: listCoursesEvaluationSummariesOutput
    listCurriculumSuggestions: listCurriculumSuggestionsOutput
    listDailyMenus: listDailyMenusOutput
    listDepartments: listDepartmentsOutput
    listEvaluationSummaries: listEvaluationSummariesOutput
    listExchangeNotices: listExchangeNoticesOutput
    listExchangePlaces: listExchangePlacesOutput
    listKeywords: listKeywordsOutput
    listLanguages: listLanguagesOutput
    listProfessorDataPortalProfiles: listProfessorDataPortalProfilesOutput
    listProfessorPositions: listProfessorPositionsOutput
    listProfessors: listProfessorsOutput
    listProfessorsEvaluationSummaries: listProfessorsEvaluationSummariesOutput
    listPrograms: listProgramsOutput
    listRooms: listRoomsOutput
    listSpecializations: listSpecializationsOutput
    listStudyPeriods: listStudyPeriodsOutput
    listUnits: listUnitsOutput
}

export interface OperationProblems {
    getCalendarEvents: getCalendarEventsProblem
    getCalendarTags: getCalendarTagsProblem
    getCatalogCourses: getCatalogCoursesProblem
    getCatalogProgram: getCatalogProgramProblem
    getCatalogs: getCatalogsProblem
    getClasses: getClassesProblem
    getClassSchedules: getClassSchedulesProblem
    getCoauthors: getCoauthorsProblem
    getCoordinators: getCoordinatorsProblem
    getCourses: getCoursesProblem
    getCurriculumSuggestions: getCurriculumSuggestionsProblem
    getDailyMenus: getDailyMenusProblem
    getDepartments: getDepartmentsProblem
    getExchangeNotices: getExchangeNoticesProblem
    getKeywords: getKeywordsProblem
    getLanguages: getLanguagesProblem
    getProfessorDataPortalProfiles: getProfessorDataPortalProfilesProblem
    getProfessorPositions: getProfessorPositionsProblem
    getProfessors: getProfessorsProblem
    getPrograms: getProgramsProblem
    getRooms: getRoomsProblem
    getSpecializations: getSpecializationsProblem
    getStudyPeriods: getStudyPeriodsProblem
    getUnits: getUnitsProblem
    listCalendar: listCalendarProblem
    listCalendarEvents: listCalendarEventsProblem
    listCalendarTags: listCalendarTagsProblem
    listCatalogCourses: listCatalogCoursesProblem
    listCatalogProgram: listCatalogProgramProblem
    listCatalogs: listCatalogsProblem
    listClasses: listClassesProblem
    listClassSchedules: listClassSchedulesProblem
    listCoauthors: listCoauthorsProblem
    listCoordinators: listCoordinatorsProblem
    listCourses: listCoursesProblem
    listCoursesEvaluationSummaries: listCoursesEvaluationSummariesProblem
    listCurriculumSuggestions: listCurriculumSuggestionsProblem
    listDailyMenus: listDailyMenusProblem
    listDepartments: listDepartmentsProblem
    listEvaluationSummaries: listEvaluationSummariesProblem
    listExchangeNotices: listExchangeNoticesProblem
    listExchangePlaces: listExchangePlacesProblem
    listKeywords: listKeywordsProblem
    listLanguages: listLanguagesProblem
    listProfessorDataPortalProfiles: listProfessorDataPortalProfilesProblem
    listProfessorPositions: listProfessorPositionsProblem
    listProfessors: listProfessorsProblem
    listProfessorsEvaluationSummaries: listProfessorsEvaluationSummariesProblem
    listPrograms: listProgramsProblem
    listRooms: listRoomsProblem
    listSpecializations: listSpecializationsProblem
    listStudyPeriods: listStudyPeriodsProblem
    listUnits: listUnitsProblem
}

export const operationDefinitions = {
    "getCalendarEvents": {
        "operationId": "getCalendarEvents",
        "target": "data",
        "method": "GET",
        "path": "/calendar-events/{id}",
        "authentication": "public",
        "tags": [
            "calendar-events"
        ],
        "summary": "Get CalendarEvents",
        "description": null,
        "deprecated": false,
        "pathParameters": [
            "id"
        ],
        "queryParameters": [],
        "headerParameters": [],
        "cookieParameters": [],
        "requestBody": null,
        "responses": [
            {
                "status": 200,
                "success": true,
                "contents": [
                    {
                        "contentType": "application/json",
                        "schema": {
                            "$ref": "#/components/schemas/CalendarEvent"
                        }
                    }
                ],
                "problemTypes": []
            },
            {
                "status": 400,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InvalidRequestProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:invalid-request"
                ]
            },
            {
                "status": 404,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/ResourceNotFoundProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:resource-not-found"
                ]
            },
            {
                "status": 500,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InternalServerErrorProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:internal-server-error"
                ]
            }
        ],
        "query": {
            "parameters": [],
            "filter": null
        },
        "sdk": {
            "resource": "calendarEvents",
            "action": "get",
            "pathParameters": {
                "id": "calendarEventId"
            }
        },
        "pagination": null
    },
    "getCalendarTags": {
        "operationId": "getCalendarTags",
        "target": "data",
        "method": "GET",
        "path": "/calendar-tags/{id}",
        "authentication": "public",
        "tags": [
            "calendar-tags"
        ],
        "summary": "Get CalendarTags",
        "description": null,
        "deprecated": false,
        "pathParameters": [
            "id"
        ],
        "queryParameters": [],
        "headerParameters": [],
        "cookieParameters": [],
        "requestBody": null,
        "responses": [
            {
                "status": 200,
                "success": true,
                "contents": [
                    {
                        "contentType": "application/json",
                        "schema": {
                            "$ref": "#/components/schemas/CalendarTag"
                        }
                    }
                ],
                "problemTypes": []
            },
            {
                "status": 400,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InvalidRequestProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:invalid-request"
                ]
            },
            {
                "status": 404,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/ResourceNotFoundProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:resource-not-found"
                ]
            },
            {
                "status": 500,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InternalServerErrorProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:internal-server-error"
                ]
            }
        ],
        "query": {
            "parameters": [],
            "filter": null
        },
        "sdk": {
            "resource": "calendarTags",
            "action": "get",
            "pathParameters": {
                "id": "calendarTagId"
            }
        },
        "pagination": null
    },
    "getCatalogCourses": {
        "operationId": "getCatalogCourses",
        "target": "data",
        "method": "GET",
        "path": "/catalog-courses/{id}",
        "authentication": "public",
        "tags": [
            "catalog-courses"
        ],
        "summary": "Get CatalogCourses",
        "description": null,
        "deprecated": false,
        "pathParameters": [
            "id"
        ],
        "queryParameters": [],
        "headerParameters": [],
        "cookieParameters": [],
        "requestBody": null,
        "responses": [
            {
                "status": 200,
                "success": true,
                "contents": [
                    {
                        "contentType": "application/json",
                        "schema": {
                            "$ref": "#/components/schemas/CatalogCourseEntity"
                        }
                    }
                ],
                "problemTypes": []
            },
            {
                "status": 400,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InvalidRequestProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:invalid-request"
                ]
            },
            {
                "status": 404,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/ResourceNotFoundProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:resource-not-found"
                ]
            },
            {
                "status": 500,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InternalServerErrorProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:internal-server-error"
                ]
            }
        ],
        "query": {
            "parameters": [],
            "filter": null
        },
        "sdk": {
            "resource": "catalogCourses",
            "action": "get",
            "pathParameters": {
                "id": "catalogCourseId"
            }
        },
        "pagination": null
    },
    "getCatalogProgram": {
        "operationId": "getCatalogProgram",
        "target": "data",
        "method": "GET",
        "path": "/catalog-program/{id}",
        "authentication": "public",
        "tags": [
            "catalog-program"
        ],
        "summary": "Get CatalogProgram",
        "description": null,
        "deprecated": false,
        "pathParameters": [
            "id"
        ],
        "queryParameters": [],
        "headerParameters": [],
        "cookieParameters": [],
        "requestBody": null,
        "responses": [
            {
                "status": 200,
                "success": true,
                "contents": [
                    {
                        "contentType": "application/json",
                        "schema": {
                            "$ref": "#/components/schemas/CatalogProgramEntity"
                        }
                    }
                ],
                "problemTypes": []
            },
            {
                "status": 400,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InvalidRequestProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:invalid-request"
                ]
            },
            {
                "status": 404,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/ResourceNotFoundProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:resource-not-found"
                ]
            },
            {
                "status": 500,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InternalServerErrorProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:internal-server-error"
                ]
            }
        ],
        "query": {
            "parameters": [],
            "filter": null
        },
        "sdk": {
            "resource": "catalogProgram",
            "action": "get",
            "pathParameters": {
                "id": "catalogProgramId"
            }
        },
        "pagination": null
    },
    "getCatalogs": {
        "operationId": "getCatalogs",
        "target": "data",
        "method": "GET",
        "path": "/catalogs/{id}",
        "authentication": "public",
        "tags": [
            "catalogs"
        ],
        "summary": "Get Catalogs",
        "description": null,
        "deprecated": false,
        "pathParameters": [
            "id"
        ],
        "queryParameters": [],
        "headerParameters": [],
        "cookieParameters": [],
        "requestBody": null,
        "responses": [
            {
                "status": 200,
                "success": true,
                "contents": [
                    {
                        "contentType": "application/json",
                        "schema": {
                            "$ref": "#/components/schemas/Catalog"
                        }
                    }
                ],
                "problemTypes": []
            },
            {
                "status": 400,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InvalidRequestProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:invalid-request"
                ]
            },
            {
                "status": 404,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/ResourceNotFoundProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:resource-not-found"
                ]
            },
            {
                "status": 500,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InternalServerErrorProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:internal-server-error"
                ]
            }
        ],
        "query": {
            "parameters": [],
            "filter": null
        },
        "sdk": {
            "resource": "catalogs",
            "action": "get",
            "pathParameters": {
                "id": "catalogId"
            }
        },
        "pagination": null
    },
    "getClasses": {
        "operationId": "getClasses",
        "target": "data",
        "method": "GET",
        "path": "/classes/{id}",
        "authentication": "public",
        "tags": [
            "classes"
        ],
        "summary": "Get Classes",
        "description": null,
        "deprecated": false,
        "pathParameters": [
            "id"
        ],
        "queryParameters": [],
        "headerParameters": [],
        "cookieParameters": [],
        "requestBody": null,
        "responses": [
            {
                "status": 200,
                "success": true,
                "contents": [
                    {
                        "contentType": "application/json",
                        "schema": {
                            "$ref": "#/components/schemas/ClassEntity"
                        }
                    }
                ],
                "problemTypes": []
            },
            {
                "status": 400,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InvalidRequestProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:invalid-request"
                ]
            },
            {
                "status": 404,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/ResourceNotFoundProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:resource-not-found"
                ]
            },
            {
                "status": 500,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InternalServerErrorProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:internal-server-error"
                ]
            }
        ],
        "query": {
            "parameters": [],
            "filter": null
        },
        "sdk": {
            "resource": "classes",
            "action": "get",
            "pathParameters": {
                "id": "classeId"
            }
        },
        "pagination": null
    },
    "getClassSchedules": {
        "operationId": "getClassSchedules",
        "target": "data",
        "method": "GET",
        "path": "/class-schedules/{id}",
        "authentication": "public",
        "tags": [
            "class-schedules"
        ],
        "summary": "Get ClassSchedules",
        "description": null,
        "deprecated": false,
        "pathParameters": [
            "id"
        ],
        "queryParameters": [],
        "headerParameters": [],
        "cookieParameters": [],
        "requestBody": null,
        "responses": [
            {
                "status": 200,
                "success": true,
                "contents": [
                    {
                        "contentType": "application/json",
                        "schema": {
                            "$ref": "#/components/schemas/ClassScheduleEntity"
                        }
                    }
                ],
                "problemTypes": []
            },
            {
                "status": 400,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InvalidRequestProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:invalid-request"
                ]
            },
            {
                "status": 404,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/ResourceNotFoundProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:resource-not-found"
                ]
            },
            {
                "status": 500,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InternalServerErrorProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:internal-server-error"
                ]
            }
        ],
        "query": {
            "parameters": [],
            "filter": null
        },
        "sdk": {
            "resource": "classSchedules",
            "action": "get",
            "pathParameters": {
                "id": "classScheduleId"
            }
        },
        "pagination": null
    },
    "getCoauthors": {
        "operationId": "getCoauthors",
        "target": "data",
        "method": "GET",
        "path": "/coauthors/{id}",
        "authentication": "public",
        "tags": [
            "coauthors"
        ],
        "summary": "Get Coauthors",
        "description": null,
        "deprecated": false,
        "pathParameters": [
            "id"
        ],
        "queryParameters": [],
        "headerParameters": [],
        "cookieParameters": [],
        "requestBody": null,
        "responses": [
            {
                "status": 200,
                "success": true,
                "contents": [
                    {
                        "contentType": "application/json",
                        "schema": {
                            "$ref": "#/components/schemas/Coauthor"
                        }
                    }
                ],
                "problemTypes": []
            },
            {
                "status": 400,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InvalidRequestProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:invalid-request"
                ]
            },
            {
                "status": 404,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/ResourceNotFoundProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:resource-not-found"
                ]
            },
            {
                "status": 500,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InternalServerErrorProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:internal-server-error"
                ]
            }
        ],
        "query": {
            "parameters": [],
            "filter": null
        },
        "sdk": {
            "resource": "coauthors",
            "action": "get",
            "pathParameters": {
                "id": "coauthorId"
            }
        },
        "pagination": null
    },
    "getCoordinators": {
        "operationId": "getCoordinators",
        "target": "data",
        "method": "GET",
        "path": "/coordinators/{id}",
        "authentication": "public",
        "tags": [
            "coordinators"
        ],
        "summary": "Get Coordinators",
        "description": null,
        "deprecated": false,
        "pathParameters": [
            "id"
        ],
        "queryParameters": [],
        "headerParameters": [],
        "cookieParameters": [],
        "requestBody": null,
        "responses": [
            {
                "status": 200,
                "success": true,
                "contents": [
                    {
                        "contentType": "application/json",
                        "schema": {
                            "$ref": "#/components/schemas/CoordinatorEntity"
                        }
                    }
                ],
                "problemTypes": []
            },
            {
                "status": 400,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InvalidRequestProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:invalid-request"
                ]
            },
            {
                "status": 404,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/ResourceNotFoundProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:resource-not-found"
                ]
            },
            {
                "status": 500,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InternalServerErrorProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:internal-server-error"
                ]
            }
        ],
        "query": {
            "parameters": [],
            "filter": null
        },
        "sdk": {
            "resource": "coordinators",
            "action": "get",
            "pathParameters": {
                "id": "coordinatorId"
            }
        },
        "pagination": null
    },
    "getCourses": {
        "operationId": "getCourses",
        "target": "data",
        "method": "GET",
        "path": "/courses/{id}",
        "authentication": "public",
        "tags": [
            "courses"
        ],
        "summary": "Get Courses",
        "description": null,
        "deprecated": false,
        "pathParameters": [
            "id"
        ],
        "queryParameters": [],
        "headerParameters": [],
        "cookieParameters": [],
        "requestBody": null,
        "responses": [
            {
                "status": 200,
                "success": true,
                "contents": [
                    {
                        "contentType": "application/json",
                        "schema": {
                            "$ref": "#/components/schemas/CourseEntity"
                        }
                    }
                ],
                "problemTypes": []
            },
            {
                "status": 400,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InvalidRequestProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:invalid-request"
                ]
            },
            {
                "status": 404,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/ResourceNotFoundProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:resource-not-found"
                ]
            },
            {
                "status": 500,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InternalServerErrorProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:internal-server-error"
                ]
            }
        ],
        "query": {
            "parameters": [],
            "filter": null
        },
        "sdk": {
            "resource": "courses",
            "action": "get",
            "pathParameters": {
                "id": "courseId"
            }
        },
        "pagination": null
    },
    "getCurriculumSuggestions": {
        "operationId": "getCurriculumSuggestions",
        "target": "data",
        "method": "GET",
        "path": "/curriculum-suggestions/{id}",
        "authentication": "public",
        "tags": [
            "curriculum-suggestions"
        ],
        "summary": "Get CurriculumSuggestions",
        "description": null,
        "deprecated": false,
        "pathParameters": [
            "id"
        ],
        "queryParameters": [],
        "headerParameters": [],
        "cookieParameters": [],
        "requestBody": null,
        "responses": [
            {
                "status": 200,
                "success": true,
                "contents": [
                    {
                        "contentType": "application/json",
                        "schema": {
                            "$ref": "#/components/schemas/CurriculumSuggestionEntity"
                        }
                    }
                ],
                "problemTypes": []
            },
            {
                "status": 400,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InvalidRequestProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:invalid-request"
                ]
            },
            {
                "status": 404,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/ResourceNotFoundProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:resource-not-found"
                ]
            },
            {
                "status": 500,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InternalServerErrorProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:internal-server-error"
                ]
            }
        ],
        "query": {
            "parameters": [],
            "filter": null
        },
        "sdk": {
            "resource": "curriculumSuggestions",
            "action": "get",
            "pathParameters": {
                "id": "curriculumSuggestionId"
            }
        },
        "pagination": null
    },
    "getDailyMenus": {
        "operationId": "getDailyMenus",
        "target": "data",
        "method": "GET",
        "path": "/daily-menus/{id}",
        "authentication": "public",
        "tags": [
            "daily-menus"
        ],
        "summary": "Get DailyMenus",
        "description": null,
        "deprecated": false,
        "pathParameters": [
            "id"
        ],
        "queryParameters": [],
        "headerParameters": [],
        "cookieParameters": [],
        "requestBody": null,
        "responses": [
            {
                "status": 200,
                "success": true,
                "contents": [
                    {
                        "contentType": "application/json",
                        "schema": {
                            "$ref": "#/components/schemas/DailyMenu"
                        }
                    }
                ],
                "problemTypes": []
            },
            {
                "status": 400,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InvalidRequestProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:invalid-request"
                ]
            },
            {
                "status": 404,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/ResourceNotFoundProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:resource-not-found"
                ]
            },
            {
                "status": 500,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InternalServerErrorProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:internal-server-error"
                ]
            }
        ],
        "query": {
            "parameters": [],
            "filter": null
        },
        "sdk": {
            "resource": "dailyMenus",
            "action": "get",
            "pathParameters": {
                "id": "dailyMenuId"
            }
        },
        "pagination": null
    },
    "getDepartments": {
        "operationId": "getDepartments",
        "target": "data",
        "method": "GET",
        "path": "/departments/{id}",
        "authentication": "public",
        "tags": [
            "departments"
        ],
        "summary": "Get Departments",
        "description": null,
        "deprecated": false,
        "pathParameters": [
            "id"
        ],
        "queryParameters": [],
        "headerParameters": [],
        "cookieParameters": [],
        "requestBody": null,
        "responses": [
            {
                "status": 200,
                "success": true,
                "contents": [
                    {
                        "contentType": "application/json",
                        "schema": {
                            "$ref": "#/components/schemas/Department"
                        }
                    }
                ],
                "problemTypes": []
            },
            {
                "status": 400,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InvalidRequestProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:invalid-request"
                ]
            },
            {
                "status": 404,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/ResourceNotFoundProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:resource-not-found"
                ]
            },
            {
                "status": 500,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InternalServerErrorProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:internal-server-error"
                ]
            }
        ],
        "query": {
            "parameters": [],
            "filter": null
        },
        "sdk": {
            "resource": "departments",
            "action": "get",
            "pathParameters": {
                "id": "departmentId"
            }
        },
        "pagination": null
    },
    "getExchangeNotices": {
        "operationId": "getExchangeNotices",
        "target": "data",
        "method": "GET",
        "path": "/exchange-notices/{id}",
        "authentication": "public",
        "tags": [
            "exchange-notices"
        ],
        "summary": "Get ExchangeNotices",
        "description": null,
        "deprecated": false,
        "pathParameters": [
            "id"
        ],
        "queryParameters": [],
        "headerParameters": [],
        "cookieParameters": [],
        "requestBody": null,
        "responses": [
            {
                "status": 200,
                "success": true,
                "contents": [
                    {
                        "contentType": "application/json",
                        "schema": {
                            "$ref": "#/components/schemas/ExchangeNotice"
                        }
                    }
                ],
                "problemTypes": []
            },
            {
                "status": 400,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InvalidRequestProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:invalid-request"
                ]
            },
            {
                "status": 404,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/ResourceNotFoundProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:resource-not-found"
                ]
            },
            {
                "status": 500,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InternalServerErrorProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:internal-server-error"
                ]
            }
        ],
        "query": {
            "parameters": [],
            "filter": null
        },
        "sdk": {
            "resource": "exchangeNotices",
            "action": "get",
            "pathParameters": {
                "id": "exchangeNoticeId"
            }
        },
        "pagination": null
    },
    "getKeywords": {
        "operationId": "getKeywords",
        "target": "data",
        "method": "GET",
        "path": "/keywords/{id}",
        "authentication": "public",
        "tags": [
            "keywords"
        ],
        "summary": "Get Keywords",
        "description": null,
        "deprecated": false,
        "pathParameters": [
            "id"
        ],
        "queryParameters": [],
        "headerParameters": [],
        "cookieParameters": [],
        "requestBody": null,
        "responses": [
            {
                "status": 200,
                "success": true,
                "contents": [
                    {
                        "contentType": "application/json",
                        "schema": {
                            "$ref": "#/components/schemas/Keyword"
                        }
                    }
                ],
                "problemTypes": []
            },
            {
                "status": 400,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InvalidRequestProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:invalid-request"
                ]
            },
            {
                "status": 404,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/ResourceNotFoundProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:resource-not-found"
                ]
            },
            {
                "status": 500,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InternalServerErrorProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:internal-server-error"
                ]
            }
        ],
        "query": {
            "parameters": [],
            "filter": null
        },
        "sdk": {
            "resource": "keywords",
            "action": "get",
            "pathParameters": {
                "id": "keywordId"
            }
        },
        "pagination": null
    },
    "getLanguages": {
        "operationId": "getLanguages",
        "target": "data",
        "method": "GET",
        "path": "/languages/{id}",
        "authentication": "public",
        "tags": [
            "languages"
        ],
        "summary": "Get Languages",
        "description": null,
        "deprecated": false,
        "pathParameters": [
            "id"
        ],
        "queryParameters": [],
        "headerParameters": [],
        "cookieParameters": [],
        "requestBody": null,
        "responses": [
            {
                "status": 200,
                "success": true,
                "contents": [
                    {
                        "contentType": "application/json",
                        "schema": {
                            "$ref": "#/components/schemas/Language"
                        }
                    }
                ],
                "problemTypes": []
            },
            {
                "status": 400,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InvalidRequestProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:invalid-request"
                ]
            },
            {
                "status": 404,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/ResourceNotFoundProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:resource-not-found"
                ]
            },
            {
                "status": 500,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InternalServerErrorProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:internal-server-error"
                ]
            }
        ],
        "query": {
            "parameters": [],
            "filter": null
        },
        "sdk": {
            "resource": "languages",
            "action": "get",
            "pathParameters": {
                "id": "languageId"
            }
        },
        "pagination": null
    },
    "getProfessorDataPortalProfiles": {
        "operationId": "getProfessorDataPortalProfiles",
        "target": "data",
        "method": "GET",
        "path": "/professor-data-portal-profiles/{id}",
        "authentication": "public",
        "tags": [
            "professor-data-portal"
        ],
        "summary": "Get ProfessorDataPortalProfiles",
        "description": null,
        "deprecated": false,
        "pathParameters": [
            "id"
        ],
        "queryParameters": [],
        "headerParameters": [],
        "cookieParameters": [],
        "requestBody": null,
        "responses": [
            {
                "status": 200,
                "success": true,
                "contents": [
                    {
                        "contentType": "application/json",
                        "schema": {
                            "$ref": "#/components/schemas/ProfessorDataPortalProfile"
                        }
                    }
                ],
                "problemTypes": []
            },
            {
                "status": 400,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InvalidRequestProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:invalid-request"
                ]
            },
            {
                "status": 404,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/ResourceNotFoundProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:resource-not-found"
                ]
            },
            {
                "status": 500,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InternalServerErrorProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:internal-server-error"
                ]
            }
        ],
        "query": {
            "parameters": [],
            "filter": null
        },
        "sdk": {
            "resource": "professorDataPortalProfiles",
            "action": "get",
            "pathParameters": {
                "id": "professorDataPortalProfileId"
            }
        },
        "pagination": null
    },
    "getProfessorPositions": {
        "operationId": "getProfessorPositions",
        "target": "data",
        "method": "GET",
        "path": "/professor-positions/{id}",
        "authentication": "public",
        "tags": [
            "professor-positions"
        ],
        "summary": "Get ProfessorPositions",
        "description": null,
        "deprecated": false,
        "pathParameters": [
            "id"
        ],
        "queryParameters": [],
        "headerParameters": [],
        "cookieParameters": [],
        "requestBody": null,
        "responses": [
            {
                "status": 200,
                "success": true,
                "contents": [
                    {
                        "contentType": "application/json",
                        "schema": {
                            "$ref": "#/components/schemas/ProfessorPosition"
                        }
                    }
                ],
                "problemTypes": []
            },
            {
                "status": 400,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InvalidRequestProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:invalid-request"
                ]
            },
            {
                "status": 404,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/ResourceNotFoundProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:resource-not-found"
                ]
            },
            {
                "status": 500,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InternalServerErrorProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:internal-server-error"
                ]
            }
        ],
        "query": {
            "parameters": [],
            "filter": null
        },
        "sdk": {
            "resource": "professorPositions",
            "action": "get",
            "pathParameters": {
                "id": "professorPositionId"
            }
        },
        "pagination": null
    },
    "getProfessors": {
        "operationId": "getProfessors",
        "target": "data",
        "method": "GET",
        "path": "/professors/{id}",
        "authentication": "public",
        "tags": [
            "professors"
        ],
        "summary": "Get Professors",
        "description": null,
        "deprecated": false,
        "pathParameters": [
            "id"
        ],
        "queryParameters": [],
        "headerParameters": [],
        "cookieParameters": [],
        "requestBody": null,
        "responses": [
            {
                "status": 200,
                "success": true,
                "contents": [
                    {
                        "contentType": "application/json",
                        "schema": {
                            "$ref": "#/components/schemas/ProfessorEntity"
                        }
                    }
                ],
                "problemTypes": []
            },
            {
                "status": 400,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InvalidRequestProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:invalid-request"
                ]
            },
            {
                "status": 404,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/ResourceNotFoundProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:resource-not-found"
                ]
            },
            {
                "status": 500,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InternalServerErrorProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:internal-server-error"
                ]
            }
        ],
        "query": {
            "parameters": [],
            "filter": null
        },
        "sdk": {
            "resource": "professors",
            "action": "get",
            "pathParameters": {
                "id": "professorId"
            }
        },
        "pagination": null
    },
    "getPrograms": {
        "operationId": "getPrograms",
        "target": "data",
        "method": "GET",
        "path": "/programs/{id}",
        "authentication": "public",
        "tags": [
            "programs"
        ],
        "summary": "Get Programs",
        "description": null,
        "deprecated": false,
        "pathParameters": [
            "id"
        ],
        "queryParameters": [],
        "headerParameters": [],
        "cookieParameters": [],
        "requestBody": null,
        "responses": [
            {
                "status": 200,
                "success": true,
                "contents": [
                    {
                        "contentType": "application/json",
                        "schema": {
                            "$ref": "#/components/schemas/Program"
                        }
                    }
                ],
                "problemTypes": []
            },
            {
                "status": 400,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InvalidRequestProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:invalid-request"
                ]
            },
            {
                "status": 404,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/ResourceNotFoundProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:resource-not-found"
                ]
            },
            {
                "status": 500,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InternalServerErrorProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:internal-server-error"
                ]
            }
        ],
        "query": {
            "parameters": [],
            "filter": null
        },
        "sdk": {
            "resource": "programs",
            "action": "get",
            "pathParameters": {
                "id": "programId"
            }
        },
        "pagination": null
    },
    "getRooms": {
        "operationId": "getRooms",
        "target": "data",
        "method": "GET",
        "path": "/rooms/{id}",
        "authentication": "public",
        "tags": [
            "rooms"
        ],
        "summary": "Get Rooms",
        "description": null,
        "deprecated": false,
        "pathParameters": [
            "id"
        ],
        "queryParameters": [],
        "headerParameters": [],
        "cookieParameters": [],
        "requestBody": null,
        "responses": [
            {
                "status": 200,
                "success": true,
                "contents": [
                    {
                        "contentType": "application/json",
                        "schema": {
                            "$ref": "#/components/schemas/RoomEntity"
                        }
                    }
                ],
                "problemTypes": []
            },
            {
                "status": 400,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InvalidRequestProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:invalid-request"
                ]
            },
            {
                "status": 404,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/ResourceNotFoundProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:resource-not-found"
                ]
            },
            {
                "status": 500,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InternalServerErrorProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:internal-server-error"
                ]
            }
        ],
        "query": {
            "parameters": [],
            "filter": null
        },
        "sdk": {
            "resource": "rooms",
            "action": "get",
            "pathParameters": {
                "id": "roomId"
            }
        },
        "pagination": null
    },
    "getSpecializations": {
        "operationId": "getSpecializations",
        "target": "data",
        "method": "GET",
        "path": "/specializations/{id}",
        "authentication": "public",
        "tags": [
            "specializations"
        ],
        "summary": "Get Specializations",
        "description": null,
        "deprecated": false,
        "pathParameters": [
            "id"
        ],
        "queryParameters": [],
        "headerParameters": [],
        "cookieParameters": [],
        "requestBody": null,
        "responses": [
            {
                "status": 200,
                "success": true,
                "contents": [
                    {
                        "contentType": "application/json",
                        "schema": {
                            "$ref": "#/components/schemas/Specialization"
                        }
                    }
                ],
                "problemTypes": []
            },
            {
                "status": 400,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InvalidRequestProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:invalid-request"
                ]
            },
            {
                "status": 404,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/ResourceNotFoundProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:resource-not-found"
                ]
            },
            {
                "status": 500,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InternalServerErrorProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:internal-server-error"
                ]
            }
        ],
        "query": {
            "parameters": [],
            "filter": null
        },
        "sdk": {
            "resource": "specializations",
            "action": "get",
            "pathParameters": {
                "id": "specializationId"
            }
        },
        "pagination": null
    },
    "getStudyPeriods": {
        "operationId": "getStudyPeriods",
        "target": "data",
        "method": "GET",
        "path": "/study-periods/{id}",
        "authentication": "public",
        "tags": [
            "study-periods"
        ],
        "summary": "Get StudyPeriods",
        "description": null,
        "deprecated": false,
        "pathParameters": [
            "id"
        ],
        "queryParameters": [],
        "headerParameters": [],
        "cookieParameters": [],
        "requestBody": null,
        "responses": [
            {
                "status": 200,
                "success": true,
                "contents": [
                    {
                        "contentType": "application/json",
                        "schema": {
                            "$ref": "#/components/schemas/StudyPeriodEntity"
                        }
                    }
                ],
                "problemTypes": []
            },
            {
                "status": 400,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InvalidRequestProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:invalid-request"
                ]
            },
            {
                "status": 404,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/ResourceNotFoundProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:resource-not-found"
                ]
            },
            {
                "status": 500,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InternalServerErrorProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:internal-server-error"
                ]
            }
        ],
        "query": {
            "parameters": [],
            "filter": null
        },
        "sdk": {
            "resource": "studyPeriods",
            "action": "get",
            "pathParameters": {
                "id": "studyPeriodId"
            }
        },
        "pagination": null
    },
    "getUnits": {
        "operationId": "getUnits",
        "target": "data",
        "method": "GET",
        "path": "/units/{id}",
        "authentication": "public",
        "tags": [
            "units"
        ],
        "summary": "Get Units",
        "description": null,
        "deprecated": false,
        "pathParameters": [
            "id"
        ],
        "queryParameters": [],
        "headerParameters": [],
        "cookieParameters": [],
        "requestBody": null,
        "responses": [
            {
                "status": 200,
                "success": true,
                "contents": [
                    {
                        "contentType": "application/json",
                        "schema": {
                            "$ref": "#/components/schemas/UnitEntity"
                        }
                    }
                ],
                "problemTypes": []
            },
            {
                "status": 400,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InvalidRequestProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:invalid-request"
                ]
            },
            {
                "status": 404,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/ResourceNotFoundProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:resource-not-found"
                ]
            },
            {
                "status": 500,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InternalServerErrorProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:internal-server-error"
                ]
            }
        ],
        "query": {
            "parameters": [],
            "filter": null
        },
        "sdk": {
            "resource": "units",
            "action": "get",
            "pathParameters": {
                "id": "unitId"
            }
        },
        "pagination": null
    },
    "listCalendar": {
        "operationId": "listCalendar",
        "target": "data",
        "method": "GET",
        "path": "/calendar",
        "authentication": "public",
        "tags": [
            "calendar"
        ],
        "summary": "listCalendar",
        "description": null,
        "deprecated": false,
        "pathParameters": [],
        "queryParameters": [],
        "headerParameters": [],
        "cookieParameters": [],
        "requestBody": null,
        "responses": [
            {
                "status": 200,
                "success": true,
                "contents": [
                    {
                        "contentType": "text/calendar",
                        "schema": {
                            "type": "string"
                        }
                    }
                ],
                "problemTypes": []
            },
            {
                "status": 400,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InvalidRequestProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:invalid-request"
                ]
            },
            {
                "status": 500,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InternalServerErrorProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:internal-server-error"
                ]
            }
        ],
        "query": {
            "parameters": [],
            "filter": null
        },
        "sdk": {
            "resource": "calendar",
            "action": "list"
        },
        "pagination": null
    },
    "listCalendarEvents": {
        "operationId": "listCalendarEvents",
        "target": "data",
        "method": "GET",
        "path": "/calendar-events",
        "authentication": "public",
        "tags": [
            "calendar-events"
        ],
        "summary": "List CalendarEvents",
        "description": null,
        "deprecated": false,
        "pathParameters": [],
        "queryParameters": [
            "filter"
        ],
        "headerParameters": [],
        "cookieParameters": [],
        "requestBody": null,
        "responses": [
            {
                "status": 200,
                "success": true,
                "contents": [
                    {
                        "contentType": "application/json",
                        "schema": {
                            "type": "array",
                            "items": {
                                "$ref": "#/components/schemas/CalendarEvent"
                            }
                        }
                    }
                ],
                "problemTypes": []
            },
            {
                "status": 400,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InvalidRequestProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:invalid-request"
                ]
            },
            {
                "status": 500,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InternalServerErrorProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:internal-server-error"
                ]
            }
        ],
        "query": {
            "parameters": [
                {
                    "name": "filter",
                    "required": false,
                    "description": "Structured calendar event filters. Use bracket notation such as filter[tagId]=1.",
                    "style": "deepObject",
                    "explode": true,
                    "schema": {
                        "additionalProperties": false,
                        "properties": {
                            "startDate": {
                                "oneOf": [
                                    {
                                        "format": "date-time",
                                        "type": "string"
                                    },
                                    {
                                        "additionalProperties": false,
                                        "properties": {
                                            "eq": {
                                                "format": "date-time",
                                                "type": "string"
                                            },
                                            "in": {
                                                "items": {
                                                    "format": "date-time",
                                                    "type": "string"
                                                },
                                                "type": "array"
                                            }
                                        },
                                        "type": "object"
                                    }
                                ]
                            },
                            "endDate": {
                                "oneOf": [
                                    {
                                        "format": "date-time",
                                        "type": "string"
                                    },
                                    {
                                        "additionalProperties": false,
                                        "properties": {
                                            "eq": {
                                                "format": "date-time",
                                                "type": "string"
                                            },
                                            "in": {
                                                "items": {
                                                    "format": "date-time",
                                                    "type": "string"
                                                },
                                                "type": "array"
                                            }
                                        },
                                        "type": "object"
                                    }
                                ]
                            },
                            "tagId": {
                                "oneOf": [
                                    {
                                        "type": "integer"
                                    },
                                    {
                                        "additionalProperties": false,
                                        "properties": {
                                            "eq": {
                                                "type": "integer"
                                            },
                                            "in": {
                                                "items": {
                                                    "type": "integer"
                                                },
                                                "type": "array"
                                            }
                                        },
                                        "type": "object"
                                    }
                                ]
                            }
                        },
                        "type": "object"
                    }
                }
            ],
            "filter": {
                "version": 1,
                "fields": [
                    {
                        "path": [
                            "startDate"
                        ],
                        "schema": {
                            "format": "date-time",
                            "type": "string"
                        },
                        "operators": [
                            "eq",
                            "in"
                        ]
                    },
                    {
                        "path": [
                            "endDate"
                        ],
                        "schema": {
                            "format": "date-time",
                            "type": "string"
                        },
                        "operators": [
                            "eq",
                            "in"
                        ]
                    },
                    {
                        "path": [
                            "tagId"
                        ],
                        "schema": {
                            "type": "integer"
                        },
                        "operators": [
                            "eq",
                            "in"
                        ]
                    }
                ],
                "constraints": {
                    "maxExpressions": 20,
                    "maxDepth": 3,
                    "maxParameters": 100
                }
            }
        },
        "sdk": {
            "resource": "calendarEvents",
            "action": "list",
            "pathParameters": {}
        },
        "pagination": null
    },
    "listCalendarTags": {
        "operationId": "listCalendarTags",
        "target": "data",
        "method": "GET",
        "path": "/calendar-tags",
        "authentication": "public",
        "tags": [
            "calendar-tags"
        ],
        "summary": "List CalendarTags",
        "description": null,
        "deprecated": false,
        "pathParameters": [],
        "queryParameters": [
            "filter"
        ],
        "headerParameters": [],
        "cookieParameters": [],
        "requestBody": null,
        "responses": [
            {
                "status": 200,
                "success": true,
                "contents": [
                    {
                        "contentType": "application/json",
                        "schema": {
                            "type": "array",
                            "items": {
                                "$ref": "#/components/schemas/CalendarTag"
                            }
                        }
                    }
                ],
                "problemTypes": []
            },
            {
                "status": 400,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InvalidRequestProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:invalid-request"
                ]
            },
            {
                "status": 500,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InternalServerErrorProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:internal-server-error"
                ]
            }
        ],
        "query": {
            "parameters": [
                {
                    "name": "filter",
                    "required": false,
                    "description": "Structured calendar tag filters. Use bracket notation such as filter[name]=feriado.",
                    "style": "deepObject",
                    "explode": true,
                    "schema": {
                        "additionalProperties": false,
                        "properties": {
                            "id": {
                                "oneOf": [
                                    {
                                        "type": "integer"
                                    },
                                    {
                                        "additionalProperties": false,
                                        "properties": {
                                            "eq": {
                                                "type": "integer"
                                            },
                                            "in": {
                                                "items": {
                                                    "type": "integer"
                                                },
                                                "type": "array"
                                            }
                                        },
                                        "type": "object"
                                    }
                                ]
                            },
                            "name": {
                                "oneOf": [
                                    {
                                        "minLength": 1,
                                        "type": "string"
                                    },
                                    {
                                        "additionalProperties": false,
                                        "properties": {
                                            "eq": {
                                                "minLength": 1,
                                                "type": "string"
                                            }
                                        },
                                        "type": "object"
                                    }
                                ]
                            }
                        },
                        "type": "object"
                    }
                }
            ],
            "filter": {
                "version": 1,
                "fields": [
                    {
                        "path": [
                            "id"
                        ],
                        "schema": {
                            "type": "integer"
                        },
                        "operators": [
                            "eq",
                            "in"
                        ]
                    },
                    {
                        "path": [
                            "name"
                        ],
                        "schema": {
                            "minLength": 1,
                            "type": "string"
                        },
                        "operators": [
                            "eq"
                        ]
                    }
                ],
                "constraints": {
                    "maxExpressions": 20,
                    "maxDepth": 3,
                    "maxParameters": 100
                }
            }
        },
        "sdk": {
            "resource": "calendarTags",
            "action": "list",
            "pathParameters": {}
        },
        "pagination": null
    },
    "listCatalogCourses": {
        "operationId": "listCatalogCourses",
        "target": "data",
        "method": "GET",
        "path": "/catalog-courses",
        "authentication": "public",
        "tags": [
            "catalog-courses"
        ],
        "summary": "List CatalogCourses",
        "description": null,
        "deprecated": false,
        "pathParameters": [],
        "queryParameters": [
            "page",
            "pageSize",
            "filter"
        ],
        "headerParameters": [],
        "cookieParameters": [],
        "requestBody": null,
        "responses": [
            {
                "status": 200,
                "success": true,
                "contents": [
                    {
                        "contentType": "application/json",
                        "schema": {
                            "type": "object",
                            "properties": {
                                "data": {
                                    "type": "array",
                                    "items": {
                                        "$ref": "#/components/schemas/CatalogCourseEntity"
                                    }
                                },
                                "quantity": {
                                    "type": "integer"
                                },
                                "total": {
                                    "type": "integer"
                                },
                                "_paths": {
                                    "type": "object",
                                    "properties": {
                                        "firstPage": {
                                            "type": "string"
                                        },
                                        "lastPage": {
                                            "type": "string"
                                        },
                                        "next": {
                                            "type": "string",
                                            "nullable": true
                                        },
                                        "prev": {
                                            "type": "string",
                                            "nullable": true
                                        }
                                    },
                                    "required": [
                                        "firstPage",
                                        "lastPage",
                                        "next",
                                        "prev"
                                    ]
                                }
                            },
                            "required": [
                                "data",
                                "quantity",
                                "total",
                                "_paths"
                            ]
                        }
                    }
                ],
                "problemTypes": []
            },
            {
                "status": 400,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InvalidRequestProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:invalid-request"
                ]
            },
            {
                "status": 500,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InternalServerErrorProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:internal-server-error"
                ]
            }
        ],
        "query": {
            "parameters": [
                {
                    "name": "page",
                    "required": false,
                    "description": null,
                    "style": null,
                    "explode": null,
                    "schema": {
                        "type": "integer",
                        "minimum": 1
                    }
                },
                {
                    "name": "pageSize",
                    "required": false,
                    "description": null,
                    "style": null,
                    "explode": null,
                    "schema": {
                        "type": "integer",
                        "minimum": 1
                    }
                },
                {
                    "name": "filter",
                    "required": false,
                    "description": "Structured catalog course filters. Use bracket notation such as filter[unit][code]=IC.",
                    "style": "deepObject",
                    "explode": true,
                    "schema": {
                        "additionalProperties": false,
                        "properties": {
                            "catalogId": {
                                "oneOf": [
                                    {
                                        "type": "integer"
                                    },
                                    {
                                        "additionalProperties": false,
                                        "properties": {
                                            "eq": {
                                                "type": "integer"
                                            },
                                            "in": {
                                                "items": {
                                                    "type": "integer"
                                                },
                                                "type": "array"
                                            }
                                        },
                                        "type": "object"
                                    }
                                ]
                            },
                            "catalogYear": {
                                "oneOf": [
                                    {
                                        "type": "integer"
                                    },
                                    {
                                        "additionalProperties": false,
                                        "properties": {
                                            "eq": {
                                                "type": "integer"
                                            },
                                            "in": {
                                                "items": {
                                                    "type": "integer"
                                                },
                                                "type": "array"
                                            }
                                        },
                                        "type": "object"
                                    }
                                ]
                            },
                            "courseId": {
                                "oneOf": [
                                    {
                                        "type": "integer"
                                    },
                                    {
                                        "additionalProperties": false,
                                        "properties": {
                                            "eq": {
                                                "type": "integer"
                                            },
                                            "in": {
                                                "items": {
                                                    "type": "integer"
                                                },
                                                "type": "array"
                                            }
                                        },
                                        "type": "object"
                                    }
                                ]
                            },
                            "courseCode": {
                                "oneOf": [
                                    {
                                        "type": "string"
                                    },
                                    {
                                        "additionalProperties": false,
                                        "properties": {
                                            "eq": {
                                                "type": "string"
                                            },
                                            "ne": {
                                                "type": "string"
                                            },
                                            "in": {
                                                "items": {
                                                    "type": "string"
                                                },
                                                "type": "array"
                                            }
                                        },
                                        "type": "object"
                                    }
                                ]
                            },
                            "unit": {
                                "additionalProperties": false,
                                "properties": {
                                    "id": {
                                        "oneOf": [
                                            {
                                                "type": "integer"
                                            },
                                            {
                                                "additionalProperties": false,
                                                "properties": {
                                                    "eq": {
                                                        "type": "integer"
                                                    },
                                                    "in": {
                                                        "items": {
                                                            "type": "integer"
                                                        },
                                                        "type": "array"
                                                    }
                                                },
                                                "type": "object"
                                            }
                                        ]
                                    },
                                    "code": {
                                        "oneOf": [
                                            {
                                                "type": "string"
                                            },
                                            {
                                                "additionalProperties": false,
                                                "properties": {
                                                    "eq": {
                                                        "type": "string"
                                                    },
                                                    "in": {
                                                        "items": {
                                                            "type": "string"
                                                        },
                                                        "type": "array"
                                                    }
                                                },
                                                "type": "object"
                                            }
                                        ]
                                    }
                                },
                                "type": "object"
                            },
                            "coordinatorId": {
                                "oneOf": [
                                    {
                                        "type": "integer"
                                    },
                                    {
                                        "additionalProperties": false,
                                        "properties": {
                                            "eq": {
                                                "type": "integer"
                                            },
                                            "in": {
                                                "items": {
                                                    "type": "integer"
                                                },
                                                "type": "array"
                                            }
                                        },
                                        "type": "object"
                                    }
                                ]
                            },
                            "offeringPeriod": {
                                "oneOf": [
                                    {
                                        "enum": [
                                            "ALL_PERIODS",
                                            "ODD_PERIODS",
                                            "EVEN_PERIODS",
                                            "UNIT_DISCRETION"
                                        ],
                                        "type": "string"
                                    },
                                    {
                                        "additionalProperties": false,
                                        "properties": {
                                            "eq": {
                                                "enum": [
                                                    "ALL_PERIODS",
                                                    "ODD_PERIODS",
                                                    "EVEN_PERIODS",
                                                    "UNIT_DISCRETION"
                                                ],
                                                "type": "string"
                                            },
                                            "in": {
                                                "items": {
                                                    "enum": [
                                                        "ALL_PERIODS",
                                                        "ODD_PERIODS",
                                                        "EVEN_PERIODS",
                                                        "UNIT_DISCRETION"
                                                    ],
                                                    "type": "string"
                                                },
                                                "type": "array"
                                            }
                                        },
                                        "type": "object"
                                    }
                                ]
                            }
                        },
                        "type": "object"
                    }
                }
            ],
            "filter": {
                "version": 1,
                "fields": [
                    {
                        "path": [
                            "catalogId"
                        ],
                        "schema": {
                            "type": "integer"
                        },
                        "operators": [
                            "eq",
                            "in"
                        ]
                    },
                    {
                        "path": [
                            "catalogYear"
                        ],
                        "schema": {
                            "type": "integer"
                        },
                        "operators": [
                            "eq",
                            "in"
                        ]
                    },
                    {
                        "path": [
                            "courseId"
                        ],
                        "schema": {
                            "type": "integer"
                        },
                        "operators": [
                            "eq",
                            "in"
                        ]
                    },
                    {
                        "path": [
                            "courseCode"
                        ],
                        "schema": {
                            "type": "string"
                        },
                        "operators": [
                            "eq",
                            "ne",
                            "in"
                        ]
                    },
                    {
                        "path": [
                            "unit",
                            "id"
                        ],
                        "schema": {
                            "type": "integer"
                        },
                        "operators": [
                            "eq",
                            "in"
                        ]
                    },
                    {
                        "path": [
                            "unit",
                            "code"
                        ],
                        "schema": {
                            "type": "string"
                        },
                        "operators": [
                            "eq",
                            "in"
                        ]
                    },
                    {
                        "path": [
                            "coordinatorId"
                        ],
                        "schema": {
                            "type": "integer"
                        },
                        "operators": [
                            "eq",
                            "in"
                        ]
                    },
                    {
                        "path": [
                            "offeringPeriod"
                        ],
                        "schema": {
                            "enum": [
                                "ALL_PERIODS",
                                "ODD_PERIODS",
                                "EVEN_PERIODS",
                                "UNIT_DISCRETION"
                            ],
                            "type": "string"
                        },
                        "operators": [
                            "eq",
                            "in"
                        ]
                    }
                ],
                "constraints": {
                    "maxExpressions": 20,
                    "maxDepth": 3,
                    "maxParameters": 100
                }
            }
        },
        "sdk": {
            "resource": "catalogCourses",
            "action": "list",
            "pathParameters": {}
        },
        "pagination": {
            "itemsField": "data",
            "nextField": "_paths.next",
            "defaultPageSize": 100,
            "maxPageSize": 1000
        }
    },
    "listCatalogProgram": {
        "operationId": "listCatalogProgram",
        "target": "data",
        "method": "GET",
        "path": "/catalog-program",
        "authentication": "public",
        "tags": [
            "catalog-program"
        ],
        "summary": "List CatalogProgram",
        "description": null,
        "deprecated": false,
        "pathParameters": [],
        "queryParameters": [
            "filter"
        ],
        "headerParameters": [],
        "cookieParameters": [],
        "requestBody": null,
        "responses": [
            {
                "status": 200,
                "success": true,
                "contents": [
                    {
                        "contentType": "application/json",
                        "schema": {
                            "type": "array",
                            "items": {
                                "$ref": "#/components/schemas/CatalogProgramEntity"
                            }
                        }
                    }
                ],
                "problemTypes": []
            },
            {
                "status": 400,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InvalidRequestProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:invalid-request"
                ]
            },
            {
                "status": 500,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InternalServerErrorProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:internal-server-error"
                ]
            }
        ],
        "query": {
            "parameters": [
                {
                    "name": "filter",
                    "required": false,
                    "description": "Structured catalog program filters. Use bracket notation such as filter[catalogYear]=2025.",
                    "style": "deepObject",
                    "explode": true,
                    "schema": {
                        "additionalProperties": false,
                        "properties": {
                            "catalogId": {
                                "oneOf": [
                                    {
                                        "type": "integer"
                                    },
                                    {
                                        "additionalProperties": false,
                                        "properties": {
                                            "eq": {
                                                "type": "integer"
                                            },
                                            "in": {
                                                "items": {
                                                    "type": "integer"
                                                },
                                                "type": "array"
                                            }
                                        },
                                        "type": "object"
                                    }
                                ]
                            },
                            "catalogYear": {
                                "oneOf": [
                                    {
                                        "type": "integer"
                                    },
                                    {
                                        "additionalProperties": false,
                                        "properties": {
                                            "eq": {
                                                "type": "integer"
                                            },
                                            "in": {
                                                "items": {
                                                    "type": "integer"
                                                },
                                                "type": "array"
                                            }
                                        },
                                        "type": "object"
                                    }
                                ]
                            },
                            "programId": {
                                "oneOf": [
                                    {
                                        "type": "integer"
                                    },
                                    {
                                        "additionalProperties": false,
                                        "properties": {
                                            "eq": {
                                                "type": "integer"
                                            },
                                            "in": {
                                                "items": {
                                                    "type": "integer"
                                                },
                                                "type": "array"
                                            }
                                        },
                                        "type": "object"
                                    }
                                ]
                            },
                            "programCode": {
                                "oneOf": [
                                    {
                                        "type": "integer"
                                    },
                                    {
                                        "additionalProperties": false,
                                        "properties": {
                                            "eq": {
                                                "type": "integer"
                                            },
                                            "in": {
                                                "items": {
                                                    "type": "integer"
                                                },
                                                "type": "array"
                                            }
                                        },
                                        "type": "object"
                                    }
                                ]
                            }
                        },
                        "type": "object"
                    }
                }
            ],
            "filter": {
                "version": 1,
                "fields": [
                    {
                        "path": [
                            "catalogId"
                        ],
                        "schema": {
                            "type": "integer"
                        },
                        "operators": [
                            "eq",
                            "in"
                        ]
                    },
                    {
                        "path": [
                            "catalogYear"
                        ],
                        "schema": {
                            "type": "integer"
                        },
                        "operators": [
                            "eq",
                            "in"
                        ]
                    },
                    {
                        "path": [
                            "programId"
                        ],
                        "schema": {
                            "type": "integer"
                        },
                        "operators": [
                            "eq",
                            "in"
                        ]
                    },
                    {
                        "path": [
                            "programCode"
                        ],
                        "schema": {
                            "type": "integer"
                        },
                        "operators": [
                            "eq",
                            "in"
                        ]
                    }
                ],
                "constraints": {
                    "maxExpressions": 20,
                    "maxDepth": 3,
                    "maxParameters": 100
                }
            }
        },
        "sdk": {
            "resource": "catalogProgram",
            "action": "list",
            "pathParameters": {}
        },
        "pagination": null
    },
    "listCatalogs": {
        "operationId": "listCatalogs",
        "target": "data",
        "method": "GET",
        "path": "/catalogs",
        "authentication": "public",
        "tags": [
            "catalogs"
        ],
        "summary": "List Catalogs",
        "description": null,
        "deprecated": false,
        "pathParameters": [],
        "queryParameters": [
            "filter"
        ],
        "headerParameters": [],
        "cookieParameters": [],
        "requestBody": null,
        "responses": [
            {
                "status": 200,
                "success": true,
                "contents": [
                    {
                        "contentType": "application/json",
                        "schema": {
                            "type": "array",
                            "items": {
                                "$ref": "#/components/schemas/Catalog"
                            }
                        }
                    }
                ],
                "problemTypes": []
            },
            {
                "status": 400,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InvalidRequestProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:invalid-request"
                ]
            },
            {
                "status": 500,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InternalServerErrorProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:internal-server-error"
                ]
            }
        ],
        "query": {
            "parameters": [
                {
                    "name": "filter",
                    "required": false,
                    "description": "Structured catalog filters. Use bracket notation such as filter[year]=2025.",
                    "style": "deepObject",
                    "explode": true,
                    "schema": {
                        "additionalProperties": false,
                        "properties": {
                            "year": {
                                "oneOf": [
                                    {
                                        "type": "integer"
                                    },
                                    {
                                        "additionalProperties": false,
                                        "properties": {
                                            "eq": {
                                                "type": "integer"
                                            },
                                            "in": {
                                                "items": {
                                                    "type": "integer"
                                                },
                                                "type": "array"
                                            }
                                        },
                                        "type": "object"
                                    }
                                ]
                            }
                        },
                        "type": "object"
                    }
                }
            ],
            "filter": {
                "version": 1,
                "fields": [
                    {
                        "path": [
                            "year"
                        ],
                        "schema": {
                            "type": "integer"
                        },
                        "operators": [
                            "eq",
                            "in"
                        ]
                    }
                ],
                "constraints": {
                    "maxExpressions": 20,
                    "maxDepth": 3,
                    "maxParameters": 100
                }
            }
        },
        "sdk": {
            "resource": "catalogs",
            "action": "list",
            "pathParameters": {}
        },
        "pagination": null
    },
    "listClasses": {
        "operationId": "listClasses",
        "target": "data",
        "method": "GET",
        "path": "/classes",
        "authentication": "public",
        "tags": [
            "classes"
        ],
        "summary": "List Classes",
        "description": null,
        "deprecated": false,
        "pathParameters": [],
        "queryParameters": [
            "page",
            "pageSize",
            "filter"
        ],
        "headerParameters": [],
        "cookieParameters": [],
        "requestBody": null,
        "responses": [
            {
                "status": 200,
                "success": true,
                "contents": [
                    {
                        "contentType": "application/json",
                        "schema": {
                            "type": "object",
                            "properties": {
                                "data": {
                                    "type": "array",
                                    "items": {
                                        "$ref": "#/components/schemas/ClassEntity"
                                    }
                                },
                                "quantity": {
                                    "type": "integer"
                                },
                                "total": {
                                    "type": "integer"
                                },
                                "_paths": {
                                    "type": "object",
                                    "properties": {
                                        "firstPage": {
                                            "type": "string"
                                        },
                                        "lastPage": {
                                            "type": "string"
                                        },
                                        "next": {
                                            "type": "string",
                                            "nullable": true
                                        },
                                        "prev": {
                                            "type": "string",
                                            "nullable": true
                                        }
                                    },
                                    "required": [
                                        "firstPage",
                                        "lastPage",
                                        "next",
                                        "prev"
                                    ]
                                }
                            },
                            "required": [
                                "data",
                                "quantity",
                                "total",
                                "_paths"
                            ]
                        }
                    }
                ],
                "problemTypes": []
            },
            {
                "status": 400,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InvalidRequestProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:invalid-request"
                ]
            },
            {
                "status": 500,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InternalServerErrorProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:internal-server-error"
                ]
            }
        ],
        "query": {
            "parameters": [
                {
                    "name": "page",
                    "required": false,
                    "description": "The page number to retrieve (default: 1)",
                    "style": null,
                    "explode": null,
                    "schema": {
                        "type": "integer",
                        "minimum": 1,
                        "default": 1,
                        "description": "The page number to retrieve (default: 1)"
                    }
                },
                {
                    "name": "pageSize",
                    "required": false,
                    "description": "The number of items per page (default: 20)",
                    "style": null,
                    "explode": null,
                    "schema": {
                        "type": "integer",
                        "minimum": 1,
                        "default": 20,
                        "description": "The number of items per page (default: 20)"
                    }
                },
                {
                    "name": "filter",
                    "required": false,
                    "description": "Structured class filters. Use bracket notation such as filter[courseCode]=MC102.",
                    "style": "deepObject",
                    "explode": true,
                    "schema": {
                        "additionalProperties": false,
                        "properties": {
                            "classCode": {
                                "oneOf": [
                                    {
                                        "minLength": 1,
                                        "type": "string"
                                    },
                                    {
                                        "additionalProperties": false,
                                        "properties": {
                                            "eq": {
                                                "minLength": 1,
                                                "type": "string"
                                            }
                                        },
                                        "type": "object"
                                    }
                                ]
                            },
                            "unitId": {
                                "oneOf": [
                                    {
                                        "type": "integer"
                                    },
                                    {
                                        "additionalProperties": false,
                                        "properties": {
                                            "eq": {
                                                "type": "integer"
                                            },
                                            "in": {
                                                "items": {
                                                    "type": "integer"
                                                },
                                                "type": "array"
                                            }
                                        },
                                        "type": "object"
                                    }
                                ]
                            },
                            "unitCode": {
                                "oneOf": [
                                    {
                                        "minLength": 1,
                                        "type": "string"
                                    },
                                    {
                                        "additionalProperties": false,
                                        "properties": {
                                            "eq": {
                                                "minLength": 1,
                                                "type": "string"
                                            }
                                        },
                                        "type": "object"
                                    }
                                ]
                            },
                            "courseId": {
                                "oneOf": [
                                    {
                                        "type": "integer"
                                    },
                                    {
                                        "additionalProperties": false,
                                        "properties": {
                                            "eq": {
                                                "type": "integer"
                                            },
                                            "in": {
                                                "items": {
                                                    "type": "integer"
                                                },
                                                "type": "array"
                                            }
                                        },
                                        "type": "object"
                                    }
                                ]
                            },
                            "courseCode": {
                                "oneOf": [
                                    {
                                        "minLength": 1,
                                        "type": "string"
                                    },
                                    {
                                        "additionalProperties": false,
                                        "properties": {
                                            "eq": {
                                                "minLength": 1,
                                                "type": "string"
                                            }
                                        },
                                        "type": "object"
                                    }
                                ]
                            },
                            "studyPeriodId": {
                                "oneOf": [
                                    {
                                        "type": "integer"
                                    },
                                    {
                                        "additionalProperties": false,
                                        "properties": {
                                            "eq": {
                                                "type": "integer"
                                            },
                                            "in": {
                                                "items": {
                                                    "type": "integer"
                                                },
                                                "type": "array"
                                            }
                                        },
                                        "type": "object"
                                    }
                                ]
                            },
                            "studyPeriodYear": {
                                "oneOf": [
                                    {
                                        "type": "integer"
                                    },
                                    {
                                        "additionalProperties": false,
                                        "properties": {
                                            "eq": {
                                                "type": "integer"
                                            },
                                            "in": {
                                                "items": {
                                                    "type": "integer"
                                                },
                                                "type": "array"
                                            }
                                        },
                                        "type": "object"
                                    }
                                ]
                            },
                            "studyPeriodYearPeriod": {
                                "oneOf": [
                                    {
                                        "enum": [
                                            "SUMMER",
                                            "FIRST_SEMESTER",
                                            "WINTER",
                                            "SECOND_SEMESTER"
                                        ],
                                        "type": "string"
                                    },
                                    {
                                        "additionalProperties": false,
                                        "properties": {
                                            "eq": {
                                                "enum": [
                                                    "SUMMER",
                                                    "FIRST_SEMESTER",
                                                    "WINTER",
                                                    "SECOND_SEMESTER"
                                                ],
                                                "type": "string"
                                            },
                                            "in": {
                                                "items": {
                                                    "enum": [
                                                        "SUMMER",
                                                        "FIRST_SEMESTER",
                                                        "WINTER",
                                                        "SECOND_SEMESTER"
                                                    ],
                                                    "type": "string"
                                                },
                                                "type": "array"
                                            }
                                        },
                                        "type": "object"
                                    }
                                ]
                            },
                            "professorId": {
                                "oneOf": [
                                    {
                                        "type": "integer"
                                    },
                                    {
                                        "additionalProperties": false,
                                        "properties": {
                                            "eq": {
                                                "type": "integer"
                                            },
                                            "in": {
                                                "items": {
                                                    "type": "integer"
                                                },
                                                "type": "array"
                                            }
                                        },
                                        "type": "object"
                                    }
                                ]
                            },
                            "professorName": {
                                "oneOf": [
                                    {
                                        "minLength": 1,
                                        "type": "string"
                                    },
                                    {
                                        "additionalProperties": false,
                                        "properties": {
                                            "eq": {
                                                "minLength": 1,
                                                "type": "string"
                                            }
                                        },
                                        "type": "object"
                                    }
                                ]
                            }
                        },
                        "type": "object"
                    }
                }
            ],
            "filter": {
                "version": 1,
                "fields": [
                    {
                        "path": [
                            "classCode"
                        ],
                        "schema": {
                            "minLength": 1,
                            "type": "string"
                        },
                        "operators": [
                            "eq"
                        ]
                    },
                    {
                        "path": [
                            "unitId"
                        ],
                        "schema": {
                            "type": "integer"
                        },
                        "operators": [
                            "eq",
                            "in"
                        ]
                    },
                    {
                        "path": [
                            "unitCode"
                        ],
                        "schema": {
                            "minLength": 1,
                            "type": "string"
                        },
                        "operators": [
                            "eq"
                        ]
                    },
                    {
                        "path": [
                            "courseId"
                        ],
                        "schema": {
                            "type": "integer"
                        },
                        "operators": [
                            "eq",
                            "in"
                        ]
                    },
                    {
                        "path": [
                            "courseCode"
                        ],
                        "schema": {
                            "minLength": 1,
                            "type": "string"
                        },
                        "operators": [
                            "eq"
                        ]
                    },
                    {
                        "path": [
                            "studyPeriodId"
                        ],
                        "schema": {
                            "type": "integer"
                        },
                        "operators": [
                            "eq",
                            "in"
                        ]
                    },
                    {
                        "path": [
                            "studyPeriodYear"
                        ],
                        "schema": {
                            "type": "integer"
                        },
                        "operators": [
                            "eq",
                            "in"
                        ]
                    },
                    {
                        "path": [
                            "studyPeriodYearPeriod"
                        ],
                        "schema": {
                            "enum": [
                                "SUMMER",
                                "FIRST_SEMESTER",
                                "WINTER",
                                "SECOND_SEMESTER"
                            ],
                            "type": "string"
                        },
                        "operators": [
                            "eq",
                            "in"
                        ]
                    },
                    {
                        "path": [
                            "professorId"
                        ],
                        "schema": {
                            "type": "integer"
                        },
                        "operators": [
                            "eq",
                            "in"
                        ]
                    },
                    {
                        "path": [
                            "professorName"
                        ],
                        "schema": {
                            "minLength": 1,
                            "type": "string"
                        },
                        "operators": [
                            "eq"
                        ]
                    }
                ],
                "constraints": {
                    "maxExpressions": 20,
                    "maxDepth": 3,
                    "maxParameters": 100
                }
            }
        },
        "sdk": {
            "resource": "classes",
            "action": "list",
            "pathParameters": {}
        },
        "pagination": {
            "itemsField": "data",
            "nextField": "_paths.next",
            "defaultPageSize": 100,
            "maxPageSize": 1000
        }
    },
    "listClassSchedules": {
        "operationId": "listClassSchedules",
        "target": "data",
        "method": "GET",
        "path": "/class-schedules",
        "authentication": "public",
        "tags": [
            "class-schedules"
        ],
        "summary": "List ClassSchedules",
        "description": null,
        "deprecated": false,
        "pathParameters": [],
        "queryParameters": [
            "page",
            "pageSize",
            "filter"
        ],
        "headerParameters": [],
        "cookieParameters": [],
        "requestBody": null,
        "responses": [
            {
                "status": 200,
                "success": true,
                "contents": [
                    {
                        "contentType": "application/json",
                        "schema": {
                            "$ref": "#/components/schemas/PageClassSchedules"
                        }
                    }
                ],
                "problemTypes": []
            },
            {
                "status": 400,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InvalidRequestProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:invalid-request"
                ]
            },
            {
                "status": 500,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InternalServerErrorProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:internal-server-error"
                ]
            }
        ],
        "query": {
            "parameters": [
                {
                    "name": "page",
                    "required": false,
                    "description": "The page number to retrieve (default: 1)",
                    "style": null,
                    "explode": null,
                    "schema": {
                        "type": "integer",
                        "minimum": 1,
                        "default": 1,
                        "description": "The page number to retrieve (default: 1)"
                    }
                },
                {
                    "name": "pageSize",
                    "required": false,
                    "description": "The number of items per page (default: 20)",
                    "style": null,
                    "explode": null,
                    "schema": {
                        "type": "integer",
                        "minimum": 1,
                        "default": 20,
                        "description": "The number of items per page (default: 20)"
                    }
                },
                {
                    "name": "filter",
                    "required": false,
                    "description": "Structured class schedule filters. Use bracket notation such as filter[course][code]=MC102.",
                    "style": "deepObject",
                    "explode": true,
                    "schema": {
                        "additionalProperties": false,
                        "properties": {
                            "dayOfWeek": {
                                "oneOf": [
                                    {
                                        "enum": [
                                            "MONDAY",
                                            "TUESDAY",
                                            "WEDNESDAY",
                                            "THURSDAY",
                                            "FRIDAY",
                                            "SATURDAY",
                                            "SUNDAY"
                                        ],
                                        "type": "string"
                                    },
                                    {
                                        "additionalProperties": false,
                                        "properties": {
                                            "eq": {
                                                "enum": [
                                                    "MONDAY",
                                                    "TUESDAY",
                                                    "WEDNESDAY",
                                                    "THURSDAY",
                                                    "FRIDAY",
                                                    "SATURDAY",
                                                    "SUNDAY"
                                                ],
                                                "type": "string"
                                            },
                                            "in": {
                                                "items": {
                                                    "enum": [
                                                        "MONDAY",
                                                        "TUESDAY",
                                                        "WEDNESDAY",
                                                        "THURSDAY",
                                                        "FRIDAY",
                                                        "SATURDAY",
                                                        "SUNDAY"
                                                    ],
                                                    "type": "string"
                                                },
                                                "type": "array"
                                            }
                                        },
                                        "type": "object"
                                    }
                                ]
                            },
                            "room": {
                                "additionalProperties": false,
                                "properties": {
                                    "id": {
                                        "oneOf": [
                                            {
                                                "type": "integer"
                                            },
                                            {
                                                "additionalProperties": false,
                                                "properties": {
                                                    "eq": {
                                                        "type": "integer"
                                                    },
                                                    "in": {
                                                        "items": {
                                                            "type": "integer"
                                                        },
                                                        "type": "array"
                                                    }
                                                },
                                                "type": "object"
                                            }
                                        ]
                                    },
                                    "code": {
                                        "oneOf": [
                                            {
                                                "type": "string"
                                            },
                                            {
                                                "additionalProperties": false,
                                                "properties": {
                                                    "eq": {
                                                        "type": "string"
                                                    },
                                                    "in": {
                                                        "items": {
                                                            "type": "string"
                                                        },
                                                        "type": "array"
                                                    }
                                                },
                                                "type": "object"
                                            }
                                        ]
                                    }
                                },
                                "type": "object"
                            },
                            "class": {
                                "additionalProperties": false,
                                "properties": {
                                    "id": {
                                        "oneOf": [
                                            {
                                                "type": "integer"
                                            },
                                            {
                                                "additionalProperties": false,
                                                "properties": {
                                                    "eq": {
                                                        "type": "integer"
                                                    },
                                                    "in": {
                                                        "items": {
                                                            "type": "integer"
                                                        },
                                                        "type": "array"
                                                    }
                                                },
                                                "type": "object"
                                            }
                                        ]
                                    }
                                },
                                "type": "object"
                            },
                            "course": {
                                "additionalProperties": false,
                                "properties": {
                                    "id": {
                                        "oneOf": [
                                            {
                                                "type": "integer"
                                            },
                                            {
                                                "additionalProperties": false,
                                                "properties": {
                                                    "eq": {
                                                        "type": "integer"
                                                    },
                                                    "in": {
                                                        "items": {
                                                            "type": "integer"
                                                        },
                                                        "type": "array"
                                                    }
                                                },
                                                "type": "object"
                                            }
                                        ]
                                    },
                                    "code": {
                                        "oneOf": [
                                            {
                                                "type": "string"
                                            },
                                            {
                                                "additionalProperties": false,
                                                "properties": {
                                                    "eq": {
                                                        "type": "string"
                                                    },
                                                    "in": {
                                                        "items": {
                                                            "type": "string"
                                                        },
                                                        "type": "array"
                                                    }
                                                },
                                                "type": "object"
                                            }
                                        ]
                                    }
                                },
                                "type": "object"
                            },
                            "unit": {
                                "additionalProperties": false,
                                "properties": {
                                    "id": {
                                        "oneOf": [
                                            {
                                                "type": "integer"
                                            },
                                            {
                                                "additionalProperties": false,
                                                "properties": {
                                                    "eq": {
                                                        "type": "integer"
                                                    },
                                                    "in": {
                                                        "items": {
                                                            "type": "integer"
                                                        },
                                                        "type": "array"
                                                    }
                                                },
                                                "type": "object"
                                            }
                                        ]
                                    },
                                    "code": {
                                        "oneOf": [
                                            {
                                                "type": "string"
                                            },
                                            {
                                                "additionalProperties": false,
                                                "properties": {
                                                    "eq": {
                                                        "type": "string"
                                                    },
                                                    "in": {
                                                        "items": {
                                                            "type": "string"
                                                        },
                                                        "type": "array"
                                                    }
                                                },
                                                "type": "object"
                                            }
                                        ]
                                    }
                                },
                                "type": "object"
                            },
                            "studyPeriod": {
                                "additionalProperties": false,
                                "properties": {
                                    "id": {
                                        "oneOf": [
                                            {
                                                "type": "integer"
                                            },
                                            {
                                                "additionalProperties": false,
                                                "properties": {
                                                    "eq": {
                                                        "type": "integer"
                                                    },
                                                    "in": {
                                                        "items": {
                                                            "type": "integer"
                                                        },
                                                        "type": "array"
                                                    }
                                                },
                                                "type": "object"
                                            }
                                        ]
                                    },
                                    "year": {
                                        "oneOf": [
                                            {
                                                "type": "integer"
                                            },
                                            {
                                                "additionalProperties": false,
                                                "properties": {
                                                    "eq": {
                                                        "type": "integer"
                                                    },
                                                    "in": {
                                                        "items": {
                                                            "type": "integer"
                                                        },
                                                        "type": "array"
                                                    }
                                                },
                                                "type": "object"
                                            }
                                        ]
                                    },
                                    "yearPeriod": {
                                        "oneOf": [
                                            {
                                                "enum": [
                                                    "SUMMER",
                                                    "FIRST_SEMESTER",
                                                    "WINTER",
                                                    "SECOND_SEMESTER"
                                                ],
                                                "type": "string"
                                            },
                                            {
                                                "additionalProperties": false,
                                                "properties": {
                                                    "eq": {
                                                        "enum": [
                                                            "SUMMER",
                                                            "FIRST_SEMESTER",
                                                            "WINTER",
                                                            "SECOND_SEMESTER"
                                                        ],
                                                        "type": "string"
                                                    },
                                                    "in": {
                                                        "items": {
                                                            "enum": [
                                                                "SUMMER",
                                                                "FIRST_SEMESTER",
                                                                "WINTER",
                                                                "SECOND_SEMESTER"
                                                            ],
                                                            "type": "string"
                                                        },
                                                        "type": "array"
                                                    }
                                                },
                                                "type": "object"
                                            }
                                        ]
                                    }
                                },
                                "type": "object"
                            }
                        },
                        "type": "object"
                    }
                }
            ],
            "filter": {
                "version": 1,
                "fields": [
                    {
                        "path": [
                            "dayOfWeek"
                        ],
                        "schema": {
                            "enum": [
                                "MONDAY",
                                "TUESDAY",
                                "WEDNESDAY",
                                "THURSDAY",
                                "FRIDAY",
                                "SATURDAY",
                                "SUNDAY"
                            ],
                            "type": "string"
                        },
                        "operators": [
                            "eq",
                            "in"
                        ]
                    },
                    {
                        "path": [
                            "room",
                            "id"
                        ],
                        "schema": {
                            "type": "integer"
                        },
                        "operators": [
                            "eq",
                            "in"
                        ]
                    },
                    {
                        "path": [
                            "room",
                            "code"
                        ],
                        "schema": {
                            "type": "string"
                        },
                        "operators": [
                            "eq",
                            "in"
                        ]
                    },
                    {
                        "path": [
                            "class",
                            "id"
                        ],
                        "schema": {
                            "type": "integer"
                        },
                        "operators": [
                            "eq",
                            "in"
                        ]
                    },
                    {
                        "path": [
                            "course",
                            "id"
                        ],
                        "schema": {
                            "type": "integer"
                        },
                        "operators": [
                            "eq",
                            "in"
                        ]
                    },
                    {
                        "path": [
                            "course",
                            "code"
                        ],
                        "schema": {
                            "type": "string"
                        },
                        "operators": [
                            "eq",
                            "in"
                        ]
                    },
                    {
                        "path": [
                            "unit",
                            "id"
                        ],
                        "schema": {
                            "type": "integer"
                        },
                        "operators": [
                            "eq",
                            "in"
                        ]
                    },
                    {
                        "path": [
                            "unit",
                            "code"
                        ],
                        "schema": {
                            "type": "string"
                        },
                        "operators": [
                            "eq",
                            "in"
                        ]
                    },
                    {
                        "path": [
                            "studyPeriod",
                            "id"
                        ],
                        "schema": {
                            "type": "integer"
                        },
                        "operators": [
                            "eq",
                            "in"
                        ]
                    },
                    {
                        "path": [
                            "studyPeriod",
                            "year"
                        ],
                        "schema": {
                            "type": "integer"
                        },
                        "operators": [
                            "eq",
                            "in"
                        ]
                    },
                    {
                        "path": [
                            "studyPeriod",
                            "yearPeriod"
                        ],
                        "schema": {
                            "enum": [
                                "SUMMER",
                                "FIRST_SEMESTER",
                                "WINTER",
                                "SECOND_SEMESTER"
                            ],
                            "type": "string"
                        },
                        "operators": [
                            "eq",
                            "in"
                        ]
                    }
                ],
                "constraints": {
                    "maxExpressions": 20,
                    "maxDepth": 3,
                    "maxParameters": 100
                }
            }
        },
        "sdk": {
            "resource": "classSchedules",
            "action": "list",
            "pathParameters": {}
        },
        "pagination": {
            "itemsField": "data",
            "nextField": "_paths.next",
            "defaultPageSize": 100,
            "maxPageSize": 1000
        }
    },
    "listCoauthors": {
        "operationId": "listCoauthors",
        "target": "data",
        "method": "GET",
        "path": "/coauthors",
        "authentication": "public",
        "tags": [
            "coauthors"
        ],
        "summary": "List Coauthors",
        "description": null,
        "deprecated": false,
        "pathParameters": [],
        "queryParameters": [
            "page",
            "pageSize",
            "filter"
        ],
        "headerParameters": [],
        "cookieParameters": [],
        "requestBody": null,
        "responses": [
            {
                "status": 200,
                "success": true,
                "contents": [
                    {
                        "contentType": "application/json",
                        "schema": {
                            "type": "object",
                            "properties": {
                                "data": {
                                    "type": "array",
                                    "items": {
                                        "$ref": "#/components/schemas/Coauthor"
                                    }
                                },
                                "quantity": {
                                    "type": "integer"
                                },
                                "total": {
                                    "type": "integer"
                                },
                                "_paths": {
                                    "type": "object",
                                    "properties": {
                                        "firstPage": {
                                            "type": "string"
                                        },
                                        "lastPage": {
                                            "type": "string"
                                        },
                                        "next": {
                                            "type": "string",
                                            "nullable": true
                                        },
                                        "prev": {
                                            "type": "string",
                                            "nullable": true
                                        }
                                    },
                                    "required": [
                                        "firstPage",
                                        "lastPage",
                                        "next",
                                        "prev"
                                    ]
                                }
                            },
                            "required": [
                                "data",
                                "quantity",
                                "total",
                                "_paths"
                            ]
                        }
                    }
                ],
                "problemTypes": []
            },
            {
                "status": 400,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InvalidRequestProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:invalid-request"
                ]
            },
            {
                "status": 500,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InternalServerErrorProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:internal-server-error"
                ]
            }
        ],
        "query": {
            "parameters": [
                {
                    "name": "page",
                    "required": false,
                    "description": "The page number to retrieve (default: 1)",
                    "style": null,
                    "explode": null,
                    "schema": {
                        "type": "integer",
                        "minimum": 1,
                        "default": 1,
                        "description": "The page number to retrieve (default: 1)"
                    }
                },
                {
                    "name": "pageSize",
                    "required": false,
                    "description": "The number of items per page (default: 20)",
                    "style": null,
                    "explode": null,
                    "schema": {
                        "type": "integer",
                        "minimum": 1,
                        "default": 20,
                        "description": "The number of items per page (default: 20)"
                    }
                },
                {
                    "name": "filter",
                    "required": false,
                    "description": "Structured name filters. Use bracket notation such as filter[name]=Ada.",
                    "style": "deepObject",
                    "explode": true,
                    "schema": {
                        "additionalProperties": false,
                        "properties": {
                            "name": {
                                "oneOf": [
                                    {
                                        "minLength": 1,
                                        "type": "string"
                                    },
                                    {
                                        "additionalProperties": false,
                                        "properties": {
                                            "eq": {
                                                "minLength": 1,
                                                "type": "string"
                                            }
                                        },
                                        "type": "object"
                                    }
                                ]
                            }
                        },
                        "type": "object"
                    }
                }
            ],
            "filter": {
                "version": 1,
                "fields": [
                    {
                        "path": [
                            "name"
                        ],
                        "schema": {
                            "minLength": 1,
                            "type": "string"
                        },
                        "operators": [
                            "eq"
                        ]
                    }
                ],
                "constraints": {
                    "maxExpressions": 20,
                    "maxDepth": 3,
                    "maxParameters": 100
                }
            }
        },
        "sdk": {
            "resource": "coauthors",
            "action": "list",
            "pathParameters": {}
        },
        "pagination": {
            "itemsField": "data",
            "nextField": "_paths.next",
            "defaultPageSize": 100,
            "maxPageSize": 1000
        }
    },
    "listCoordinators": {
        "operationId": "listCoordinators",
        "target": "data",
        "method": "GET",
        "path": "/coordinators",
        "authentication": "public",
        "tags": [
            "coordinators"
        ],
        "summary": "List Coordinators",
        "description": null,
        "deprecated": false,
        "pathParameters": [],
        "queryParameters": [
            "page",
            "pageSize",
            "filter"
        ],
        "headerParameters": [],
        "cookieParameters": [],
        "requestBody": null,
        "responses": [
            {
                "status": 200,
                "success": true,
                "contents": [
                    {
                        "contentType": "application/json",
                        "schema": {
                            "type": "object",
                            "properties": {
                                "data": {
                                    "type": "array",
                                    "items": {
                                        "$ref": "#/components/schemas/CoordinatorEntity"
                                    }
                                },
                                "quantity": {
                                    "type": "integer"
                                },
                                "total": {
                                    "type": "integer"
                                },
                                "_paths": {
                                    "type": "object",
                                    "properties": {
                                        "firstPage": {
                                            "type": "string"
                                        },
                                        "lastPage": {
                                            "type": "string"
                                        },
                                        "next": {
                                            "type": "string",
                                            "nullable": true
                                        },
                                        "prev": {
                                            "type": "string",
                                            "nullable": true
                                        }
                                    },
                                    "required": [
                                        "firstPage",
                                        "lastPage",
                                        "next",
                                        "prev"
                                    ]
                                }
                            },
                            "required": [
                                "data",
                                "quantity",
                                "total",
                                "_paths"
                            ]
                        }
                    }
                ],
                "problemTypes": []
            },
            {
                "status": 400,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InvalidRequestProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:invalid-request"
                ]
            },
            {
                "status": 500,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InternalServerErrorProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:internal-server-error"
                ]
            }
        ],
        "query": {
            "parameters": [
                {
                    "name": "page",
                    "required": false,
                    "description": null,
                    "style": null,
                    "explode": null,
                    "schema": {
                        "type": "integer",
                        "minimum": 1
                    }
                },
                {
                    "name": "pageSize",
                    "required": false,
                    "description": null,
                    "style": null,
                    "explode": null,
                    "schema": {
                        "type": "integer",
                        "minimum": 1
                    }
                },
                {
                    "name": "filter",
                    "required": false,
                    "description": "Structured coordinator filters. Use bracket notation such as filter[name]=Ada.",
                    "style": "deepObject",
                    "explode": true,
                    "schema": {
                        "additionalProperties": false,
                        "properties": {
                            "name": {
                                "oneOf": [
                                    {
                                        "minLength": 1,
                                        "type": "string"
                                    },
                                    {
                                        "additionalProperties": false,
                                        "properties": {
                                            "eq": {
                                                "minLength": 1,
                                                "type": "string"
                                            }
                                        },
                                        "type": "object"
                                    }
                                ]
                            }
                        },
                        "type": "object"
                    }
                }
            ],
            "filter": {
                "version": 1,
                "fields": [
                    {
                        "path": [
                            "name"
                        ],
                        "schema": {
                            "minLength": 1,
                            "type": "string"
                        },
                        "operators": [
                            "eq"
                        ]
                    }
                ],
                "constraints": {
                    "maxExpressions": 20,
                    "maxDepth": 3,
                    "maxParameters": 100
                }
            }
        },
        "sdk": {
            "resource": "coordinators",
            "action": "list",
            "pathParameters": {}
        },
        "pagination": {
            "itemsField": "data",
            "nextField": "_paths.next",
            "defaultPageSize": 100,
            "maxPageSize": 1000
        }
    },
    "listCourses": {
        "operationId": "listCourses",
        "target": "data",
        "method": "GET",
        "path": "/courses",
        "authentication": "public",
        "tags": [
            "courses"
        ],
        "summary": "List Courses",
        "description": null,
        "deprecated": false,
        "pathParameters": [],
        "queryParameters": [
            "page",
            "pageSize",
            "filter"
        ],
        "headerParameters": [],
        "cookieParameters": [],
        "requestBody": null,
        "responses": [
            {
                "status": 200,
                "success": true,
                "contents": [
                    {
                        "contentType": "application/json",
                        "schema": {
                            "$ref": "#/components/schemas/PageCourses"
                        }
                    }
                ],
                "problemTypes": []
            },
            {
                "status": 400,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InvalidRequestProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:invalid-request"
                ]
            },
            {
                "status": 500,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InternalServerErrorProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:internal-server-error"
                ]
            }
        ],
        "query": {
            "parameters": [
                {
                    "name": "page",
                    "required": false,
                    "description": "Page number. If omitted together with pageSize, all courses are returned.",
                    "style": null,
                    "explode": null,
                    "schema": {
                        "type": "integer",
                        "minimum": 1,
                        "description": "Page number. If omitted together with pageSize, all courses are returned."
                    }
                },
                {
                    "name": "pageSize",
                    "required": false,
                    "description": "Number of courses per page. If omitted together with page, all courses are returned.",
                    "style": null,
                    "explode": null,
                    "schema": {
                        "type": "integer",
                        "minimum": 1,
                        "description": "Number of courses per page. If omitted together with page, all courses are returned."
                    }
                },
                {
                    "name": "filter",
                    "required": false,
                    "description": "Structured course filters. Use bracket notation such as filter[credits][gte]=4.",
                    "style": "deepObject",
                    "explode": true,
                    "schema": {
                        "additionalProperties": false,
                        "properties": {
                            "catalogYear": {
                                "oneOf": [
                                    {
                                        "type": "integer"
                                    },
                                    {
                                        "additionalProperties": false,
                                        "properties": {
                                            "eq": {
                                                "type": "integer"
                                            },
                                            "in": {
                                                "items": {
                                                    "type": "integer"
                                                },
                                                "type": "array"
                                            }
                                        },
                                        "type": "object"
                                    }
                                ]
                            },
                            "code": {
                                "oneOf": [
                                    {
                                        "minLength": 1,
                                        "type": "string"
                                    },
                                    {
                                        "additionalProperties": false,
                                        "properties": {
                                            "eq": {
                                                "minLength": 1,
                                                "type": "string"
                                            },
                                            "ne": {
                                                "minLength": 1,
                                                "type": "string"
                                            },
                                            "in": {
                                                "items": {
                                                    "minLength": 1,
                                                    "type": "string"
                                                },
                                                "type": "array"
                                            }
                                        },
                                        "type": "object"
                                    }
                                ]
                            },
                            "credits": {
                                "oneOf": [
                                    {
                                        "minimum": 0,
                                        "type": "integer"
                                    },
                                    {
                                        "additionalProperties": false,
                                        "properties": {
                                            "eq": {
                                                "minimum": 0,
                                                "type": "integer"
                                            },
                                            "ne": {
                                                "minimum": 0,
                                                "type": "integer"
                                            },
                                            "gt": {
                                                "minimum": 0,
                                                "type": "integer"
                                            },
                                            "gte": {
                                                "minimum": 0,
                                                "type": "integer"
                                            },
                                            "lt": {
                                                "minimum": 0,
                                                "type": "integer"
                                            },
                                            "lte": {
                                                "minimum": 0,
                                                "type": "integer"
                                            },
                                            "in": {
                                                "items": {
                                                    "minimum": 0,
                                                    "type": "integer"
                                                },
                                                "type": "array"
                                            }
                                        },
                                        "type": "object"
                                    }
                                ]
                            },
                            "tagId": {
                                "oneOf": [
                                    {
                                        "minimum": 1,
                                        "type": "integer"
                                    },
                                    {
                                        "additionalProperties": false,
                                        "properties": {
                                            "eq": {
                                                "minimum": 1,
                                                "type": "integer"
                                            },
                                            "in": {
                                                "items": {
                                                    "minimum": 1,
                                                    "type": "integer"
                                                },
                                                "type": "array"
                                            }
                                        },
                                        "type": "object"
                                    }
                                ]
                            },
                            "unit": {
                                "additionalProperties": false,
                                "properties": {
                                    "code": {
                                        "oneOf": [
                                            {
                                                "minLength": 1,
                                                "type": "string"
                                            },
                                            {
                                                "additionalProperties": false,
                                                "properties": {
                                                    "eq": {
                                                        "minLength": 1,
                                                        "type": "string"
                                                    },
                                                    "in": {
                                                        "items": {
                                                            "minLength": 1,
                                                            "type": "string"
                                                        },
                                                        "type": "array"
                                                    }
                                                },
                                                "type": "object"
                                            }
                                        ]
                                    },
                                    "id": {
                                        "oneOf": [
                                            {
                                                "minimum": 1,
                                                "type": "integer"
                                            },
                                            {
                                                "additionalProperties": false,
                                                "properties": {
                                                    "eq": {
                                                        "minimum": 1,
                                                        "type": "integer"
                                                    },
                                                    "in": {
                                                        "items": {
                                                            "minimum": 1,
                                                            "type": "integer"
                                                        },
                                                        "type": "array"
                                                    }
                                                },
                                                "type": "object"
                                            }
                                        ]
                                    }
                                },
                                "type": "object"
                            }
                        },
                        "type": "object"
                    }
                }
            ],
            "filter": {
                "version": 1,
                "fields": [
                    {
                        "path": [
                            "catalogYear"
                        ],
                        "schema": {
                            "type": "integer"
                        },
                        "operators": [
                            "eq",
                            "in"
                        ]
                    },
                    {
                        "path": [
                            "code"
                        ],
                        "schema": {
                            "minLength": 1,
                            "type": "string"
                        },
                        "operators": [
                            "eq",
                            "ne",
                            "in"
                        ]
                    },
                    {
                        "path": [
                            "credits"
                        ],
                        "schema": {
                            "minimum": 0,
                            "type": "integer"
                        },
                        "operators": [
                            "eq",
                            "ne",
                            "gt",
                            "gte",
                            "lt",
                            "lte",
                            "in"
                        ]
                    },
                    {
                        "path": [
                            "tagId"
                        ],
                        "schema": {
                            "minimum": 1,
                            "type": "integer"
                        },
                        "operators": [
                            "eq",
                            "in"
                        ]
                    },
                    {
                        "path": [
                            "unit",
                            "code"
                        ],
                        "schema": {
                            "minLength": 1,
                            "type": "string"
                        },
                        "operators": [
                            "eq",
                            "in"
                        ]
                    },
                    {
                        "path": [
                            "unit",
                            "id"
                        ],
                        "schema": {
                            "minimum": 1,
                            "type": "integer"
                        },
                        "operators": [
                            "eq",
                            "in"
                        ]
                    }
                ],
                "constraints": {
                    "maxExpressions": 20,
                    "maxDepth": 3,
                    "maxParameters": 100
                }
            }
        },
        "sdk": {
            "resource": "courses",
            "action": "list"
        },
        "pagination": {
            "itemsField": "data",
            "nextField": "_paths.next",
            "defaultPageSize": 20,
            "maxPageSize": 1000
        }
    },
    "listCoursesEvaluationSummaries": {
        "operationId": "listCoursesEvaluationSummaries",
        "target": "data",
        "method": "GET",
        "path": "/courses/evaluation-summaries",
        "authentication": "public",
        "tags": [
            "evaluation-summaries"
        ],
        "summary": "List CoursesEvaluationSummaries",
        "description": null,
        "deprecated": false,
        "pathParameters": [],
        "queryParameters": [
            "page",
            "pageSize",
            "filter"
        ],
        "headerParameters": [],
        "cookieParameters": [],
        "requestBody": null,
        "responses": [
            {
                "status": 200,
                "success": true,
                "contents": [
                    {
                        "contentType": "application/json",
                        "schema": {
                            "$ref": "#/components/schemas/PageCourseEvaluationSummaries"
                        }
                    }
                ],
                "problemTypes": []
            },
            {
                "status": 400,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InvalidRequestProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:invalid-request"
                ]
            },
            {
                "status": 500,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InternalServerErrorProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:internal-server-error"
                ]
            }
        ],
        "query": {
            "parameters": [
                {
                    "name": "page",
                    "required": false,
                    "description": "The page number to retrieve (default: 1)",
                    "style": null,
                    "explode": null,
                    "schema": {
                        "type": "integer",
                        "minimum": 1,
                        "default": 1,
                        "description": "The page number to retrieve (default: 1)"
                    }
                },
                {
                    "name": "pageSize",
                    "required": false,
                    "description": "The number of items per page (default: 20)",
                    "style": null,
                    "explode": null,
                    "schema": {
                        "type": "integer",
                        "minimum": 1,
                        "default": 20,
                        "description": "The number of items per page (default: 20)"
                    }
                },
                {
                    "name": "filter",
                    "required": false,
                    "description": "Structured course summary filters. Use filter[courseCode]=MC102.",
                    "style": "deepObject",
                    "explode": true,
                    "schema": {
                        "additionalProperties": false,
                        "properties": {
                            "courseId": {
                                "oneOf": [
                                    {
                                        "minimum": 1,
                                        "type": "integer"
                                    },
                                    {
                                        "additionalProperties": false,
                                        "properties": {
                                            "eq": {
                                                "minimum": 1,
                                                "type": "integer"
                                            },
                                            "in": {
                                                "items": {
                                                    "minimum": 1,
                                                    "type": "integer"
                                                },
                                                "type": "array"
                                            }
                                        },
                                        "type": "object"
                                    }
                                ]
                            },
                            "courseCode": {
                                "oneOf": [
                                    {
                                        "minLength": 1,
                                        "type": "string"
                                    },
                                    {
                                        "additionalProperties": false,
                                        "properties": {
                                            "eq": {
                                                "minLength": 1,
                                                "type": "string"
                                            },
                                            "ne": {
                                                "minLength": 1,
                                                "type": "string"
                                            },
                                            "in": {
                                                "items": {
                                                    "minLength": 1,
                                                    "type": "string"
                                                },
                                                "type": "array"
                                            }
                                        },
                                        "type": "object"
                                    }
                                ]
                            }
                        },
                        "type": "object"
                    }
                }
            ],
            "filter": {
                "version": 1,
                "fields": [
                    {
                        "path": [
                            "courseId"
                        ],
                        "schema": {
                            "minimum": 1,
                            "type": "integer"
                        },
                        "operators": [
                            "eq",
                            "in"
                        ]
                    },
                    {
                        "path": [
                            "courseCode"
                        ],
                        "schema": {
                            "minLength": 1,
                            "type": "string"
                        },
                        "operators": [
                            "eq",
                            "ne",
                            "in"
                        ]
                    }
                ],
                "constraints": {
                    "maxExpressions": 20,
                    "maxDepth": 3,
                    "maxParameters": 100
                }
            }
        },
        "sdk": {
            "resource": "coursesEvaluationSummaries",
            "action": "list",
            "pathParameters": {}
        },
        "pagination": {
            "itemsField": "data",
            "nextField": "_paths.next",
            "defaultPageSize": 100,
            "maxPageSize": 1000
        }
    },
    "listCurriculumSuggestions": {
        "operationId": "listCurriculumSuggestions",
        "target": "data",
        "method": "GET",
        "path": "/curriculum-suggestions",
        "authentication": "public",
        "tags": [
            "curriculum-suggestions"
        ],
        "summary": "List CurriculumSuggestions",
        "description": null,
        "deprecated": false,
        "pathParameters": [],
        "queryParameters": [
            "filter"
        ],
        "headerParameters": [],
        "cookieParameters": [],
        "requestBody": null,
        "responses": [
            {
                "status": 200,
                "success": true,
                "contents": [
                    {
                        "contentType": "application/json",
                        "schema": {
                            "type": "array",
                            "items": {
                                "$ref": "#/components/schemas/CurriculumSuggestionEntity"
                            }
                        }
                    }
                ],
                "problemTypes": []
            },
            {
                "status": 400,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InvalidRequestProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:invalid-request"
                ]
            },
            {
                "status": 500,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InternalServerErrorProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:internal-server-error"
                ]
            }
        ],
        "query": {
            "parameters": [
                {
                    "name": "filter",
                    "required": false,
                    "description": "Structured curriculum suggestion filters. Use bracket notation such as filter[catalogYear]=2025.",
                    "style": "deepObject",
                    "explode": true,
                    "schema": {
                        "additionalProperties": false,
                        "properties": {
                            "catalogProgramId": {
                                "oneOf": [
                                    {
                                        "minimum": 1,
                                        "type": "integer"
                                    },
                                    {
                                        "additionalProperties": false,
                                        "properties": {
                                            "eq": {
                                                "minimum": 1,
                                                "type": "integer"
                                            },
                                            "in": {
                                                "items": {
                                                    "minimum": 1,
                                                    "type": "integer"
                                                },
                                                "type": "array"
                                            }
                                        },
                                        "type": "object"
                                    }
                                ]
                            },
                            "catalogId": {
                                "oneOf": [
                                    {
                                        "minimum": 1,
                                        "type": "integer"
                                    },
                                    {
                                        "additionalProperties": false,
                                        "properties": {
                                            "eq": {
                                                "minimum": 1,
                                                "type": "integer"
                                            },
                                            "in": {
                                                "items": {
                                                    "minimum": 1,
                                                    "type": "integer"
                                                },
                                                "type": "array"
                                            }
                                        },
                                        "type": "object"
                                    }
                                ]
                            },
                            "catalogYear": {
                                "oneOf": [
                                    {
                                        "minimum": 1900,
                                        "type": "integer"
                                    },
                                    {
                                        "additionalProperties": false,
                                        "properties": {
                                            "eq": {
                                                "minimum": 1900,
                                                "type": "integer"
                                            },
                                            "in": {
                                                "items": {
                                                    "minimum": 1900,
                                                    "type": "integer"
                                                },
                                                "type": "array"
                                            }
                                        },
                                        "type": "object"
                                    }
                                ]
                            },
                            "programId": {
                                "oneOf": [
                                    {
                                        "minimum": 1,
                                        "type": "integer"
                                    },
                                    {
                                        "additionalProperties": false,
                                        "properties": {
                                            "eq": {
                                                "minimum": 1,
                                                "type": "integer"
                                            },
                                            "in": {
                                                "items": {
                                                    "minimum": 1,
                                                    "type": "integer"
                                                },
                                                "type": "array"
                                            }
                                        },
                                        "type": "object"
                                    }
                                ]
                            },
                            "programCode": {
                                "oneOf": [
                                    {
                                        "minimum": 1,
                                        "type": "integer"
                                    },
                                    {
                                        "additionalProperties": false,
                                        "properties": {
                                            "eq": {
                                                "minimum": 1,
                                                "type": "integer"
                                            },
                                            "in": {
                                                "items": {
                                                    "minimum": 1,
                                                    "type": "integer"
                                                },
                                                "type": "array"
                                            }
                                        },
                                        "type": "object"
                                    }
                                ]
                            },
                            "code": {
                                "oneOf": [
                                    {
                                        "minLength": 1,
                                        "type": "string"
                                    },
                                    {
                                        "additionalProperties": false,
                                        "properties": {
                                            "eq": {
                                                "minLength": 1,
                                                "type": "string"
                                            },
                                            "ne": {
                                                "minLength": 1,
                                                "type": "string"
                                            },
                                            "in": {
                                                "items": {
                                                    "minLength": 1,
                                                    "type": "string"
                                                },
                                                "type": "array"
                                            }
                                        },
                                        "type": "object"
                                    }
                                ]
                            },
                            "type": {
                                "oneOf": [
                                    {
                                        "enum": [
                                            "GENERAL",
                                            "SPECIALIZATION",
                                            "PRE_OPTION"
                                        ],
                                        "type": "string"
                                    },
                                    {
                                        "additionalProperties": false,
                                        "properties": {
                                            "eq": {
                                                "enum": [
                                                    "GENERAL",
                                                    "SPECIALIZATION",
                                                    "PRE_OPTION"
                                                ],
                                                "type": "string"
                                            },
                                            "in": {
                                                "items": {
                                                    "enum": [
                                                        "GENERAL",
                                                        "SPECIALIZATION",
                                                        "PRE_OPTION"
                                                    ],
                                                    "type": "string"
                                                },
                                                "type": "array"
                                            }
                                        },
                                        "type": "object"
                                    }
                                ]
                            },
                            "specializationId": {
                                "oneOf": [
                                    {
                                        "minimum": 1,
                                        "type": "integer"
                                    },
                                    {
                                        "additionalProperties": false,
                                        "properties": {
                                            "eq": {
                                                "minimum": 1,
                                                "type": "integer"
                                            },
                                            "in": {
                                                "items": {
                                                    "minimum": 1,
                                                    "type": "integer"
                                                },
                                                "type": "array"
                                            }
                                        },
                                        "type": "object"
                                    }
                                ]
                            }
                        },
                        "type": "object"
                    }
                }
            ],
            "filter": {
                "version": 1,
                "fields": [
                    {
                        "path": [
                            "catalogProgramId"
                        ],
                        "schema": {
                            "minimum": 1,
                            "type": "integer"
                        },
                        "operators": [
                            "eq",
                            "in"
                        ]
                    },
                    {
                        "path": [
                            "catalogId"
                        ],
                        "schema": {
                            "minimum": 1,
                            "type": "integer"
                        },
                        "operators": [
                            "eq",
                            "in"
                        ]
                    },
                    {
                        "path": [
                            "catalogYear"
                        ],
                        "schema": {
                            "minimum": 1900,
                            "type": "integer"
                        },
                        "operators": [
                            "eq",
                            "in"
                        ]
                    },
                    {
                        "path": [
                            "programId"
                        ],
                        "schema": {
                            "minimum": 1,
                            "type": "integer"
                        },
                        "operators": [
                            "eq",
                            "in"
                        ]
                    },
                    {
                        "path": [
                            "programCode"
                        ],
                        "schema": {
                            "minimum": 1,
                            "type": "integer"
                        },
                        "operators": [
                            "eq",
                            "in"
                        ]
                    },
                    {
                        "path": [
                            "code"
                        ],
                        "schema": {
                            "minLength": 1,
                            "type": "string"
                        },
                        "operators": [
                            "eq",
                            "ne",
                            "in"
                        ]
                    },
                    {
                        "path": [
                            "type"
                        ],
                        "schema": {
                            "enum": [
                                "GENERAL",
                                "SPECIALIZATION",
                                "PRE_OPTION"
                            ],
                            "type": "string"
                        },
                        "operators": [
                            "eq",
                            "in"
                        ]
                    },
                    {
                        "path": [
                            "specializationId"
                        ],
                        "schema": {
                            "minimum": 1,
                            "type": "integer"
                        },
                        "operators": [
                            "eq",
                            "in"
                        ]
                    }
                ],
                "constraints": {
                    "maxExpressions": 20,
                    "maxDepth": 3,
                    "maxParameters": 100
                }
            }
        },
        "sdk": {
            "resource": "curriculumSuggestions",
            "action": "list",
            "pathParameters": {}
        },
        "pagination": null
    },
    "listDailyMenus": {
        "operationId": "listDailyMenus",
        "target": "data",
        "method": "GET",
        "path": "/daily-menus",
        "authentication": "public",
        "tags": [
            "daily-menus"
        ],
        "summary": "List DailyMenus",
        "description": null,
        "deprecated": false,
        "pathParameters": [],
        "queryParameters": [
            "filter"
        ],
        "headerParameters": [],
        "cookieParameters": [],
        "requestBody": null,
        "responses": [
            {
                "status": 200,
                "success": true,
                "contents": [
                    {
                        "contentType": "application/json",
                        "schema": {
                            "type": "array",
                            "items": {
                                "$ref": "#/components/schemas/DailyMenu"
                            }
                        }
                    }
                ],
                "problemTypes": []
            },
            {
                "status": 400,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InvalidRequestProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:invalid-request"
                ]
            },
            {
                "status": 500,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InternalServerErrorProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:internal-server-error"
                ]
            }
        ],
        "query": {
            "parameters": [
                {
                    "name": "filter",
                    "required": false,
                    "description": "Structured daily menu filters. Use bracket notation such as filter[date][gte]=2026-08-20.",
                    "style": "deepObject",
                    "explode": true,
                    "schema": {
                        "additionalProperties": false,
                        "properties": {
                            "date": {
                                "oneOf": [
                                    {
                                        "format": "date",
                                        "type": "string"
                                    },
                                    {
                                        "additionalProperties": false,
                                        "properties": {
                                            "eq": {
                                                "format": "date",
                                                "type": "string"
                                            },
                                            "gte": {
                                                "format": "date",
                                                "type": "string"
                                            },
                                            "lte": {
                                                "format": "date",
                                                "type": "string"
                                            }
                                        },
                                        "type": "object"
                                    }
                                ]
                            }
                        },
                        "type": "object"
                    }
                }
            ],
            "filter": {
                "version": 1,
                "fields": [
                    {
                        "path": [
                            "date"
                        ],
                        "schema": {
                            "format": "date",
                            "type": "string"
                        },
                        "operators": [
                            "eq",
                            "gte",
                            "lte"
                        ]
                    }
                ],
                "constraints": {
                    "maxExpressions": 20,
                    "maxDepth": 3,
                    "maxParameters": 100
                }
            }
        },
        "sdk": {
            "resource": "dailyMenus",
            "action": "list",
            "pathParameters": {}
        },
        "pagination": null
    },
    "listDepartments": {
        "operationId": "listDepartments",
        "target": "data",
        "method": "GET",
        "path": "/departments",
        "authentication": "public",
        "tags": [
            "departments"
        ],
        "summary": "List Departments",
        "description": null,
        "deprecated": false,
        "pathParameters": [],
        "queryParameters": [
            "filter"
        ],
        "headerParameters": [],
        "cookieParameters": [],
        "requestBody": null,
        "responses": [
            {
                "status": 200,
                "success": true,
                "contents": [
                    {
                        "contentType": "application/json",
                        "schema": {
                            "type": "array",
                            "items": {
                                "$ref": "#/components/schemas/Department"
                            }
                        }
                    }
                ],
                "problemTypes": []
            },
            {
                "status": 400,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InvalidRequestProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:invalid-request"
                ]
            },
            {
                "status": 500,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InternalServerErrorProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:internal-server-error"
                ]
            }
        ],
        "query": {
            "parameters": [
                {
                    "name": "filter",
                    "required": false,
                    "description": "Structured department filters. Use bracket notation such as filter[unitId]=1.",
                    "style": "deepObject",
                    "explode": true,
                    "schema": {
                        "additionalProperties": false,
                        "properties": {
                            "unitId": {
                                "oneOf": [
                                    {
                                        "minimum": 1,
                                        "type": "integer"
                                    },
                                    {
                                        "additionalProperties": false,
                                        "properties": {
                                            "eq": {
                                                "minimum": 1,
                                                "type": "integer"
                                            },
                                            "in": {
                                                "items": {
                                                    "minimum": 1,
                                                    "type": "integer"
                                                },
                                                "type": "array"
                                            }
                                        },
                                        "type": "object"
                                    }
                                ]
                            },
                            "name": {
                                "oneOf": [
                                    {
                                        "minLength": 1,
                                        "type": "string"
                                    },
                                    {
                                        "additionalProperties": false,
                                        "properties": {
                                            "eq": {
                                                "minLength": 1,
                                                "type": "string"
                                            }
                                        },
                                        "type": "object"
                                    }
                                ]
                            }
                        },
                        "type": "object"
                    }
                }
            ],
            "filter": {
                "version": 1,
                "fields": [
                    {
                        "path": [
                            "unitId"
                        ],
                        "schema": {
                            "minimum": 1,
                            "type": "integer"
                        },
                        "operators": [
                            "eq",
                            "in"
                        ]
                    },
                    {
                        "path": [
                            "name"
                        ],
                        "schema": {
                            "minLength": 1,
                            "type": "string"
                        },
                        "operators": [
                            "eq"
                        ]
                    }
                ],
                "constraints": {
                    "maxExpressions": 20,
                    "maxDepth": 3,
                    "maxParameters": 100
                }
            }
        },
        "sdk": {
            "resource": "departments",
            "action": "list",
            "pathParameters": {}
        },
        "pagination": null
    },
    "listEvaluationSummaries": {
        "operationId": "listEvaluationSummaries",
        "target": "data",
        "method": "GET",
        "path": "/evaluation-summaries",
        "authentication": "public",
        "tags": [
            "evaluation-summaries"
        ],
        "summary": "List EvaluationSummaries",
        "description": null,
        "deprecated": false,
        "pathParameters": [],
        "queryParameters": [
            "filter"
        ],
        "headerParameters": [],
        "cookieParameters": [],
        "requestBody": null,
        "responses": [
            {
                "status": 200,
                "success": true,
                "contents": [
                    {
                        "contentType": "application/json",
                        "schema": {
                            "$ref": "#/components/schemas/CourseProfessorEvaluationSummary"
                        }
                    }
                ],
                "problemTypes": []
            },
            {
                "status": 400,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InvalidRequestProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:invalid-request"
                ]
            },
            {
                "status": 404,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/ResourceNotFoundProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:resource-not-found"
                ]
            },
            {
                "status": 500,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InternalServerErrorProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:internal-server-error"
                ]
            }
        ],
        "query": {
            "parameters": [
                {
                    "name": "filter",
                    "required": true,
                    "description": "Structured evaluation summary filters. Use filter[courseId]=1&filter[professorId]=2.",
                    "style": "deepObject",
                    "explode": true,
                    "schema": {
                        "additionalProperties": false,
                        "properties": {
                            "courseId": {
                                "oneOf": [
                                    {
                                        "minimum": 1,
                                        "type": "integer"
                                    },
                                    {
                                        "additionalProperties": false,
                                        "properties": {
                                            "eq": {
                                                "minimum": 1,
                                                "type": "integer"
                                            },
                                            "in": {
                                                "items": {
                                                    "minimum": 1,
                                                    "type": "integer"
                                                },
                                                "type": "array"
                                            }
                                        },
                                        "type": "object"
                                    }
                                ]
                            },
                            "professorId": {
                                "oneOf": [
                                    {
                                        "minimum": 1,
                                        "type": "integer"
                                    },
                                    {
                                        "additionalProperties": false,
                                        "properties": {
                                            "eq": {
                                                "minimum": 1,
                                                "type": "integer"
                                            },
                                            "in": {
                                                "items": {
                                                    "minimum": 1,
                                                    "type": "integer"
                                                },
                                                "type": "array"
                                            }
                                        },
                                        "type": "object"
                                    }
                                ]
                            }
                        },
                        "type": "object"
                    }
                }
            ],
            "filter": {
                "version": 1,
                "fields": [
                    {
                        "path": [
                            "courseId"
                        ],
                        "schema": {
                            "minimum": 1,
                            "type": "integer"
                        },
                        "operators": [
                            "eq",
                            "in"
                        ]
                    },
                    {
                        "path": [
                            "professorId"
                        ],
                        "schema": {
                            "minimum": 1,
                            "type": "integer"
                        },
                        "operators": [
                            "eq",
                            "in"
                        ]
                    }
                ],
                "constraints": {
                    "maxExpressions": 20,
                    "maxDepth": 3,
                    "maxParameters": 100
                }
            }
        },
        "sdk": {
            "resource": "evaluationSummaries",
            "action": "list",
            "pathParameters": {}
        },
        "pagination": null
    },
    "listExchangeNotices": {
        "operationId": "listExchangeNotices",
        "target": "data",
        "method": "GET",
        "path": "/exchange-notices",
        "authentication": "public",
        "tags": [
            "exchange-notices"
        ],
        "summary": "List ExchangeNotices",
        "description": null,
        "deprecated": false,
        "pathParameters": [],
        "queryParameters": [
            "filter"
        ],
        "headerParameters": [],
        "cookieParameters": [],
        "requestBody": null,
        "responses": [
            {
                "status": 200,
                "success": true,
                "contents": [
                    {
                        "contentType": "application/json",
                        "schema": {
                            "type": "array",
                            "items": {
                                "$ref": "#/components/schemas/ExchangeNotice"
                            }
                        }
                    }
                ],
                "problemTypes": []
            },
            {
                "status": 400,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InvalidRequestProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:invalid-request"
                ]
            },
            {
                "status": 500,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InternalServerErrorProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:internal-server-error"
                ]
            }
        ],
        "query": {
            "parameters": [
                {
                    "name": "filter",
                    "required": false,
                    "description": "Structured exchange notice filters. Use bracket notation such as filter[registrationEnd][gte]=2026-01-01.",
                    "style": "deepObject",
                    "explode": true,
                    "schema": {
                        "additionalProperties": false,
                        "properties": {
                            "placeId": {
                                "oneOf": [
                                    {
                                        "minimum": 1,
                                        "type": "integer"
                                    },
                                    {
                                        "additionalProperties": false,
                                        "properties": {
                                            "eq": {
                                                "minimum": 1,
                                                "type": "integer"
                                            },
                                            "in": {
                                                "items": {
                                                    "minimum": 1,
                                                    "type": "integer"
                                                },
                                                "type": "array"
                                            }
                                        },
                                        "type": "object"
                                    }
                                ]
                            },
                            "placeName": {
                                "oneOf": [
                                    {
                                        "minLength": 1,
                                        "type": "string"
                                    },
                                    {
                                        "additionalProperties": false,
                                        "properties": {
                                            "eq": {
                                                "minLength": 1,
                                                "type": "string"
                                            }
                                        },
                                        "type": "object"
                                    }
                                ]
                            },
                            "registrationStart": {
                                "oneOf": [
                                    {
                                        "format": "date",
                                        "type": "string"
                                    },
                                    {
                                        "additionalProperties": false,
                                        "properties": {
                                            "gte": {
                                                "format": "date",
                                                "type": "string"
                                            },
                                            "lte": {
                                                "format": "date",
                                                "type": "string"
                                            }
                                        },
                                        "type": "object"
                                    }
                                ]
                            },
                            "registrationEnd": {
                                "oneOf": [
                                    {
                                        "format": "date",
                                        "type": "string"
                                    },
                                    {
                                        "additionalProperties": false,
                                        "properties": {
                                            "gte": {
                                                "format": "date",
                                                "type": "string"
                                            },
                                            "lte": {
                                                "format": "date",
                                                "type": "string"
                                            }
                                        },
                                        "type": "object"
                                    }
                                ]
                            }
                        },
                        "type": "object"
                    }
                }
            ],
            "filter": {
                "version": 1,
                "fields": [
                    {
                        "path": [
                            "placeId"
                        ],
                        "schema": {
                            "minimum": 1,
                            "type": "integer"
                        },
                        "operators": [
                            "eq",
                            "in"
                        ]
                    },
                    {
                        "path": [
                            "placeName"
                        ],
                        "schema": {
                            "minLength": 1,
                            "type": "string"
                        },
                        "operators": [
                            "eq"
                        ]
                    },
                    {
                        "path": [
                            "registrationStart"
                        ],
                        "schema": {
                            "format": "date",
                            "type": "string"
                        },
                        "operators": [
                            "gte",
                            "lte"
                        ]
                    },
                    {
                        "path": [
                            "registrationEnd"
                        ],
                        "schema": {
                            "format": "date",
                            "type": "string"
                        },
                        "operators": [
                            "gte",
                            "lte"
                        ]
                    }
                ],
                "constraints": {
                    "maxExpressions": 20,
                    "maxDepth": 3,
                    "maxParameters": 100
                }
            }
        },
        "sdk": {
            "resource": "exchangeNotices",
            "action": "list",
            "pathParameters": {}
        },
        "pagination": null
    },
    "listExchangePlaces": {
        "operationId": "listExchangePlaces",
        "target": "data",
        "method": "GET",
        "path": "/exchange-places",
        "authentication": "public",
        "tags": [
            "exchange-places"
        ],
        "summary": "List ExchangePlaces",
        "description": null,
        "deprecated": false,
        "pathParameters": [],
        "queryParameters": [
            "filter"
        ],
        "headerParameters": [],
        "cookieParameters": [],
        "requestBody": null,
        "responses": [
            {
                "status": 200,
                "success": true,
                "contents": [
                    {
                        "contentType": "application/json",
                        "schema": {
                            "type": "array",
                            "items": {
                                "$ref": "#/components/schemas/ExchangePlaceListItem"
                            }
                        }
                    }
                ],
                "problemTypes": []
            },
            {
                "status": 400,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InvalidRequestProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:invalid-request"
                ]
            },
            {
                "status": 500,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InternalServerErrorProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:internal-server-error"
                ]
            }
        ],
        "query": {
            "parameters": [
                {
                    "name": "filter",
                    "required": false,
                    "description": "Structured exchange place filters. Use bracket notation such as filter[name]=França.",
                    "style": "deepObject",
                    "explode": true,
                    "schema": {
                        "additionalProperties": false,
                        "properties": {
                            "id": {
                                "oneOf": [
                                    {
                                        "minimum": 1,
                                        "type": "integer"
                                    },
                                    {
                                        "additionalProperties": false,
                                        "properties": {
                                            "eq": {
                                                "minimum": 1,
                                                "type": "integer"
                                            },
                                            "in": {
                                                "items": {
                                                    "minimum": 1,
                                                    "type": "integer"
                                                },
                                                "type": "array"
                                            }
                                        },
                                        "type": "object"
                                    }
                                ]
                            },
                            "name": {
                                "oneOf": [
                                    {
                                        "minLength": 1,
                                        "type": "string"
                                    },
                                    {
                                        "additionalProperties": false,
                                        "properties": {
                                            "eq": {
                                                "minLength": 1,
                                                "type": "string"
                                            }
                                        },
                                        "type": "object"
                                    }
                                ]
                            }
                        },
                        "type": "object"
                    }
                }
            ],
            "filter": {
                "version": 1,
                "fields": [
                    {
                        "path": [
                            "id"
                        ],
                        "schema": {
                            "minimum": 1,
                            "type": "integer"
                        },
                        "operators": [
                            "eq",
                            "in"
                        ]
                    },
                    {
                        "path": [
                            "name"
                        ],
                        "schema": {
                            "minLength": 1,
                            "type": "string"
                        },
                        "operators": [
                            "eq"
                        ]
                    }
                ],
                "constraints": {
                    "maxExpressions": 20,
                    "maxDepth": 3,
                    "maxParameters": 100
                }
            }
        },
        "sdk": {
            "resource": "exchangePlaces",
            "action": "list",
            "pathParameters": {}
        },
        "pagination": null
    },
    "listKeywords": {
        "operationId": "listKeywords",
        "target": "data",
        "method": "GET",
        "path": "/keywords",
        "authentication": "public",
        "tags": [
            "keywords"
        ],
        "summary": "List Keywords",
        "description": null,
        "deprecated": false,
        "pathParameters": [],
        "queryParameters": [
            "page",
            "pageSize",
            "filter"
        ],
        "headerParameters": [],
        "cookieParameters": [],
        "requestBody": null,
        "responses": [
            {
                "status": 200,
                "success": true,
                "contents": [
                    {
                        "contentType": "application/json",
                        "schema": {
                            "type": "object",
                            "properties": {
                                "data": {
                                    "type": "array",
                                    "items": {
                                        "$ref": "#/components/schemas/Keyword"
                                    }
                                },
                                "quantity": {
                                    "type": "integer"
                                },
                                "total": {
                                    "type": "integer"
                                },
                                "_paths": {
                                    "type": "object",
                                    "properties": {
                                        "firstPage": {
                                            "type": "string"
                                        },
                                        "lastPage": {
                                            "type": "string"
                                        },
                                        "next": {
                                            "type": "string",
                                            "nullable": true
                                        },
                                        "prev": {
                                            "type": "string",
                                            "nullable": true
                                        }
                                    },
                                    "required": [
                                        "firstPage",
                                        "lastPage",
                                        "next",
                                        "prev"
                                    ]
                                }
                            },
                            "required": [
                                "data",
                                "quantity",
                                "total",
                                "_paths"
                            ]
                        }
                    }
                ],
                "problemTypes": []
            },
            {
                "status": 400,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InvalidRequestProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:invalid-request"
                ]
            },
            {
                "status": 500,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InternalServerErrorProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:internal-server-error"
                ]
            }
        ],
        "query": {
            "parameters": [
                {
                    "name": "page",
                    "required": false,
                    "description": "The page number to retrieve (default: 1)",
                    "style": null,
                    "explode": null,
                    "schema": {
                        "type": "integer",
                        "minimum": 1,
                        "default": 1,
                        "description": "The page number to retrieve (default: 1)"
                    }
                },
                {
                    "name": "pageSize",
                    "required": false,
                    "description": "The number of items per page (default: 20)",
                    "style": null,
                    "explode": null,
                    "schema": {
                        "type": "integer",
                        "minimum": 1,
                        "default": 20,
                        "description": "The number of items per page (default: 20)"
                    }
                },
                {
                    "name": "filter",
                    "required": false,
                    "description": "Structured name filters. Use bracket notation such as filter[name]=Ada.",
                    "style": "deepObject",
                    "explode": true,
                    "schema": {
                        "additionalProperties": false,
                        "properties": {
                            "name": {
                                "oneOf": [
                                    {
                                        "minLength": 1,
                                        "type": "string"
                                    },
                                    {
                                        "additionalProperties": false,
                                        "properties": {
                                            "eq": {
                                                "minLength": 1,
                                                "type": "string"
                                            }
                                        },
                                        "type": "object"
                                    }
                                ]
                            }
                        },
                        "type": "object"
                    }
                }
            ],
            "filter": {
                "version": 1,
                "fields": [
                    {
                        "path": [
                            "name"
                        ],
                        "schema": {
                            "minLength": 1,
                            "type": "string"
                        },
                        "operators": [
                            "eq"
                        ]
                    }
                ],
                "constraints": {
                    "maxExpressions": 20,
                    "maxDepth": 3,
                    "maxParameters": 100
                }
            }
        },
        "sdk": {
            "resource": "keywords",
            "action": "list",
            "pathParameters": {}
        },
        "pagination": {
            "itemsField": "data",
            "nextField": "_paths.next",
            "defaultPageSize": 100,
            "maxPageSize": 1000
        }
    },
    "listLanguages": {
        "operationId": "listLanguages",
        "target": "data",
        "method": "GET",
        "path": "/languages",
        "authentication": "public",
        "tags": [
            "languages"
        ],
        "summary": "List Languages",
        "description": null,
        "deprecated": false,
        "pathParameters": [],
        "queryParameters": [
            "filter"
        ],
        "headerParameters": [],
        "cookieParameters": [],
        "requestBody": null,
        "responses": [
            {
                "status": 200,
                "success": true,
                "contents": [
                    {
                        "contentType": "application/json",
                        "schema": {
                            "type": "array",
                            "items": {
                                "$ref": "#/components/schemas/Language"
                            }
                        }
                    }
                ],
                "problemTypes": []
            },
            {
                "status": 400,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InvalidRequestProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:invalid-request"
                ]
            },
            {
                "status": 500,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InternalServerErrorProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:internal-server-error"
                ]
            }
        ],
        "query": {
            "parameters": [
                {
                    "name": "filter",
                    "required": false,
                    "description": "Structured language filters. Use bracket notation such as filter[name]=Português.",
                    "style": "deepObject",
                    "explode": true,
                    "schema": {
                        "additionalProperties": false,
                        "properties": {
                            "id": {
                                "oneOf": [
                                    {
                                        "type": "integer"
                                    },
                                    {
                                        "additionalProperties": false,
                                        "properties": {
                                            "eq": {
                                                "type": "integer"
                                            },
                                            "in": {
                                                "items": {
                                                    "type": "integer"
                                                },
                                                "type": "array"
                                            }
                                        },
                                        "type": "object"
                                    }
                                ]
                            },
                            "name": {
                                "oneOf": [
                                    {
                                        "minLength": 1,
                                        "type": "string"
                                    },
                                    {
                                        "additionalProperties": false,
                                        "properties": {
                                            "eq": {
                                                "minLength": 1,
                                                "type": "string"
                                            }
                                        },
                                        "type": "object"
                                    }
                                ]
                            }
                        },
                        "type": "object"
                    }
                }
            ],
            "filter": {
                "version": 1,
                "fields": [
                    {
                        "path": [
                            "id"
                        ],
                        "schema": {
                            "type": "integer"
                        },
                        "operators": [
                            "eq",
                            "in"
                        ]
                    },
                    {
                        "path": [
                            "name"
                        ],
                        "schema": {
                            "minLength": 1,
                            "type": "string"
                        },
                        "operators": [
                            "eq"
                        ]
                    }
                ],
                "constraints": {
                    "maxExpressions": 20,
                    "maxDepth": 3,
                    "maxParameters": 100
                }
            }
        },
        "sdk": {
            "resource": "languages",
            "action": "list",
            "pathParameters": {}
        },
        "pagination": null
    },
    "listProfessorDataPortalProfiles": {
        "operationId": "listProfessorDataPortalProfiles",
        "target": "data",
        "method": "GET",
        "path": "/professor-data-portal-profiles",
        "authentication": "public",
        "tags": [
            "professor-data-portal"
        ],
        "summary": "List ProfessorDataPortalProfiles",
        "description": null,
        "deprecated": false,
        "pathParameters": [],
        "queryParameters": [
            "page",
            "pageSize",
            "filter"
        ],
        "headerParameters": [],
        "cookieParameters": [],
        "requestBody": null,
        "responses": [
            {
                "status": 200,
                "success": true,
                "contents": [
                    {
                        "contentType": "application/json",
                        "schema": {
                            "type": "object",
                            "properties": {
                                "data": {
                                    "type": "array",
                                    "items": {
                                        "$ref": "#/components/schemas/ProfessorDataPortalProfileSummary"
                                    }
                                },
                                "quantity": {
                                    "type": "integer"
                                },
                                "total": {
                                    "type": "integer"
                                },
                                "_paths": {
                                    "type": "object",
                                    "properties": {
                                        "firstPage": {
                                            "type": "string"
                                        },
                                        "lastPage": {
                                            "type": "string"
                                        },
                                        "next": {
                                            "type": "string",
                                            "nullable": true
                                        },
                                        "prev": {
                                            "type": "string",
                                            "nullable": true
                                        }
                                    },
                                    "required": [
                                        "firstPage",
                                        "lastPage",
                                        "next",
                                        "prev"
                                    ]
                                }
                            },
                            "required": [
                                "data",
                                "quantity",
                                "total",
                                "_paths"
                            ]
                        }
                    }
                ],
                "problemTypes": []
            },
            {
                "status": 400,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InvalidRequestProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:invalid-request"
                ]
            },
            {
                "status": 500,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InternalServerErrorProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:internal-server-error"
                ]
            }
        ],
        "query": {
            "parameters": [
                {
                    "name": "page",
                    "required": false,
                    "description": "The page number to retrieve (default: 1)",
                    "style": null,
                    "explode": null,
                    "schema": {
                        "type": "integer",
                        "minimum": 1,
                        "default": 1,
                        "description": "The page number to retrieve (default: 1)"
                    }
                },
                {
                    "name": "pageSize",
                    "required": false,
                    "description": "The number of items per page (default: 20)",
                    "style": null,
                    "explode": null,
                    "schema": {
                        "type": "integer",
                        "minimum": 1,
                        "default": 20,
                        "description": "The number of items per page (default: 20)"
                    }
                },
                {
                    "name": "filter",
                    "required": false,
                    "description": "Structured profile filters. Use bracket notation such as filter[unitId]=1.",
                    "style": "deepObject",
                    "explode": true,
                    "schema": {
                        "additionalProperties": false,
                        "properties": {
                            "professorId": {
                                "oneOf": [
                                    {
                                        "minimum": 1,
                                        "type": "integer"
                                    },
                                    {
                                        "additionalProperties": false,
                                        "properties": {
                                            "eq": {
                                                "minimum": 1,
                                                "type": "integer"
                                            },
                                            "in": {
                                                "items": {
                                                    "minimum": 1,
                                                    "type": "integer"
                                                },
                                                "type": "array"
                                            }
                                        },
                                        "type": "object"
                                    }
                                ]
                            },
                            "portalId": {
                                "oneOf": [
                                    {
                                        "minimum": 1,
                                        "type": "integer"
                                    },
                                    {
                                        "additionalProperties": false,
                                        "properties": {
                                            "eq": {
                                                "minimum": 1,
                                                "type": "integer"
                                            },
                                            "in": {
                                                "items": {
                                                    "minimum": 1,
                                                    "type": "integer"
                                                },
                                                "type": "array"
                                            }
                                        },
                                        "type": "object"
                                    }
                                ]
                            },
                            "unitId": {
                                "oneOf": [
                                    {
                                        "minimum": 1,
                                        "type": "integer"
                                    },
                                    {
                                        "additionalProperties": false,
                                        "properties": {
                                            "eq": {
                                                "minimum": 1,
                                                "type": "integer"
                                            },
                                            "in": {
                                                "items": {
                                                    "minimum": 1,
                                                    "type": "integer"
                                                },
                                                "type": "array"
                                            }
                                        },
                                        "type": "object"
                                    }
                                ]
                            },
                            "departmentId": {
                                "oneOf": [
                                    {
                                        "minimum": 1,
                                        "type": "integer"
                                    },
                                    {
                                        "additionalProperties": false,
                                        "properties": {
                                            "eq": {
                                                "minimum": 1,
                                                "type": "integer"
                                            },
                                            "in": {
                                                "items": {
                                                    "minimum": 1,
                                                    "type": "integer"
                                                },
                                                "type": "array"
                                            }
                                        },
                                        "type": "object"
                                    }
                                ]
                            },
                            "positionId": {
                                "oneOf": [
                                    {
                                        "minimum": 1,
                                        "type": "integer"
                                    },
                                    {
                                        "additionalProperties": false,
                                        "properties": {
                                            "eq": {
                                                "minimum": 1,
                                                "type": "integer"
                                            },
                                            "in": {
                                                "items": {
                                                    "minimum": 1,
                                                    "type": "integer"
                                                },
                                                "type": "array"
                                            }
                                        },
                                        "type": "object"
                                    }
                                ]
                            },
                            "name": {
                                "oneOf": [
                                    {
                                        "minLength": 1,
                                        "type": "string"
                                    },
                                    {
                                        "additionalProperties": false,
                                        "properties": {
                                            "eq": {
                                                "minLength": 1,
                                                "type": "string"
                                            }
                                        },
                                        "type": "object"
                                    }
                                ]
                            }
                        },
                        "type": "object"
                    }
                }
            ],
            "filter": {
                "version": 1,
                "fields": [
                    {
                        "path": [
                            "professorId"
                        ],
                        "schema": {
                            "minimum": 1,
                            "type": "integer"
                        },
                        "operators": [
                            "eq",
                            "in"
                        ]
                    },
                    {
                        "path": [
                            "portalId"
                        ],
                        "schema": {
                            "minimum": 1,
                            "type": "integer"
                        },
                        "operators": [
                            "eq",
                            "in"
                        ]
                    },
                    {
                        "path": [
                            "unitId"
                        ],
                        "schema": {
                            "minimum": 1,
                            "type": "integer"
                        },
                        "operators": [
                            "eq",
                            "in"
                        ]
                    },
                    {
                        "path": [
                            "departmentId"
                        ],
                        "schema": {
                            "minimum": 1,
                            "type": "integer"
                        },
                        "operators": [
                            "eq",
                            "in"
                        ]
                    },
                    {
                        "path": [
                            "positionId"
                        ],
                        "schema": {
                            "minimum": 1,
                            "type": "integer"
                        },
                        "operators": [
                            "eq",
                            "in"
                        ]
                    },
                    {
                        "path": [
                            "name"
                        ],
                        "schema": {
                            "minLength": 1,
                            "type": "string"
                        },
                        "operators": [
                            "eq"
                        ]
                    }
                ],
                "constraints": {
                    "maxExpressions": 20,
                    "maxDepth": 3,
                    "maxParameters": 100
                }
            }
        },
        "sdk": {
            "resource": "professorDataPortalProfiles",
            "action": "list",
            "pathParameters": {}
        },
        "pagination": {
            "itemsField": "data",
            "nextField": "_paths.next",
            "defaultPageSize": 100,
            "maxPageSize": 1000
        }
    },
    "listProfessorPositions": {
        "operationId": "listProfessorPositions",
        "target": "data",
        "method": "GET",
        "path": "/professor-positions",
        "authentication": "public",
        "tags": [
            "professor-positions"
        ],
        "summary": "List ProfessorPositions",
        "description": null,
        "deprecated": false,
        "pathParameters": [],
        "queryParameters": [
            "filter"
        ],
        "headerParameters": [],
        "cookieParameters": [],
        "requestBody": null,
        "responses": [
            {
                "status": 200,
                "success": true,
                "contents": [
                    {
                        "contentType": "application/json",
                        "schema": {
                            "type": "array",
                            "items": {
                                "$ref": "#/components/schemas/ProfessorPosition"
                            }
                        }
                    }
                ],
                "problemTypes": []
            },
            {
                "status": 400,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InvalidRequestProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:invalid-request"
                ]
            },
            {
                "status": 500,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InternalServerErrorProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:internal-server-error"
                ]
            }
        ],
        "query": {
            "parameters": [
                {
                    "name": "filter",
                    "required": false,
                    "description": "Structured professor position filters. Use bracket notation such as filter[role]=Professor.",
                    "style": "deepObject",
                    "explode": true,
                    "schema": {
                        "additionalProperties": false,
                        "properties": {
                            "id": {
                                "oneOf": [
                                    {
                                        "minimum": 1,
                                        "type": "integer"
                                    },
                                    {
                                        "additionalProperties": false,
                                        "properties": {
                                            "eq": {
                                                "minimum": 1,
                                                "type": "integer"
                                            },
                                            "in": {
                                                "items": {
                                                    "minimum": 1,
                                                    "type": "integer"
                                                },
                                                "type": "array"
                                            }
                                        },
                                        "type": "object"
                                    }
                                ]
                            },
                            "canonicalKey": {
                                "oneOf": [
                                    {
                                        "minLength": 1,
                                        "type": "string"
                                    },
                                    {
                                        "additionalProperties": false,
                                        "properties": {
                                            "eq": {
                                                "minLength": 1,
                                                "type": "string"
                                            }
                                        },
                                        "type": "object"
                                    }
                                ]
                            },
                            "role": {
                                "oneOf": [
                                    {
                                        "enum": [
                                            "PROFESSOR",
                                            "RESEARCHER",
                                            "POSTDOCTORAL_RESEARCHER"
                                        ],
                                        "type": "string"
                                    },
                                    {
                                        "additionalProperties": false,
                                        "properties": {
                                            "eq": {
                                                "enum": [
                                                    "PROFESSOR",
                                                    "RESEARCHER",
                                                    "POSTDOCTORAL_RESEARCHER"
                                                ],
                                                "type": "string"
                                            },
                                            "in": {
                                                "items": {
                                                    "enum": [
                                                        "PROFESSOR",
                                                        "RESEARCHER",
                                                        "POSTDOCTORAL_RESEARCHER"
                                                    ],
                                                    "type": "string"
                                                },
                                                "type": "array"
                                            }
                                        },
                                        "type": "object"
                                    }
                                ]
                            }
                        },
                        "type": "object"
                    }
                }
            ],
            "filter": {
                "version": 1,
                "fields": [
                    {
                        "path": [
                            "id"
                        ],
                        "schema": {
                            "minimum": 1,
                            "type": "integer"
                        },
                        "operators": [
                            "eq",
                            "in"
                        ]
                    },
                    {
                        "path": [
                            "canonicalKey"
                        ],
                        "schema": {
                            "minLength": 1,
                            "type": "string"
                        },
                        "operators": [
                            "eq"
                        ]
                    },
                    {
                        "path": [
                            "role"
                        ],
                        "schema": {
                            "enum": [
                                "PROFESSOR",
                                "RESEARCHER",
                                "POSTDOCTORAL_RESEARCHER"
                            ],
                            "type": "string"
                        },
                        "operators": [
                            "eq",
                            "in"
                        ]
                    }
                ],
                "constraints": {
                    "maxExpressions": 20,
                    "maxDepth": 3,
                    "maxParameters": 100
                }
            }
        },
        "sdk": {
            "resource": "professorPositions",
            "action": "list",
            "pathParameters": {}
        },
        "pagination": null
    },
    "listProfessors": {
        "operationId": "listProfessors",
        "target": "data",
        "method": "GET",
        "path": "/professors",
        "authentication": "public",
        "tags": [
            "professors"
        ],
        "summary": "List Professors",
        "description": null,
        "deprecated": false,
        "pathParameters": [],
        "queryParameters": [
            "page",
            "pageSize",
            "filter"
        ],
        "headerParameters": [],
        "cookieParameters": [],
        "requestBody": null,
        "responses": [
            {
                "status": 200,
                "success": true,
                "contents": [
                    {
                        "contentType": "application/json",
                        "schema": {
                            "$ref": "#/components/schemas/PageProfessors"
                        }
                    }
                ],
                "problemTypes": []
            },
            {
                "status": 400,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InvalidRequestProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:invalid-request"
                ]
            },
            {
                "status": 500,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InternalServerErrorProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:internal-server-error"
                ]
            }
        ],
        "query": {
            "parameters": [
                {
                    "name": "page",
                    "required": false,
                    "description": "The page number to retrieve (default: 1)",
                    "style": null,
                    "explode": null,
                    "schema": {
                        "type": "integer",
                        "minimum": 1,
                        "default": 1,
                        "description": "The page number to retrieve (default: 1)"
                    }
                },
                {
                    "name": "pageSize",
                    "required": false,
                    "description": "The number of items per page (default: 20)",
                    "style": null,
                    "explode": null,
                    "schema": {
                        "type": "integer",
                        "minimum": 1,
                        "default": 20,
                        "description": "The number of items per page (default: 20)"
                    }
                },
                {
                    "name": "filter",
                    "required": false,
                    "description": "Structured professor filters. Use bracket notation such as filter[classId]=1.",
                    "style": "deepObject",
                    "explode": true,
                    "schema": {
                        "additionalProperties": false,
                        "properties": {
                            "classId": {
                                "oneOf": [
                                    {
                                        "type": "integer"
                                    },
                                    {
                                        "additionalProperties": false,
                                        "properties": {
                                            "eq": {
                                                "type": "integer"
                                            },
                                            "in": {
                                                "items": {
                                                    "type": "integer"
                                                },
                                                "type": "array"
                                            }
                                        },
                                        "type": "object"
                                    }
                                ]
                            }
                        },
                        "type": "object"
                    }
                }
            ],
            "filter": {
                "version": 1,
                "fields": [
                    {
                        "path": [
                            "classId"
                        ],
                        "schema": {
                            "type": "integer"
                        },
                        "operators": [
                            "eq",
                            "in"
                        ]
                    }
                ],
                "constraints": {
                    "maxExpressions": 20,
                    "maxDepth": 3,
                    "maxParameters": 100
                }
            }
        },
        "sdk": {
            "resource": "professors",
            "action": "list",
            "pathParameters": {}
        },
        "pagination": {
            "itemsField": "data",
            "nextField": "_paths.next",
            "defaultPageSize": 100,
            "maxPageSize": 1000
        }
    },
    "listProfessorsEvaluationSummaries": {
        "operationId": "listProfessorsEvaluationSummaries",
        "target": "data",
        "method": "GET",
        "path": "/professors/evaluation-summaries",
        "authentication": "public",
        "tags": [
            "evaluation-summaries"
        ],
        "summary": "List ProfessorsEvaluationSummaries",
        "description": null,
        "deprecated": false,
        "pathParameters": [],
        "queryParameters": [
            "page",
            "pageSize",
            "filter"
        ],
        "headerParameters": [],
        "cookieParameters": [],
        "requestBody": null,
        "responses": [
            {
                "status": 200,
                "success": true,
                "contents": [
                    {
                        "contentType": "application/json",
                        "schema": {
                            "$ref": "#/components/schemas/PageProfessorEvaluationSummaries"
                        }
                    }
                ],
                "problemTypes": []
            },
            {
                "status": 400,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InvalidRequestProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:invalid-request"
                ]
            },
            {
                "status": 500,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InternalServerErrorProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:internal-server-error"
                ]
            }
        ],
        "query": {
            "parameters": [
                {
                    "name": "page",
                    "required": false,
                    "description": "The page number to retrieve (default: 1)",
                    "style": null,
                    "explode": null,
                    "schema": {
                        "type": "integer",
                        "minimum": 1,
                        "default": 1,
                        "description": "The page number to retrieve (default: 1)"
                    }
                },
                {
                    "name": "pageSize",
                    "required": false,
                    "description": "The number of items per page (default: 20)",
                    "style": null,
                    "explode": null,
                    "schema": {
                        "type": "integer",
                        "minimum": 1,
                        "default": 20,
                        "description": "The number of items per page (default: 20)"
                    }
                },
                {
                    "name": "filter",
                    "required": false,
                    "description": "Structured professor summary filters. Use filter[professorId]=1.",
                    "style": "deepObject",
                    "explode": true,
                    "schema": {
                        "additionalProperties": false,
                        "properties": {
                            "professorId": {
                                "oneOf": [
                                    {
                                        "minimum": 1,
                                        "type": "integer"
                                    },
                                    {
                                        "additionalProperties": false,
                                        "properties": {
                                            "eq": {
                                                "minimum": 1,
                                                "type": "integer"
                                            },
                                            "in": {
                                                "items": {
                                                    "minimum": 1,
                                                    "type": "integer"
                                                },
                                                "type": "array"
                                            }
                                        },
                                        "type": "object"
                                    }
                                ]
                            }
                        },
                        "type": "object"
                    }
                }
            ],
            "filter": {
                "version": 1,
                "fields": [
                    {
                        "path": [
                            "professorId"
                        ],
                        "schema": {
                            "minimum": 1,
                            "type": "integer"
                        },
                        "operators": [
                            "eq",
                            "in"
                        ]
                    }
                ],
                "constraints": {
                    "maxExpressions": 20,
                    "maxDepth": 3,
                    "maxParameters": 100
                }
            }
        },
        "sdk": {
            "resource": "professorsEvaluationSummaries",
            "action": "list",
            "pathParameters": {}
        },
        "pagination": {
            "itemsField": "data",
            "nextField": "_paths.next",
            "defaultPageSize": 100,
            "maxPageSize": 1000
        }
    },
    "listPrograms": {
        "operationId": "listPrograms",
        "target": "data",
        "method": "GET",
        "path": "/programs",
        "authentication": "public",
        "tags": [
            "programs"
        ],
        "summary": "List Programs",
        "description": null,
        "deprecated": false,
        "pathParameters": [],
        "queryParameters": [
            "filter"
        ],
        "headerParameters": [],
        "cookieParameters": [],
        "requestBody": null,
        "responses": [
            {
                "status": 200,
                "success": true,
                "contents": [
                    {
                        "contentType": "application/json",
                        "schema": {
                            "type": "array",
                            "items": {
                                "$ref": "#/components/schemas/Program"
                            }
                        }
                    }
                ],
                "problemTypes": []
            },
            {
                "status": 400,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InvalidRequestProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:invalid-request"
                ]
            },
            {
                "status": 500,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InternalServerErrorProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:internal-server-error"
                ]
            }
        ],
        "query": {
            "parameters": [
                {
                    "name": "filter",
                    "required": false,
                    "description": "Structured program filters. Use bracket notation such as filter[unitId]=1.",
                    "style": "deepObject",
                    "explode": true,
                    "schema": {
                        "additionalProperties": false,
                        "properties": {
                            "unitId": {
                                "oneOf": [
                                    {
                                        "type": "integer"
                                    },
                                    {
                                        "additionalProperties": false,
                                        "properties": {
                                            "eq": {
                                                "type": "integer"
                                            },
                                            "in": {
                                                "items": {
                                                    "type": "integer"
                                                },
                                                "type": "array"
                                            }
                                        },
                                        "type": "object"
                                    }
                                ]
                            }
                        },
                        "type": "object"
                    }
                }
            ],
            "filter": {
                "version": 1,
                "fields": [
                    {
                        "path": [
                            "unitId"
                        ],
                        "schema": {
                            "type": "integer"
                        },
                        "operators": [
                            "eq",
                            "in"
                        ]
                    }
                ],
                "constraints": {
                    "maxExpressions": 20,
                    "maxDepth": 3,
                    "maxParameters": 100
                }
            }
        },
        "sdk": {
            "resource": "programs",
            "action": "list",
            "pathParameters": {}
        },
        "pagination": null
    },
    "listRooms": {
        "operationId": "listRooms",
        "target": "data",
        "method": "GET",
        "path": "/rooms",
        "authentication": "public",
        "tags": [
            "rooms"
        ],
        "summary": "List Rooms",
        "description": null,
        "deprecated": false,
        "pathParameters": [],
        "queryParameters": [
            "filter"
        ],
        "headerParameters": [],
        "cookieParameters": [],
        "requestBody": null,
        "responses": [
            {
                "status": 200,
                "success": true,
                "contents": [
                    {
                        "contentType": "application/json",
                        "schema": {
                            "type": "array",
                            "items": {
                                "$ref": "#/components/schemas/RoomEntity"
                            }
                        }
                    }
                ],
                "problemTypes": []
            },
            {
                "status": 400,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InvalidRequestProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:invalid-request"
                ]
            },
            {
                "status": 500,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InternalServerErrorProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:internal-server-error"
                ]
            }
        ],
        "query": {
            "parameters": [
                {
                    "name": "filter",
                    "required": false,
                    "description": "Structured room filters. Use bracket notation such as filter[code]=PB01.",
                    "style": "deepObject",
                    "explode": true,
                    "schema": {
                        "additionalProperties": false,
                        "properties": {
                            "id": {
                                "oneOf": [
                                    {
                                        "type": "integer"
                                    },
                                    {
                                        "additionalProperties": false,
                                        "properties": {
                                            "eq": {
                                                "type": "integer"
                                            },
                                            "in": {
                                                "items": {
                                                    "type": "integer"
                                                },
                                                "type": "array"
                                            }
                                        },
                                        "type": "object"
                                    }
                                ]
                            },
                            "code": {
                                "oneOf": [
                                    {
                                        "minLength": 1,
                                        "type": "string"
                                    },
                                    {
                                        "additionalProperties": false,
                                        "properties": {
                                            "eq": {
                                                "minLength": 1,
                                                "type": "string"
                                            },
                                            "ne": {
                                                "minLength": 1,
                                                "type": "string"
                                            },
                                            "in": {
                                                "items": {
                                                    "minLength": 1,
                                                    "type": "string"
                                                },
                                                "type": "array"
                                            }
                                        },
                                        "type": "object"
                                    }
                                ]
                            }
                        },
                        "type": "object"
                    }
                }
            ],
            "filter": {
                "version": 1,
                "fields": [
                    {
                        "path": [
                            "id"
                        ],
                        "schema": {
                            "type": "integer"
                        },
                        "operators": [
                            "eq",
                            "in"
                        ]
                    },
                    {
                        "path": [
                            "code"
                        ],
                        "schema": {
                            "minLength": 1,
                            "type": "string"
                        },
                        "operators": [
                            "eq",
                            "ne",
                            "in"
                        ]
                    }
                ],
                "constraints": {
                    "maxExpressions": 20,
                    "maxDepth": 3,
                    "maxParameters": 100
                }
            }
        },
        "sdk": {
            "resource": "rooms",
            "action": "list",
            "pathParameters": {}
        },
        "pagination": null
    },
    "listSpecializations": {
        "operationId": "listSpecializations",
        "target": "data",
        "method": "GET",
        "path": "/specializations",
        "authentication": "public",
        "tags": [
            "specializations"
        ],
        "summary": "List Specializations",
        "description": null,
        "deprecated": false,
        "pathParameters": [],
        "queryParameters": [
            "filter"
        ],
        "headerParameters": [],
        "cookieParameters": [],
        "requestBody": null,
        "responses": [
            {
                "status": 200,
                "success": true,
                "contents": [
                    {
                        "contentType": "application/json",
                        "schema": {
                            "type": "array",
                            "items": {
                                "$ref": "#/components/schemas/Specialization"
                            }
                        }
                    }
                ],
                "problemTypes": []
            },
            {
                "status": 400,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InvalidRequestProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:invalid-request"
                ]
            },
            {
                "status": 500,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InternalServerErrorProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:internal-server-error"
                ]
            }
        ],
        "query": {
            "parameters": [
                {
                    "name": "filter",
                    "required": false,
                    "description": "Structured specialization filters. Use bracket notation such as filter[programId]=1.",
                    "style": "deepObject",
                    "explode": true,
                    "schema": {
                        "additionalProperties": false,
                        "properties": {
                            "programId": {
                                "oneOf": [
                                    {
                                        "minimum": 1,
                                        "type": "integer"
                                    },
                                    {
                                        "additionalProperties": false,
                                        "properties": {
                                            "eq": {
                                                "minimum": 1,
                                                "type": "integer"
                                            },
                                            "in": {
                                                "items": {
                                                    "minimum": 1,
                                                    "type": "integer"
                                                },
                                                "type": "array"
                                            }
                                        },
                                        "type": "object"
                                    }
                                ]
                            },
                            "programCode": {
                                "oneOf": [
                                    {
                                        "minimum": 1,
                                        "type": "integer"
                                    },
                                    {
                                        "additionalProperties": false,
                                        "properties": {
                                            "eq": {
                                                "minimum": 1,
                                                "type": "integer"
                                            },
                                            "in": {
                                                "items": {
                                                    "minimum": 1,
                                                    "type": "integer"
                                                },
                                                "type": "array"
                                            }
                                        },
                                        "type": "object"
                                    }
                                ]
                            },
                            "code": {
                                "oneOf": [
                                    {
                                        "minLength": 1,
                                        "type": "string"
                                    },
                                    {
                                        "additionalProperties": false,
                                        "properties": {
                                            "eq": {
                                                "minLength": 1,
                                                "type": "string"
                                            },
                                            "ne": {
                                                "minLength": 1,
                                                "type": "string"
                                            },
                                            "in": {
                                                "items": {
                                                    "minLength": 1,
                                                    "type": "string"
                                                },
                                                "type": "array"
                                            }
                                        },
                                        "type": "object"
                                    }
                                ]
                            }
                        },
                        "type": "object"
                    }
                }
            ],
            "filter": {
                "version": 1,
                "fields": [
                    {
                        "path": [
                            "programId"
                        ],
                        "schema": {
                            "minimum": 1,
                            "type": "integer"
                        },
                        "operators": [
                            "eq",
                            "in"
                        ]
                    },
                    {
                        "path": [
                            "programCode"
                        ],
                        "schema": {
                            "minimum": 1,
                            "type": "integer"
                        },
                        "operators": [
                            "eq",
                            "in"
                        ]
                    },
                    {
                        "path": [
                            "code"
                        ],
                        "schema": {
                            "minLength": 1,
                            "type": "string"
                        },
                        "operators": [
                            "eq",
                            "ne",
                            "in"
                        ]
                    }
                ],
                "constraints": {
                    "maxExpressions": 20,
                    "maxDepth": 3,
                    "maxParameters": 100
                }
            }
        },
        "sdk": {
            "resource": "specializations",
            "action": "list",
            "pathParameters": {}
        },
        "pagination": null
    },
    "listStudyPeriods": {
        "operationId": "listStudyPeriods",
        "target": "data",
        "method": "GET",
        "path": "/study-periods",
        "authentication": "public",
        "tags": [
            "study-periods"
        ],
        "summary": "List StudyPeriods",
        "description": null,
        "deprecated": false,
        "pathParameters": [],
        "queryParameters": [
            "filter"
        ],
        "headerParameters": [],
        "cookieParameters": [],
        "requestBody": null,
        "responses": [
            {
                "status": 200,
                "success": true,
                "contents": [
                    {
                        "contentType": "application/json",
                        "schema": {
                            "type": "array",
                            "items": {
                                "$ref": "#/components/schemas/StudyPeriodEntity"
                            }
                        }
                    }
                ],
                "problemTypes": []
            },
            {
                "status": 400,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InvalidRequestProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:invalid-request"
                ]
            },
            {
                "status": 500,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InternalServerErrorProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:internal-server-error"
                ]
            }
        ],
        "query": {
            "parameters": [
                {
                    "name": "filter",
                    "required": false,
                    "description": "Structured study period filters. Use bracket notation such as filter[year]=2025.",
                    "style": "deepObject",
                    "explode": true,
                    "schema": {
                        "additionalProperties": false,
                        "properties": {
                            "id": {
                                "oneOf": [
                                    {
                                        "type": "integer"
                                    },
                                    {
                                        "additionalProperties": false,
                                        "properties": {
                                            "eq": {
                                                "type": "integer"
                                            },
                                            "in": {
                                                "items": {
                                                    "type": "integer"
                                                },
                                                "type": "array"
                                            }
                                        },
                                        "type": "object"
                                    }
                                ]
                            },
                            "year": {
                                "oneOf": [
                                    {
                                        "type": "integer"
                                    },
                                    {
                                        "additionalProperties": false,
                                        "properties": {
                                            "eq": {
                                                "type": "integer"
                                            },
                                            "in": {
                                                "items": {
                                                    "type": "integer"
                                                },
                                                "type": "array"
                                            }
                                        },
                                        "type": "object"
                                    }
                                ]
                            },
                            "yearPeriod": {
                                "oneOf": [
                                    {
                                        "enum": [
                                            "SUMMER",
                                            "FIRST_SEMESTER",
                                            "WINTER",
                                            "SECOND_SEMESTER"
                                        ],
                                        "type": "string"
                                    },
                                    {
                                        "additionalProperties": false,
                                        "properties": {
                                            "eq": {
                                                "enum": [
                                                    "SUMMER",
                                                    "FIRST_SEMESTER",
                                                    "WINTER",
                                                    "SECOND_SEMESTER"
                                                ],
                                                "type": "string"
                                            },
                                            "in": {
                                                "items": {
                                                    "enum": [
                                                        "SUMMER",
                                                        "FIRST_SEMESTER",
                                                        "WINTER",
                                                        "SECOND_SEMESTER"
                                                    ],
                                                    "type": "string"
                                                },
                                                "type": "array"
                                            }
                                        },
                                        "type": "object"
                                    }
                                ]
                            }
                        },
                        "type": "object"
                    }
                }
            ],
            "filter": {
                "version": 1,
                "fields": [
                    {
                        "path": [
                            "id"
                        ],
                        "schema": {
                            "type": "integer"
                        },
                        "operators": [
                            "eq",
                            "in"
                        ]
                    },
                    {
                        "path": [
                            "year"
                        ],
                        "schema": {
                            "type": "integer"
                        },
                        "operators": [
                            "eq",
                            "in"
                        ]
                    },
                    {
                        "path": [
                            "yearPeriod"
                        ],
                        "schema": {
                            "enum": [
                                "SUMMER",
                                "FIRST_SEMESTER",
                                "WINTER",
                                "SECOND_SEMESTER"
                            ],
                            "type": "string"
                        },
                        "operators": [
                            "eq",
                            "in"
                        ]
                    }
                ],
                "constraints": {
                    "maxExpressions": 20,
                    "maxDepth": 3,
                    "maxParameters": 100
                }
            }
        },
        "sdk": {
            "resource": "studyPeriods",
            "action": "list",
            "pathParameters": {}
        },
        "pagination": null
    },
    "listUnits": {
        "operationId": "listUnits",
        "target": "data",
        "method": "GET",
        "path": "/units",
        "authentication": "public",
        "tags": [
            "units"
        ],
        "summary": "List Units",
        "description": null,
        "deprecated": false,
        "pathParameters": [],
        "queryParameters": [
            "filter"
        ],
        "headerParameters": [],
        "cookieParameters": [],
        "requestBody": null,
        "responses": [
            {
                "status": 200,
                "success": true,
                "contents": [
                    {
                        "contentType": "application/json",
                        "schema": {
                            "type": "array",
                            "items": {
                                "$ref": "#/components/schemas/UnitEntity"
                            }
                        }
                    }
                ],
                "problemTypes": []
            },
            {
                "status": 400,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InvalidRequestProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:invalid-request"
                ]
            },
            {
                "status": 500,
                "success": false,
                "contents": [
                    {
                        "contentType": "application/problem+json",
                        "schema": {
                            "$ref": "#/components/schemas/InternalServerErrorProblem"
                        }
                    }
                ],
                "problemTypes": [
                    "urn:pomi:problem:internal-server-error"
                ]
            }
        ],
        "query": {
            "parameters": [
                {
                    "name": "filter",
                    "required": false,
                    "description": "Structured unit filters. Use bracket notation such as filter[code]=IC.",
                    "style": "deepObject",
                    "explode": true,
                    "schema": {
                        "additionalProperties": false,
                        "properties": {
                            "id": {
                                "oneOf": [
                                    {
                                        "type": "integer"
                                    },
                                    {
                                        "additionalProperties": false,
                                        "properties": {
                                            "eq": {
                                                "type": "integer"
                                            },
                                            "in": {
                                                "items": {
                                                    "type": "integer"
                                                },
                                                "type": "array"
                                            }
                                        },
                                        "type": "object"
                                    }
                                ]
                            },
                            "code": {
                                "oneOf": [
                                    {
                                        "minLength": 1,
                                        "type": "string"
                                    },
                                    {
                                        "additionalProperties": false,
                                        "properties": {
                                            "eq": {
                                                "minLength": 1,
                                                "type": "string"
                                            },
                                            "ne": {
                                                "minLength": 1,
                                                "type": "string"
                                            },
                                            "in": {
                                                "items": {
                                                    "minLength": 1,
                                                    "type": "string"
                                                },
                                                "type": "array"
                                            }
                                        },
                                        "type": "object"
                                    }
                                ]
                            },
                            "name": {
                                "oneOf": [
                                    {
                                        "minLength": 1,
                                        "type": "string"
                                    },
                                    {
                                        "additionalProperties": false,
                                        "properties": {
                                            "eq": {
                                                "minLength": 1,
                                                "type": "string"
                                            }
                                        },
                                        "type": "object"
                                    }
                                ]
                            }
                        },
                        "type": "object"
                    }
                }
            ],
            "filter": {
                "version": 1,
                "fields": [
                    {
                        "path": [
                            "id"
                        ],
                        "schema": {
                            "type": "integer"
                        },
                        "operators": [
                            "eq",
                            "in"
                        ]
                    },
                    {
                        "path": [
                            "code"
                        ],
                        "schema": {
                            "minLength": 1,
                            "type": "string"
                        },
                        "operators": [
                            "eq",
                            "ne",
                            "in"
                        ]
                    },
                    {
                        "path": [
                            "name"
                        ],
                        "schema": {
                            "minLength": 1,
                            "type": "string"
                        },
                        "operators": [
                            "eq"
                        ]
                    }
                ],
                "constraints": {
                    "maxExpressions": 20,
                    "maxDepth": 3,
                    "maxParameters": 100
                }
            }
        },
        "sdk": {
            "resource": "units",
            "action": "list",
            "pathParameters": {}
        },
        "pagination": null
    },
} as const satisfies Record<string, GeneratedOperationDefinition>

export type OperationName = keyof typeof operationDefinitions
