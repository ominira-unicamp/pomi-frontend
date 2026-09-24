import type { SortInput } from '../../runtime/sorting.js'
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
type SortQuery<Query, SortField extends string> = ParameterRecord<Query> extends infer Parameters
    ? Parameters extends { sort: unknown }
    ? Omit<Parameters, 'sort'> & { sort: SortInput<SortField> }
    : Omit<Parameters, 'sort'> & { sort?: SortInput<SortField> }
    : never
type OperationInput<Path, Query, Header, Body, BodyRequired extends boolean> =
    ParameterRecord<Path> & ParameterRecord<Query> & HeaderInput<Header> & BodyInput<Body, BodyRequired>

export type getCalendarEventsInput = OperationInput<operations["getCalendarEvents"]['parameters']['path'], operations["getCalendarEvents"]['parameters']['query'], operations["getCalendarEvents"]['parameters']['header'], RequestBodyOf<operations["getCalendarEvents"]>, false>
export type getCalendarEventsOutput = import('./domain.js').CalendarEvent
export type getCalendarEventsProblem = operations["getCalendarEvents"]['responses'][400]['content']["application/problem+json"] | operations["getCalendarEvents"]['responses'][404]['content']["application/problem+json"] | operations["getCalendarEvents"]['responses'][500]['content']["application/problem+json"]
export type getCalendarFeedInput = OperationInput<operations["getCalendarFeed"]['parameters']['path'], operations["getCalendarFeed"]['parameters']['query'], operations["getCalendarFeed"]['parameters']['header'], RequestBodyOf<operations["getCalendarFeed"]>, false>
export type getCalendarFeedOutput = operations["getCalendarFeed"]['responses'][200]['content']["text/calendar"]
export type getCalendarFeedProblem = operations["getCalendarFeed"]['responses'][400]['content']["application/problem+json"] | operations["getCalendarFeed"]['responses'][500]['content']["application/problem+json"]
export type getCalendarTagsInput = OperationInput<operations["getCalendarTags"]['parameters']['path'], operations["getCalendarTags"]['parameters']['query'], operations["getCalendarTags"]['parameters']['header'], RequestBodyOf<operations["getCalendarTags"]>, false>
export type getCalendarTagsOutput = import('./domain.js').CalendarTag
export type getCalendarTagsProblem = operations["getCalendarTags"]['responses'][400]['content']["application/problem+json"] | operations["getCalendarTags"]['responses'][404]['content']["application/problem+json"] | operations["getCalendarTags"]['responses'][500]['content']["application/problem+json"]
export type getCatalogCoursesInput = OperationInput<operations["getCatalogCourses"]['parameters']['path'], operations["getCatalogCourses"]['parameters']['query'], operations["getCatalogCourses"]['parameters']['header'], RequestBodyOf<operations["getCatalogCourses"]>, false>
export type getCatalogCoursesOutput = import('./domain.js').CatalogCourse
export type getCatalogCoursesProblem = operations["getCatalogCourses"]['responses'][400]['content']["application/problem+json"] | operations["getCatalogCourses"]['responses'][404]['content']["application/problem+json"] | operations["getCatalogCourses"]['responses'][500]['content']["application/problem+json"]
export type getCatalogProgramsInput = OperationInput<operations["getCatalogPrograms"]['parameters']['path'], operations["getCatalogPrograms"]['parameters']['query'], operations["getCatalogPrograms"]['parameters']['header'], RequestBodyOf<operations["getCatalogPrograms"]>, false>
export type getCatalogProgramsOutput = import('./domain.js').CatalogProgram
export type getCatalogProgramsProblem = operations["getCatalogPrograms"]['responses'][400]['content']["application/problem+json"] | operations["getCatalogPrograms"]['responses'][404]['content']["application/problem+json"] | operations["getCatalogPrograms"]['responses'][500]['content']["application/problem+json"]
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
export type getCourseProfessorEvaluationSummaryInput = OperationInput<operations["getCourseProfessorEvaluationSummary"]['parameters']['path'], operations["getCourseProfessorEvaluationSummary"]['parameters']['query'], operations["getCourseProfessorEvaluationSummary"]['parameters']['header'], RequestBodyOf<operations["getCourseProfessorEvaluationSummary"]>, false>
export type getCourseProfessorEvaluationSummaryOutput = import('./domain.js').CourseProfessorEvaluationSummary
export type getCourseProfessorEvaluationSummaryProblem = operations["getCourseProfessorEvaluationSummary"]['responses'][400]['content']["application/problem+json"] | operations["getCourseProfessorEvaluationSummary"]['responses'][404]['content']["application/problem+json"] | operations["getCourseProfessorEvaluationSummary"]['responses'][500]['content']["application/problem+json"]
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
export type listCalendarEventsInput = OperationInput<operations["listCalendarEvents"]['parameters']['path'], SortQuery<operations["listCalendarEvents"]['parameters']['query'], "startDate" | "endDate" | "description">, operations["listCalendarEvents"]['parameters']['header'], RequestBodyOf<operations["listCalendarEvents"]>, false>
export type listCalendarEventsOutput = import('./domain.js').Page<import('./domain.js').CalendarEvent>
export type listCalendarEventsProblem = operations["listCalendarEvents"]['responses'][400]['content']["application/problem+json"] | operations["listCalendarEvents"]['responses'][500]['content']["application/problem+json"]
export type listCalendarTagsInput = OperationInput<operations["listCalendarTags"]['parameters']['path'], SortQuery<operations["listCalendarTags"]['parameters']['query'], "name">, operations["listCalendarTags"]['parameters']['header'], RequestBodyOf<operations["listCalendarTags"]>, false>
export type listCalendarTagsOutput = import('./domain.js').Page<import('./domain.js').CalendarTag>
export type listCalendarTagsProblem = operations["listCalendarTags"]['responses'][400]['content']["application/problem+json"] | operations["listCalendarTags"]['responses'][500]['content']["application/problem+json"]
export type listCatalogCoursesInput = OperationInput<operations["listCatalogCourses"]['parameters']['path'], SortQuery<operations["listCatalogCourses"]['parameters']['query'], "catalogYear" | "code" | "name" | "credits">, operations["listCatalogCourses"]['parameters']['header'], RequestBodyOf<operations["listCatalogCourses"]>, false>
export type listCatalogCoursesOutput = import('./domain.js').Page<import('./domain.js').CatalogCourse>
export type listCatalogCoursesProblem = operations["listCatalogCourses"]['responses'][400]['content']["application/problem+json"] | operations["listCatalogCourses"]['responses'][500]['content']["application/problem+json"]
export type listCatalogProgramsInput = OperationInput<operations["listCatalogPrograms"]['parameters']['path'], SortQuery<operations["listCatalogPrograms"]['parameters']['query'], "id" | "catalogYear" | "programCode" | "programName" | "title">, operations["listCatalogPrograms"]['parameters']['header'], RequestBodyOf<operations["listCatalogPrograms"]>, false>
export type listCatalogProgramsOutput = import('./domain.js').Page<import('./domain.js').CatalogProgram>
export type listCatalogProgramsProblem = operations["listCatalogPrograms"]['responses'][400]['content']["application/problem+json"] | operations["listCatalogPrograms"]['responses'][500]['content']["application/problem+json"]
export type listCatalogsInput = OperationInput<operations["listCatalogs"]['parameters']['path'], SortQuery<operations["listCatalogs"]['parameters']['query'], "year">, operations["listCatalogs"]['parameters']['header'], RequestBodyOf<operations["listCatalogs"]>, false>
export type listCatalogsOutput = import('./domain.js').Page<import('./domain.js').Catalog>
export type listCatalogsProblem = operations["listCatalogs"]['responses'][400]['content']["application/problem+json"] | operations["listCatalogs"]['responses'][500]['content']["application/problem+json"]
export type listClassesInput = OperationInput<operations["listClasses"]['parameters']['path'], SortQuery<operations["listClasses"]['parameters']['query'], "id" | "classCode" | "courseCode" | "studyPeriodYear">, operations["listClasses"]['parameters']['header'], RequestBodyOf<operations["listClasses"]>, false>
export type listClassesOutput = import('./domain.js').Page<import('./domain.js').Class>
export type listClassesProblem = operations["listClasses"]['responses'][400]['content']["application/problem+json"] | operations["listClasses"]['responses'][500]['content']["application/problem+json"]
export type listClassSchedulesInput = OperationInput<operations["listClassSchedules"]['parameters']['path'], SortQuery<operations["listClassSchedules"]['parameters']['query'], "id" | "dayOfWeek" | "start" | "end" | "roomCode" | "classCode" | "courseCode" | "studyPeriodYear">, operations["listClassSchedules"]['parameters']['header'], RequestBodyOf<operations["listClassSchedules"]>, false>
export type listClassSchedulesOutput = import('./domain.js').Page<import('./domain.js').ClassSchedule>
export type listClassSchedulesProblem = operations["listClassSchedules"]['responses'][400]['content']["application/problem+json"] | operations["listClassSchedules"]['responses'][500]['content']["application/problem+json"]
export type listCoauthorsInput = OperationInput<operations["listCoauthors"]['parameters']['path'], SortQuery<operations["listCoauthors"]['parameters']['query'], "name">, operations["listCoauthors"]['parameters']['header'], RequestBodyOf<operations["listCoauthors"]>, false>
export type listCoauthorsOutput = import('./domain.js').Page<import('./domain.js').Coauthor>
export type listCoauthorsProblem = operations["listCoauthors"]['responses'][400]['content']["application/problem+json"] | operations["listCoauthors"]['responses'][500]['content']["application/problem+json"]
export type listCoordinatorsInput = OperationInput<operations["listCoordinators"]['parameters']['path'], SortQuery<operations["listCoordinators"]['parameters']['query'], "name">, operations["listCoordinators"]['parameters']['header'], RequestBodyOf<operations["listCoordinators"]>, false>
export type listCoordinatorsOutput = import('./domain.js').Page<import('./domain.js').Coordinator>
export type listCoordinatorsProblem = operations["listCoordinators"]['responses'][400]['content']["application/problem+json"] | operations["listCoordinators"]['responses'][500]['content']["application/problem+json"]
export type listCourseEvaluationSummariesInput = OperationInput<operations["listCourseEvaluationSummaries"]['parameters']['path'], SortQuery<operations["listCourseEvaluationSummaries"]['parameters']['query'], "course.code" | "course.name" | "responseCount" | "wouldTakeAgain" | "fairness" | "clarity" | "difficulty">, operations["listCourseEvaluationSummaries"]['parameters']['header'], RequestBodyOf<operations["listCourseEvaluationSummaries"]>, false>
export type listCourseEvaluationSummariesOutput = import('./domain.js').Page<import('./domain.js').CourseEvaluationSummary>
export type listCourseEvaluationSummariesProblem = operations["listCourseEvaluationSummaries"]['responses'][400]['content']["application/problem+json"] | operations["listCourseEvaluationSummaries"]['responses'][500]['content']["application/problem+json"]
export type listCoursesInput = OperationInput<operations["listCourses"]['parameters']['path'], SortQuery<operations["listCourses"]['parameters']['query'], "code" | "name" | "credits" | "unitCode">, operations["listCourses"]['parameters']['header'], RequestBodyOf<operations["listCourses"]>, false>
export type listCoursesOutput = import('./domain.js').Page<import('./domain.js').Course>
export type listCoursesProblem = operations["listCourses"]['responses'][400]['content']["application/problem+json"] | operations["listCourses"]['responses'][500]['content']["application/problem+json"]
export type listCurriculumSuggestionsInput = OperationInput<operations["listCurriculumSuggestions"]['parameters']['path'], SortQuery<operations["listCurriculumSuggestions"]['parameters']['query'], "catalogYear" | "programCode" | "programName" | "specializationCode">, operations["listCurriculumSuggestions"]['parameters']['header'], RequestBodyOf<operations["listCurriculumSuggestions"]>, false>
export type listCurriculumSuggestionsOutput = import('./domain.js').Page<import('./domain.js').CurriculumSuggestion>
export type listCurriculumSuggestionsProblem = operations["listCurriculumSuggestions"]['responses'][400]['content']["application/problem+json"] | operations["listCurriculumSuggestions"]['responses'][500]['content']["application/problem+json"]
export type listDailyMenusInput = OperationInput<operations["listDailyMenus"]['parameters']['path'], SortQuery<operations["listDailyMenus"]['parameters']['query'], "date" | "createdAt" | "updatedAt">, operations["listDailyMenus"]['parameters']['header'], RequestBodyOf<operations["listDailyMenus"]>, false>
export type listDailyMenusOutput = import('./domain.js').Page<import('./domain.js').DailyMenu>
export type listDailyMenusProblem = operations["listDailyMenus"]['responses'][400]['content']["application/problem+json"] | operations["listDailyMenus"]['responses'][500]['content']["application/problem+json"]
export type listDepartmentsInput = OperationInput<operations["listDepartments"]['parameters']['path'], SortQuery<operations["listDepartments"]['parameters']['query'], "name">, operations["listDepartments"]['parameters']['header'], RequestBodyOf<operations["listDepartments"]>, false>
export type listDepartmentsOutput = import('./domain.js').Page<import('./domain.js').Department>
export type listDepartmentsProblem = operations["listDepartments"]['responses'][400]['content']["application/problem+json"] | operations["listDepartments"]['responses'][500]['content']["application/problem+json"]
export type listExchangeNoticesInput = OperationInput<operations["listExchangeNotices"]['parameters']['path'], SortQuery<operations["listExchangeNotices"]['parameters']['query'], "registrationEnd" | "registrationStart" | "number" | "issuer" | "title" | "place.name">, operations["listExchangeNotices"]['parameters']['header'], RequestBodyOf<operations["listExchangeNotices"]>, false>
export type listExchangeNoticesOutput = import('./domain.js').Page<import('./domain.js').ExchangeNotice>
export type listExchangeNoticesProblem = operations["listExchangeNotices"]['responses'][400]['content']["application/problem+json"] | operations["listExchangeNotices"]['responses'][500]['content']["application/problem+json"]
export type listExchangePlacesInput = OperationInput<operations["listExchangePlaces"]['parameters']['path'], SortQuery<operations["listExchangePlaces"]['parameters']['query'], "name">, operations["listExchangePlaces"]['parameters']['header'], RequestBodyOf<operations["listExchangePlaces"]>, false>
export type listExchangePlacesOutput = import('./domain.js').Page<import('./domain.js').ExchangePlaceListItem>
export type listExchangePlacesProblem = operations["listExchangePlaces"]['responses'][400]['content']["application/problem+json"] | operations["listExchangePlaces"]['responses'][500]['content']["application/problem+json"]
export type listKeywordsInput = OperationInput<operations["listKeywords"]['parameters']['path'], SortQuery<operations["listKeywords"]['parameters']['query'], "name">, operations["listKeywords"]['parameters']['header'], RequestBodyOf<operations["listKeywords"]>, false>
export type listKeywordsOutput = import('./domain.js').Page<import('./domain.js').Keyword>
export type listKeywordsProblem = operations["listKeywords"]['responses'][400]['content']["application/problem+json"] | operations["listKeywords"]['responses'][500]['content']["application/problem+json"]
export type listLanguagesInput = OperationInput<operations["listLanguages"]['parameters']['path'], SortQuery<operations["listLanguages"]['parameters']['query'], "name">, operations["listLanguages"]['parameters']['header'], RequestBodyOf<operations["listLanguages"]>, false>
export type listLanguagesOutput = import('./domain.js').Page<import('./domain.js').Language>
export type listLanguagesProblem = operations["listLanguages"]['responses'][400]['content']["application/problem+json"] | operations["listLanguages"]['responses'][500]['content']["application/problem+json"]
export type listProfessorDataPortalProfilesInput = OperationInput<operations["listProfessorDataPortalProfiles"]['parameters']['path'], SortQuery<operations["listProfessorDataPortalProfiles"]['parameters']['query'], "name">, operations["listProfessorDataPortalProfiles"]['parameters']['header'], RequestBodyOf<operations["listProfessorDataPortalProfiles"]>, false>
export type listProfessorDataPortalProfilesOutput = import('./domain.js').Page<import('./domain.js').ProfessorDataPortalProfileSummary>
export type listProfessorDataPortalProfilesProblem = operations["listProfessorDataPortalProfiles"]['responses'][400]['content']["application/problem+json"] | operations["listProfessorDataPortalProfiles"]['responses'][500]['content']["application/problem+json"]
export type listProfessorEvaluationSummariesInput = OperationInput<operations["listProfessorEvaluationSummaries"]['parameters']['path'], SortQuery<operations["listProfessorEvaluationSummaries"]['parameters']['query'], "professor.name" | "responseCount" | "wouldTakeAgain" | "fairness" | "clarity" | "difficulty">, operations["listProfessorEvaluationSummaries"]['parameters']['header'], RequestBodyOf<operations["listProfessorEvaluationSummaries"]>, false>
export type listProfessorEvaluationSummariesOutput = import('./domain.js').Page<import('./domain.js').ProfessorEvaluationSummary>
export type listProfessorEvaluationSummariesProblem = operations["listProfessorEvaluationSummaries"]['responses'][400]['content']["application/problem+json"] | operations["listProfessorEvaluationSummaries"]['responses'][500]['content']["application/problem+json"]
export type listProfessorPositionsInput = OperationInput<operations["listProfessorPositions"]['parameters']['path'], SortQuery<operations["listProfessorPositions"]['parameters']['query'], "canonicalKey" | "role">, operations["listProfessorPositions"]['parameters']['header'], RequestBodyOf<operations["listProfessorPositions"]>, false>
export type listProfessorPositionsOutput = import('./domain.js').Page<import('./domain.js').ProfessorPosition>
export type listProfessorPositionsProblem = operations["listProfessorPositions"]['responses'][400]['content']["application/problem+json"] | operations["listProfessorPositions"]['responses'][500]['content']["application/problem+json"]
export type listProfessorsInput = OperationInput<operations["listProfessors"]['parameters']['path'], SortQuery<operations["listProfessors"]['parameters']['query'], "name">, operations["listProfessors"]['parameters']['header'], RequestBodyOf<operations["listProfessors"]>, false>
export type listProfessorsOutput = import('./domain.js').Page<import('./domain.js').Professor>
export type listProfessorsProblem = operations["listProfessors"]['responses'][400]['content']["application/problem+json"] | operations["listProfessors"]['responses'][500]['content']["application/problem+json"]
export type listProgramsInput = OperationInput<operations["listPrograms"]['parameters']['path'], SortQuery<operations["listPrograms"]['parameters']['query'], "code" | "name" | "unitCode">, operations["listPrograms"]['parameters']['header'], RequestBodyOf<operations["listPrograms"]>, false>
export type listProgramsOutput = import('./domain.js').Page<import('./domain.js').Program>
export type listProgramsProblem = operations["listPrograms"]['responses'][400]['content']["application/problem+json"] | operations["listPrograms"]['responses'][500]['content']["application/problem+json"]
export type listRoomsInput = OperationInput<operations["listRooms"]['parameters']['path'], SortQuery<operations["listRooms"]['parameters']['query'], "code">, operations["listRooms"]['parameters']['header'], RequestBodyOf<operations["listRooms"]>, false>
export type listRoomsOutput = import('./domain.js').Page<import('./domain.js').Room>
export type listRoomsProblem = operations["listRooms"]['responses'][400]['content']["application/problem+json"] | operations["listRooms"]['responses'][500]['content']["application/problem+json"]
export type listSpecializationsInput = OperationInput<operations["listSpecializations"]['parameters']['path'], SortQuery<operations["listSpecializations"]['parameters']['query'], "programCode" | "programName" | "code" | "name">, operations["listSpecializations"]['parameters']['header'], RequestBodyOf<operations["listSpecializations"]>, false>
export type listSpecializationsOutput = import('./domain.js').Page<import('./domain.js').Specialization>
export type listSpecializationsProblem = operations["listSpecializations"]['responses'][400]['content']["application/problem+json"] | operations["listSpecializations"]['responses'][500]['content']["application/problem+json"]
export type listStudyPeriodsInput = OperationInput<operations["listStudyPeriods"]['parameters']['path'], SortQuery<operations["listStudyPeriods"]['parameters']['query'], "id" | "year" | "yearPeriod" | "startDate">, operations["listStudyPeriods"]['parameters']['header'], RequestBodyOf<operations["listStudyPeriods"]>, false>
export type listStudyPeriodsOutput = import('./domain.js').Page<import('./domain.js').StudyPeriod>
export type listStudyPeriodsProblem = operations["listStudyPeriods"]['responses'][400]['content']["application/problem+json"] | operations["listStudyPeriods"]['responses'][500]['content']["application/problem+json"]
export type listUnitsInput = OperationInput<operations["listUnits"]['parameters']['path'], SortQuery<operations["listUnits"]['parameters']['query'], "code" | "name">, operations["listUnits"]['parameters']['header'], RequestBodyOf<operations["listUnits"]>, false>
export type listUnitsOutput = import('./domain.js').Page<import('./domain.js').Unit>
export type listUnitsProblem = operations["listUnits"]['responses'][400]['content']["application/problem+json"] | operations["listUnits"]['responses'][500]['content']["application/problem+json"]

export interface OperationInputs {
    getCalendarEvents: getCalendarEventsInput
    getCalendarFeed: getCalendarFeedInput
    getCalendarTags: getCalendarTagsInput
    getCatalogCourses: getCatalogCoursesInput
    getCatalogPrograms: getCatalogProgramsInput
    getCatalogs: getCatalogsInput
    getClasses: getClassesInput
    getClassSchedules: getClassSchedulesInput
    getCoauthors: getCoauthorsInput
    getCoordinators: getCoordinatorsInput
    getCourseProfessorEvaluationSummary: getCourseProfessorEvaluationSummaryInput
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
    listCalendarEvents: listCalendarEventsInput
    listCalendarTags: listCalendarTagsInput
    listCatalogCourses: listCatalogCoursesInput
    listCatalogPrograms: listCatalogProgramsInput
    listCatalogs: listCatalogsInput
    listClasses: listClassesInput
    listClassSchedules: listClassSchedulesInput
    listCoauthors: listCoauthorsInput
    listCoordinators: listCoordinatorsInput
    listCourseEvaluationSummaries: listCourseEvaluationSummariesInput
    listCourses: listCoursesInput
    listCurriculumSuggestions: listCurriculumSuggestionsInput
    listDailyMenus: listDailyMenusInput
    listDepartments: listDepartmentsInput
    listExchangeNotices: listExchangeNoticesInput
    listExchangePlaces: listExchangePlacesInput
    listKeywords: listKeywordsInput
    listLanguages: listLanguagesInput
    listProfessorDataPortalProfiles: listProfessorDataPortalProfilesInput
    listProfessorEvaluationSummaries: listProfessorEvaluationSummariesInput
    listProfessorPositions: listProfessorPositionsInput
    listProfessors: listProfessorsInput
    listPrograms: listProgramsInput
    listRooms: listRoomsInput
    listSpecializations: listSpecializationsInput
    listStudyPeriods: listStudyPeriodsInput
    listUnits: listUnitsInput
}

export interface OperationOutputs {
    getCalendarEvents: getCalendarEventsOutput
    getCalendarFeed: getCalendarFeedOutput
    getCalendarTags: getCalendarTagsOutput
    getCatalogCourses: getCatalogCoursesOutput
    getCatalogPrograms: getCatalogProgramsOutput
    getCatalogs: getCatalogsOutput
    getClasses: getClassesOutput
    getClassSchedules: getClassSchedulesOutput
    getCoauthors: getCoauthorsOutput
    getCoordinators: getCoordinatorsOutput
    getCourseProfessorEvaluationSummary: getCourseProfessorEvaluationSummaryOutput
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
    listCalendarEvents: listCalendarEventsOutput
    listCalendarTags: listCalendarTagsOutput
    listCatalogCourses: listCatalogCoursesOutput
    listCatalogPrograms: listCatalogProgramsOutput
    listCatalogs: listCatalogsOutput
    listClasses: listClassesOutput
    listClassSchedules: listClassSchedulesOutput
    listCoauthors: listCoauthorsOutput
    listCoordinators: listCoordinatorsOutput
    listCourseEvaluationSummaries: listCourseEvaluationSummariesOutput
    listCourses: listCoursesOutput
    listCurriculumSuggestions: listCurriculumSuggestionsOutput
    listDailyMenus: listDailyMenusOutput
    listDepartments: listDepartmentsOutput
    listExchangeNotices: listExchangeNoticesOutput
    listExchangePlaces: listExchangePlacesOutput
    listKeywords: listKeywordsOutput
    listLanguages: listLanguagesOutput
    listProfessorDataPortalProfiles: listProfessorDataPortalProfilesOutput
    listProfessorEvaluationSummaries: listProfessorEvaluationSummariesOutput
    listProfessorPositions: listProfessorPositionsOutput
    listProfessors: listProfessorsOutput
    listPrograms: listProgramsOutput
    listRooms: listRoomsOutput
    listSpecializations: listSpecializationsOutput
    listStudyPeriods: listStudyPeriodsOutput
    listUnits: listUnitsOutput
}

export interface OperationProblems {
    getCalendarEvents: getCalendarEventsProblem
    getCalendarFeed: getCalendarFeedProblem
    getCalendarTags: getCalendarTagsProblem
    getCatalogCourses: getCatalogCoursesProblem
    getCatalogPrograms: getCatalogProgramsProblem
    getCatalogs: getCatalogsProblem
    getClasses: getClassesProblem
    getClassSchedules: getClassSchedulesProblem
    getCoauthors: getCoauthorsProblem
    getCoordinators: getCoordinatorsProblem
    getCourseProfessorEvaluationSummary: getCourseProfessorEvaluationSummaryProblem
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
    listCalendarEvents: listCalendarEventsProblem
    listCalendarTags: listCalendarTagsProblem
    listCatalogCourses: listCatalogCoursesProblem
    listCatalogPrograms: listCatalogProgramsProblem
    listCatalogs: listCatalogsProblem
    listClasses: listClassesProblem
    listClassSchedules: listClassSchedulesProblem
    listCoauthors: listCoauthorsProblem
    listCoordinators: listCoordinatorsProblem
    listCourseEvaluationSummaries: listCourseEvaluationSummariesProblem
    listCourses: listCoursesProblem
    listCurriculumSuggestions: listCurriculumSuggestionsProblem
    listDailyMenus: listDailyMenusProblem
    listDepartments: listDepartmentsProblem
    listExchangeNotices: listExchangeNoticesProblem
    listExchangePlaces: listExchangePlacesProblem
    listKeywords: listKeywordsProblem
    listLanguages: listLanguagesProblem
    listProfessorDataPortalProfiles: listProfessorDataPortalProfilesProblem
    listProfessorEvaluationSummaries: listProfessorEvaluationSummariesProblem
    listProfessorPositions: listProfessorPositionsProblem
    listProfessors: listProfessorsProblem
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
            "method": "get",
            "action": "get",
            "pathParameters": {
                "id": "calendarEventId"
            }
        },
        "pagination": null
    },
    "getCalendarFeed": {
        "operationId": "getCalendarFeed",
        "target": "data",
        "method": "GET",
        "path": "/calendar",
        "authentication": "public",
        "tags": [
            "calendar"
        ],
        "summary": "Get public iCalendar feed",
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
            "parameters": [
                {
                    "name": "filter",
                    "required": false,
                    "description": "Structured calendar feed filters. Use bracket notation such as filter[tagId]=1.",
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
            "resource": "calendar",
            "method": "getFeed",
            "action": "get"
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
            "method": "get",
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
            "method": "get",
            "action": "get",
            "pathParameters": {
                "id": "catalogCourseId"
            }
        },
        "pagination": null
    },
    "getCatalogPrograms": {
        "operationId": "getCatalogPrograms",
        "target": "data",
        "method": "GET",
        "path": "/catalog-program/{id}",
        "authentication": "public",
        "tags": [
            "catalog-program"
        ],
        "summary": "Get CatalogPrograms",
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
            "resource": "catalogPrograms",
            "method": "get",
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
            "method": "get",
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
            "method": "get",
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
            "method": "get",
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
            "method": "get",
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
            "method": "get",
            "action": "get",
            "pathParameters": {
                "id": "coordinatorId"
            }
        },
        "pagination": null
    },
    "getCourseProfessorEvaluationSummary": {
        "operationId": "getCourseProfessorEvaluationSummary",
        "target": "data",
        "method": "GET",
        "path": "/evaluation-summaries",
        "authentication": "public",
        "tags": [
            "evaluation-summaries"
        ],
        "summary": "Get CourseProfessorEvaluationSummary",
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
            "method": "getByCourseAndProfessor",
            "action": "get"
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
            "method": "get",
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
            "method": "get",
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
            "method": "get",
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
            "method": "get",
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
            "method": "get",
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
            "method": "get",
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
            "method": "get",
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
            "method": "get",
            "action": "get",
            "pathParameters": {
                "id": "profileId"
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
            "method": "get",
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
            "method": "get",
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
            "method": "get",
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
            "method": "get",
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
            "method": "get",
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
            "method": "get",
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
            "method": "get",
            "action": "get",
            "pathParameters": {
                "id": "unitId"
            }
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
            "page",
            "pageSize",
            "filter",
            "sort"
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
                                        "$ref": "#/components/schemas/CalendarEvent"
                                    }
                                },
                                "quantity": {
                                    "type": "integer"
                                },
                                "total": {
                                    "type": "integer"
                                },
                                "links": {
                                    "$ref": "#/components/schemas/PaginationLinks"
                                }
                            },
                            "required": [
                                "data",
                                "quantity",
                                "total",
                                "links"
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
                    "description": "Page number. The first page is 1.",
                    "style": null,
                    "explode": null,
                    "schema": {
                        "type": "integer",
                        "minimum": 1,
                        "description": "Page number. The first page is 1."
                    }
                },
                {
                    "name": "pageSize",
                    "required": false,
                    "description": "Number of items per page, or \"all\" to return every item.",
                    "style": null,
                    "explode": null,
                    "schema": {
                        "anyOf": [
                            {
                                "type": "integer",
                                "minimum": 1
                            },
                            {
                                "type": "string",
                                "enum": [
                                    "all"
                                ]
                            }
                        ],
                        "description": "Number of items per page, or \"all\" to return every item."
                    }
                },
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
                },
                {
                    "name": "sort",
                    "required": false,
                    "description": "Ordered comma-separated field:direction terms. Earlier terms have higher priority.",
                    "style": "form",
                    "explode": false,
                    "schema": {
                        "type": "string",
                        "description": "Ordered comma-separated field:direction terms. Earlier terms have higher priority.",
                        "example": "startDate:asc,endDate:asc"
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
            },
            "sort": {
                "version": 1,
                "fields": [
                    "startDate",
                    "endDate",
                    "description"
                ],
                "default": "startDate:asc,endDate:asc"
            }
        },
        "sdk": {
            "resource": "calendarEvents",
            "method": "list",
            "action": "list"
        },
        "pagination": {
            "defaultMode": "all",
            "defaultPageSize": 20,
            "allowAll": true
        }
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
            "page",
            "pageSize",
            "filter",
            "sort"
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
                                        "$ref": "#/components/schemas/CalendarTag"
                                    }
                                },
                                "quantity": {
                                    "type": "integer"
                                },
                                "total": {
                                    "type": "integer"
                                },
                                "links": {
                                    "$ref": "#/components/schemas/PaginationLinks"
                                }
                            },
                            "required": [
                                "data",
                                "quantity",
                                "total",
                                "links"
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
                    "description": "Page number. The first page is 1.",
                    "style": null,
                    "explode": null,
                    "schema": {
                        "type": "integer",
                        "minimum": 1,
                        "description": "Page number. The first page is 1."
                    }
                },
                {
                    "name": "pageSize",
                    "required": false,
                    "description": "Number of items per page, or \"all\" to return every item.",
                    "style": null,
                    "explode": null,
                    "schema": {
                        "anyOf": [
                            {
                                "type": "integer",
                                "minimum": 1
                            },
                            {
                                "type": "string",
                                "enum": [
                                    "all"
                                ]
                            }
                        ],
                        "description": "Number of items per page, or \"all\" to return every item."
                    }
                },
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
                },
                {
                    "name": "sort",
                    "required": false,
                    "description": "Ordered comma-separated field:direction terms. Earlier terms have higher priority.",
                    "style": "form",
                    "explode": false,
                    "schema": {
                        "type": "string",
                        "description": "Ordered comma-separated field:direction terms. Earlier terms have higher priority.",
                        "example": "name:asc"
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
            },
            "sort": {
                "version": 1,
                "fields": [
                    "name"
                ],
                "default": "name:asc"
            }
        },
        "sdk": {
            "resource": "calendarTags",
            "method": "list",
            "action": "list"
        },
        "pagination": {
            "defaultMode": "all",
            "defaultPageSize": 20,
            "allowAll": true
        }
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
            "filter",
            "sort"
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
                                "links": {
                                    "$ref": "#/components/schemas/PaginationLinks"
                                }
                            },
                            "required": [
                                "data",
                                "quantity",
                                "total",
                                "links"
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
                    "description": "Page number. The first page is 1.",
                    "style": null,
                    "explode": null,
                    "schema": {
                        "type": "integer",
                        "minimum": 1,
                        "description": "Page number. The first page is 1."
                    }
                },
                {
                    "name": "pageSize",
                    "required": false,
                    "description": "Number of items per page, or \"all\" to return every item.",
                    "style": null,
                    "explode": null,
                    "schema": {
                        "anyOf": [
                            {
                                "type": "integer",
                                "minimum": 1
                            },
                            {
                                "type": "string",
                                "enum": [
                                    "all"
                                ]
                            }
                        ],
                        "description": "Number of items per page, or \"all\" to return every item."
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
                },
                {
                    "name": "sort",
                    "required": false,
                    "description": "Ordered comma-separated field:direction terms. Earlier terms have higher priority.",
                    "style": "form",
                    "explode": false,
                    "schema": {
                        "type": "string",
                        "description": "Ordered comma-separated field:direction terms. Earlier terms have higher priority.",
                        "example": "catalogYear:desc,code:asc"
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
            },
            "sort": {
                "version": 1,
                "fields": [
                    "catalogYear",
                    "code",
                    "name",
                    "credits"
                ],
                "default": "catalogYear:desc,code:asc"
            }
        },
        "sdk": {
            "resource": "catalogCourses",
            "method": "list",
            "action": "list"
        },
        "pagination": {
            "defaultMode": "all",
            "defaultPageSize": 20,
            "allowAll": true
        }
    },
    "listCatalogPrograms": {
        "operationId": "listCatalogPrograms",
        "target": "data",
        "method": "GET",
        "path": "/catalog-program",
        "authentication": "public",
        "tags": [
            "catalog-program"
        ],
        "summary": "List CatalogPrograms",
        "description": null,
        "deprecated": false,
        "pathParameters": [],
        "queryParameters": [
            "page",
            "pageSize",
            "filter",
            "sort"
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
                                        "$ref": "#/components/schemas/CatalogProgramEntity"
                                    }
                                },
                                "quantity": {
                                    "type": "integer"
                                },
                                "total": {
                                    "type": "integer"
                                },
                                "links": {
                                    "$ref": "#/components/schemas/PaginationLinks"
                                }
                            },
                            "required": [
                                "data",
                                "quantity",
                                "total",
                                "links"
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
                    "description": "Page number. The first page is 1.",
                    "style": null,
                    "explode": null,
                    "schema": {
                        "type": "integer",
                        "minimum": 1,
                        "description": "Page number. The first page is 1."
                    }
                },
                {
                    "name": "pageSize",
                    "required": false,
                    "description": "Number of items per page, or \"all\" to return every item.",
                    "style": null,
                    "explode": null,
                    "schema": {
                        "anyOf": [
                            {
                                "type": "integer",
                                "minimum": 1
                            },
                            {
                                "type": "string",
                                "enum": [
                                    "all"
                                ]
                            }
                        ],
                        "description": "Number of items per page, or \"all\" to return every item."
                    }
                },
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
                },
                {
                    "name": "sort",
                    "required": false,
                    "description": "Ordered comma-separated field:direction terms. Earlier terms have higher priority.",
                    "style": "form",
                    "explode": false,
                    "schema": {
                        "type": "string",
                        "description": "Ordered comma-separated field:direction terms. Earlier terms have higher priority.",
                        "example": "id:asc"
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
            },
            "sort": {
                "version": 1,
                "fields": [
                    "id",
                    "catalogYear",
                    "programCode",
                    "programName",
                    "title"
                ],
                "default": "id:asc"
            }
        },
        "sdk": {
            "resource": "catalogPrograms",
            "method": "list",
            "action": "list"
        },
        "pagination": {
            "defaultMode": "all",
            "defaultPageSize": 20,
            "allowAll": true
        }
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
            "page",
            "pageSize",
            "filter",
            "sort"
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
                                        "$ref": "#/components/schemas/Catalog"
                                    }
                                },
                                "quantity": {
                                    "type": "integer"
                                },
                                "total": {
                                    "type": "integer"
                                },
                                "links": {
                                    "$ref": "#/components/schemas/PaginationLinks"
                                }
                            },
                            "required": [
                                "data",
                                "quantity",
                                "total",
                                "links"
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
                    "description": "Page number. The first page is 1.",
                    "style": null,
                    "explode": null,
                    "schema": {
                        "type": "integer",
                        "minimum": 1,
                        "description": "Page number. The first page is 1."
                    }
                },
                {
                    "name": "pageSize",
                    "required": false,
                    "description": "Number of items per page, or \"all\" to return every item.",
                    "style": null,
                    "explode": null,
                    "schema": {
                        "anyOf": [
                            {
                                "type": "integer",
                                "minimum": 1
                            },
                            {
                                "type": "string",
                                "enum": [
                                    "all"
                                ]
                            }
                        ],
                        "description": "Number of items per page, or \"all\" to return every item."
                    }
                },
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
                },
                {
                    "name": "sort",
                    "required": false,
                    "description": "Ordered comma-separated field:direction terms. Earlier terms have higher priority.",
                    "style": "form",
                    "explode": false,
                    "schema": {
                        "type": "string",
                        "description": "Ordered comma-separated field:direction terms. Earlier terms have higher priority.",
                        "example": "year:desc"
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
            },
            "sort": {
                "version": 1,
                "fields": [
                    "year"
                ],
                "default": "year:desc"
            }
        },
        "sdk": {
            "resource": "catalogs",
            "method": "list",
            "action": "list"
        },
        "pagination": {
            "defaultMode": "all",
            "defaultPageSize": 20,
            "allowAll": true
        }
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
            "filter",
            "sort"
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
                                "links": {
                                    "$ref": "#/components/schemas/PaginationLinks"
                                }
                            },
                            "required": [
                                "data",
                                "quantity",
                                "total",
                                "links"
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
                    "description": "Page number. The first page is 1.",
                    "style": null,
                    "explode": null,
                    "schema": {
                        "type": "integer",
                        "minimum": 1,
                        "default": 1,
                        "description": "Page number. The first page is 1."
                    }
                },
                {
                    "name": "pageSize",
                    "required": false,
                    "description": "Number of items per page.",
                    "style": null,
                    "explode": null,
                    "schema": {
                        "type": "integer",
                        "minimum": 1,
                        "default": 20,
                        "description": "Number of items per page."
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
                },
                {
                    "name": "sort",
                    "required": false,
                    "description": "Ordered comma-separated field:direction terms. Earlier terms have higher priority.",
                    "style": "form",
                    "explode": false,
                    "schema": {
                        "type": "string",
                        "description": "Ordered comma-separated field:direction terms. Earlier terms have higher priority.",
                        "example": "id:asc"
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
            },
            "sort": {
                "version": 1,
                "fields": [
                    "id",
                    "classCode",
                    "courseCode",
                    "studyPeriodYear"
                ],
                "default": "id:asc"
            }
        },
        "sdk": {
            "resource": "classes",
            "method": "list",
            "action": "list"
        },
        "pagination": {
            "defaultMode": "page",
            "defaultPageSize": 20,
            "allowAll": false
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
            "filter",
            "sort"
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
                    "description": "Page number. The first page is 1.",
                    "style": null,
                    "explode": null,
                    "schema": {
                        "type": "integer",
                        "minimum": 1,
                        "default": 1,
                        "description": "Page number. The first page is 1."
                    }
                },
                {
                    "name": "pageSize",
                    "required": false,
                    "description": "Number of items per page.",
                    "style": null,
                    "explode": null,
                    "schema": {
                        "type": "integer",
                        "minimum": 1,
                        "default": 20,
                        "description": "Number of items per page."
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
                },
                {
                    "name": "sort",
                    "required": false,
                    "description": "Ordered comma-separated field:direction terms. Earlier terms have higher priority.",
                    "style": "form",
                    "explode": false,
                    "schema": {
                        "type": "string",
                        "description": "Ordered comma-separated field:direction terms. Earlier terms have higher priority.",
                        "example": "id:asc"
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
            },
            "sort": {
                "version": 1,
                "fields": [
                    "id",
                    "dayOfWeek",
                    "start",
                    "end",
                    "roomCode",
                    "classCode",
                    "courseCode",
                    "studyPeriodYear"
                ],
                "default": "id:asc"
            }
        },
        "sdk": {
            "resource": "classSchedules",
            "method": "list",
            "action": "list"
        },
        "pagination": {
            "defaultMode": "page",
            "defaultPageSize": 20,
            "allowAll": false
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
            "filter",
            "sort"
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
                                "links": {
                                    "$ref": "#/components/schemas/PaginationLinks"
                                }
                            },
                            "required": [
                                "data",
                                "quantity",
                                "total",
                                "links"
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
                    "description": "Page number. The first page is 1.",
                    "style": null,
                    "explode": null,
                    "schema": {
                        "type": "integer",
                        "minimum": 1,
                        "default": 1,
                        "description": "Page number. The first page is 1."
                    }
                },
                {
                    "name": "pageSize",
                    "required": false,
                    "description": "Number of items per page.",
                    "style": null,
                    "explode": null,
                    "schema": {
                        "type": "integer",
                        "minimum": 1,
                        "default": 20,
                        "description": "Number of items per page."
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
                },
                {
                    "name": "sort",
                    "required": false,
                    "description": "Ordered comma-separated field:direction terms. Earlier terms have higher priority.",
                    "style": "form",
                    "explode": false,
                    "schema": {
                        "type": "string",
                        "description": "Ordered comma-separated field:direction terms. Earlier terms have higher priority.",
                        "example": "name:asc"
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
            },
            "sort": {
                "version": 1,
                "fields": [
                    "name"
                ],
                "default": "name:asc"
            }
        },
        "sdk": {
            "resource": "coauthors",
            "method": "list",
            "action": "list"
        },
        "pagination": {
            "defaultMode": "page",
            "defaultPageSize": 20,
            "allowAll": false
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
            "filter",
            "sort"
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
                                "links": {
                                    "$ref": "#/components/schemas/PaginationLinks"
                                }
                            },
                            "required": [
                                "data",
                                "quantity",
                                "total",
                                "links"
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
                    "description": "Page number. The first page is 1.",
                    "style": null,
                    "explode": null,
                    "schema": {
                        "type": "integer",
                        "minimum": 1,
                        "description": "Page number. The first page is 1."
                    }
                },
                {
                    "name": "pageSize",
                    "required": false,
                    "description": "Number of items per page, or \"all\" to return every item.",
                    "style": null,
                    "explode": null,
                    "schema": {
                        "anyOf": [
                            {
                                "type": "integer",
                                "minimum": 1
                            },
                            {
                                "type": "string",
                                "enum": [
                                    "all"
                                ]
                            }
                        ],
                        "description": "Number of items per page, or \"all\" to return every item."
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
                },
                {
                    "name": "sort",
                    "required": false,
                    "description": "Ordered comma-separated field:direction terms. Earlier terms have higher priority.",
                    "style": "form",
                    "explode": false,
                    "schema": {
                        "type": "string",
                        "description": "Ordered comma-separated field:direction terms. Earlier terms have higher priority.",
                        "example": "name:asc"
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
            },
            "sort": {
                "version": 1,
                "fields": [
                    "name"
                ],
                "default": "name:asc"
            }
        },
        "sdk": {
            "resource": "coordinators",
            "method": "list",
            "action": "list"
        },
        "pagination": {
            "defaultMode": "all",
            "defaultPageSize": 20,
            "allowAll": true
        }
    },
    "listCourseEvaluationSummaries": {
        "operationId": "listCourseEvaluationSummaries",
        "target": "data",
        "method": "GET",
        "path": "/courses/evaluation-summaries",
        "authentication": "public",
        "tags": [
            "evaluation-summaries"
        ],
        "summary": "List CourseEvaluationSummaries",
        "description": null,
        "deprecated": false,
        "pathParameters": [],
        "queryParameters": [
            "page",
            "pageSize",
            "filter",
            "sort"
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
                    "description": "Page number. The first page is 1.",
                    "style": null,
                    "explode": null,
                    "schema": {
                        "type": "integer",
                        "minimum": 1,
                        "default": 1,
                        "description": "Page number. The first page is 1."
                    }
                },
                {
                    "name": "pageSize",
                    "required": false,
                    "description": "Number of items per page.",
                    "style": null,
                    "explode": null,
                    "schema": {
                        "type": "integer",
                        "minimum": 1,
                        "default": 20,
                        "description": "Number of items per page."
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
                },
                {
                    "name": "sort",
                    "required": false,
                    "description": "Ordered comma-separated field:direction terms. Earlier terms have higher priority.",
                    "style": "form",
                    "explode": false,
                    "schema": {
                        "type": "string",
                        "description": "Ordered comma-separated field:direction terms. Earlier terms have higher priority.",
                        "example": "course.code:asc"
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
            },
            "sort": {
                "version": 1,
                "fields": [
                    "course.code",
                    "course.name",
                    "responseCount",
                    "wouldTakeAgain",
                    "fairness",
                    "clarity",
                    "difficulty"
                ],
                "default": "course.code:asc"
            }
        },
        "sdk": {
            "resource": "evaluationSummaries",
            "method": "listByCourse",
            "action": "list"
        },
        "pagination": {
            "defaultMode": "page",
            "defaultPageSize": 20,
            "allowAll": false
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
            "filter",
            "sort"
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
                    "description": "Page number. The first page is 1.",
                    "style": null,
                    "explode": null,
                    "schema": {
                        "type": "integer",
                        "minimum": 1,
                        "description": "Page number. The first page is 1."
                    }
                },
                {
                    "name": "pageSize",
                    "required": false,
                    "description": "Number of items per page, or \"all\" to return every item.",
                    "style": null,
                    "explode": null,
                    "schema": {
                        "anyOf": [
                            {
                                "type": "integer",
                                "minimum": 1,
                                "maximum": 1000
                            },
                            {
                                "type": "string",
                                "enum": [
                                    "all"
                                ]
                            }
                        ],
                        "description": "Number of items per page, or \"all\" to return every item."
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
                },
                {
                    "name": "sort",
                    "required": false,
                    "description": "Ordered comma-separated field:direction terms. Earlier terms have higher priority.",
                    "style": "form",
                    "explode": false,
                    "schema": {
                        "type": "string",
                        "description": "Ordered comma-separated field:direction terms. Earlier terms have higher priority.",
                        "example": "code:asc"
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
            },
            "sort": {
                "version": 1,
                "fields": [
                    "code",
                    "name",
                    "credits",
                    "unitCode"
                ],
                "default": "code:asc"
            }
        },
        "sdk": {
            "resource": "courses",
            "action": "list",
            "method": "list"
        },
        "pagination": {
            "defaultMode": "all",
            "defaultPageSize": 20,
            "maxPageSize": 1000,
            "allowAll": true
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
            "page",
            "pageSize",
            "filter",
            "sort"
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
                                        "$ref": "#/components/schemas/CurriculumSuggestionEntity"
                                    }
                                },
                                "quantity": {
                                    "type": "integer"
                                },
                                "total": {
                                    "type": "integer"
                                },
                                "links": {
                                    "$ref": "#/components/schemas/PaginationLinks"
                                }
                            },
                            "required": [
                                "data",
                                "quantity",
                                "total",
                                "links"
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
                    "description": "Page number. The first page is 1.",
                    "style": null,
                    "explode": null,
                    "schema": {
                        "type": "integer",
                        "minimum": 1,
                        "description": "Page number. The first page is 1."
                    }
                },
                {
                    "name": "pageSize",
                    "required": false,
                    "description": "Number of items per page, or \"all\" to return every item.",
                    "style": null,
                    "explode": null,
                    "schema": {
                        "anyOf": [
                            {
                                "type": "integer",
                                "minimum": 1
                            },
                            {
                                "type": "string",
                                "enum": [
                                    "all"
                                ]
                            }
                        ],
                        "description": "Number of items per page, or \"all\" to return every item."
                    }
                },
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
                            "catalogProgramVariantId": {
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
                },
                {
                    "name": "sort",
                    "required": false,
                    "description": "Ordered comma-separated field:direction terms. Earlier terms have higher priority.",
                    "style": "form",
                    "explode": false,
                    "schema": {
                        "type": "string",
                        "description": "Ordered comma-separated field:direction terms. Earlier terms have higher priority.",
                        "example": "catalogYear:desc,programCode:desc,specializationCode:asc"
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
                            "catalogProgramVariantId"
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
            },
            "sort": {
                "version": 1,
                "fields": [
                    "catalogYear",
                    "programCode",
                    "programName",
                    "specializationCode"
                ],
                "default": "catalogYear:desc,programCode:desc,specializationCode:asc"
            }
        },
        "sdk": {
            "resource": "curriculumSuggestions",
            "method": "list",
            "action": "list"
        },
        "pagination": {
            "defaultMode": "all",
            "defaultPageSize": 20,
            "allowAll": true
        }
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
            "page",
            "pageSize",
            "filter",
            "sort"
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
                                        "$ref": "#/components/schemas/DailyMenu"
                                    }
                                },
                                "quantity": {
                                    "type": "integer"
                                },
                                "total": {
                                    "type": "integer"
                                },
                                "links": {
                                    "$ref": "#/components/schemas/PaginationLinks"
                                }
                            },
                            "required": [
                                "data",
                                "quantity",
                                "total",
                                "links"
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
                    "description": "Page number. The first page is 1.",
                    "style": null,
                    "explode": null,
                    "schema": {
                        "type": "integer",
                        "minimum": 1,
                        "description": "Page number. The first page is 1."
                    }
                },
                {
                    "name": "pageSize",
                    "required": false,
                    "description": "Number of items per page, or \"all\" to return every item.",
                    "style": null,
                    "explode": null,
                    "schema": {
                        "anyOf": [
                            {
                                "type": "integer",
                                "minimum": 1
                            },
                            {
                                "type": "string",
                                "enum": [
                                    "all"
                                ]
                            }
                        ],
                        "description": "Number of items per page, or \"all\" to return every item."
                    }
                },
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
                },
                {
                    "name": "sort",
                    "required": false,
                    "description": "Ordered comma-separated field:direction terms. Earlier terms have higher priority.",
                    "style": "form",
                    "explode": false,
                    "schema": {
                        "type": "string",
                        "description": "Ordered comma-separated field:direction terms. Earlier terms have higher priority.",
                        "example": "date:asc"
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
            },
            "sort": {
                "version": 1,
                "fields": [
                    "date",
                    "createdAt",
                    "updatedAt"
                ],
                "default": "date:asc"
            }
        },
        "sdk": {
            "resource": "dailyMenus",
            "method": "list",
            "action": "list"
        },
        "pagination": {
            "defaultMode": "all",
            "defaultPageSize": 20,
            "allowAll": true
        }
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
            "page",
            "pageSize",
            "filter",
            "sort"
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
                                        "$ref": "#/components/schemas/Department"
                                    }
                                },
                                "quantity": {
                                    "type": "integer"
                                },
                                "total": {
                                    "type": "integer"
                                },
                                "links": {
                                    "$ref": "#/components/schemas/PaginationLinks"
                                }
                            },
                            "required": [
                                "data",
                                "quantity",
                                "total",
                                "links"
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
                    "description": "Page number. The first page is 1.",
                    "style": null,
                    "explode": null,
                    "schema": {
                        "type": "integer",
                        "minimum": 1,
                        "description": "Page number. The first page is 1."
                    }
                },
                {
                    "name": "pageSize",
                    "required": false,
                    "description": "Number of items per page, or \"all\" to return every item.",
                    "style": null,
                    "explode": null,
                    "schema": {
                        "anyOf": [
                            {
                                "type": "integer",
                                "minimum": 1
                            },
                            {
                                "type": "string",
                                "enum": [
                                    "all"
                                ]
                            }
                        ],
                        "description": "Number of items per page, or \"all\" to return every item."
                    }
                },
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
                },
                {
                    "name": "sort",
                    "required": false,
                    "description": "Ordered comma-separated field:direction terms. Earlier terms have higher priority.",
                    "style": "form",
                    "explode": false,
                    "schema": {
                        "type": "string",
                        "description": "Ordered comma-separated field:direction terms. Earlier terms have higher priority.",
                        "example": "name:asc"
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
            },
            "sort": {
                "version": 1,
                "fields": [
                    "name"
                ],
                "default": "name:asc"
            }
        },
        "sdk": {
            "resource": "departments",
            "method": "list",
            "action": "list"
        },
        "pagination": {
            "defaultMode": "all",
            "defaultPageSize": 20,
            "allowAll": true
        }
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
            "page",
            "pageSize",
            "filter",
            "sort",
            "q"
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
                                        "$ref": "#/components/schemas/ExchangeNotice"
                                    }
                                },
                                "quantity": {
                                    "type": "integer"
                                },
                                "total": {
                                    "type": "integer"
                                },
                                "links": {
                                    "$ref": "#/components/schemas/PaginationLinks"
                                }
                            },
                            "required": [
                                "data",
                                "quantity",
                                "total",
                                "links"
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
                    "description": "Page number. The first page is 1.",
                    "style": null,
                    "explode": null,
                    "schema": {
                        "type": "integer",
                        "minimum": 1,
                        "description": "Page number. The first page is 1."
                    }
                },
                {
                    "name": "pageSize",
                    "required": false,
                    "description": "Number of items per page, or \"all\" to return every item.",
                    "style": null,
                    "explode": null,
                    "schema": {
                        "anyOf": [
                            {
                                "type": "integer",
                                "minimum": 1
                            },
                            {
                                "type": "string",
                                "enum": [
                                    "all"
                                ]
                            }
                        ],
                        "description": "Number of items per page, or \"all\" to return every item."
                    }
                },
                {
                    "name": "filter",
                    "required": false,
                    "description": "Structured exchange notice filters. Use bracket notation such as filter[registrationEnd][gte]=2026-01-01.",
                    "style": "deepObject",
                    "explode": true,
                    "schema": {
                        "additionalProperties": false,
                        "properties": {
                            "number": {
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
                            "issuer": {
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
                            "title": {
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
                                            "ne": {
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
                                            "eq": {
                                                "format": "date",
                                                "type": "string"
                                            },
                                            "ne": {
                                                "format": "date",
                                                "type": "string"
                                            },
                                            "gt": {
                                                "format": "date",
                                                "type": "string"
                                            },
                                            "gte": {
                                                "format": "date",
                                                "type": "string"
                                            },
                                            "lt": {
                                                "format": "date",
                                                "type": "string"
                                            },
                                            "lte": {
                                                "format": "date",
                                                "type": "string"
                                            },
                                            "in": {
                                                "items": {
                                                    "format": "date",
                                                    "type": "string"
                                                },
                                                "type": "array"
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
                                            "eq": {
                                                "format": "date",
                                                "type": "string"
                                            },
                                            "ne": {
                                                "format": "date",
                                                "type": "string"
                                            },
                                            "gt": {
                                                "format": "date",
                                                "type": "string"
                                            },
                                            "gte": {
                                                "format": "date",
                                                "type": "string"
                                            },
                                            "lt": {
                                                "format": "date",
                                                "type": "string"
                                            },
                                            "lte": {
                                                "format": "date",
                                                "type": "string"
                                            },
                                            "in": {
                                                "items": {
                                                    "format": "date",
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
                {
                    "name": "sort",
                    "required": false,
                    "description": "Ordered comma-separated field:direction terms. Earlier terms have higher priority.",
                    "style": "form",
                    "explode": false,
                    "schema": {
                        "type": "string",
                        "description": "Ordered comma-separated field:direction terms. Earlier terms have higher priority.",
                        "example": "registrationEnd:desc,registrationStart:desc"
                    }
                },
                {
                    "name": "q",
                    "required": false,
                    "description": null,
                    "style": null,
                    "explode": null,
                    "schema": {
                        "type": "string",
                        "minLength": 1
                    }
                }
            ],
            "filter": {
                "version": 1,
                "fields": [
                    {
                        "path": [
                            "number"
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
                            "issuer"
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
                            "title"
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
                            "placeId"
                        ],
                        "schema": {
                            "minimum": 1,
                            "type": "integer"
                        },
                        "operators": [
                            "eq",
                            "ne",
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
                            "registrationEnd"
                        ],
                        "schema": {
                            "format": "date",
                            "type": "string"
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
                    }
                ],
                "constraints": {
                    "maxExpressions": 20,
                    "maxDepth": 3,
                    "maxParameters": 100
                }
            },
            "sort": {
                "version": 1,
                "fields": [
                    "registrationEnd",
                    "registrationStart",
                    "number",
                    "issuer",
                    "title",
                    "place.name"
                ],
                "default": "registrationEnd:desc,registrationStart:desc"
            }
        },
        "sdk": {
            "resource": "exchangeNotices",
            "method": "list",
            "action": "list"
        },
        "pagination": {
            "defaultMode": "all",
            "defaultPageSize": 20,
            "allowAll": true
        }
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
            "page",
            "pageSize",
            "filter",
            "sort"
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
                                        "$ref": "#/components/schemas/ExchangePlaceListItem"
                                    }
                                },
                                "quantity": {
                                    "type": "integer"
                                },
                                "total": {
                                    "type": "integer"
                                },
                                "links": {
                                    "$ref": "#/components/schemas/PaginationLinks"
                                }
                            },
                            "required": [
                                "data",
                                "quantity",
                                "total",
                                "links"
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
                    "description": "Page number. The first page is 1.",
                    "style": null,
                    "explode": null,
                    "schema": {
                        "type": "integer",
                        "minimum": 1,
                        "description": "Page number. The first page is 1."
                    }
                },
                {
                    "name": "pageSize",
                    "required": false,
                    "description": "Number of items per page, or \"all\" to return every item.",
                    "style": null,
                    "explode": null,
                    "schema": {
                        "anyOf": [
                            {
                                "type": "integer",
                                "minimum": 1
                            },
                            {
                                "type": "string",
                                "enum": [
                                    "all"
                                ]
                            }
                        ],
                        "description": "Number of items per page, or \"all\" to return every item."
                    }
                },
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
                },
                {
                    "name": "sort",
                    "required": false,
                    "description": "Ordered comma-separated field:direction terms. Earlier terms have higher priority.",
                    "style": "form",
                    "explode": false,
                    "schema": {
                        "type": "string",
                        "description": "Ordered comma-separated field:direction terms. Earlier terms have higher priority.",
                        "example": "name:asc"
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
            },
            "sort": {
                "version": 1,
                "fields": [
                    "name"
                ],
                "default": "name:asc"
            }
        },
        "sdk": {
            "resource": "exchangePlaces",
            "method": "list",
            "action": "list"
        },
        "pagination": {
            "defaultMode": "all",
            "defaultPageSize": 20,
            "allowAll": true
        }
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
            "filter",
            "sort"
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
                                "links": {
                                    "$ref": "#/components/schemas/PaginationLinks"
                                }
                            },
                            "required": [
                                "data",
                                "quantity",
                                "total",
                                "links"
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
                    "description": "Page number. The first page is 1.",
                    "style": null,
                    "explode": null,
                    "schema": {
                        "type": "integer",
                        "minimum": 1,
                        "default": 1,
                        "description": "Page number. The first page is 1."
                    }
                },
                {
                    "name": "pageSize",
                    "required": false,
                    "description": "Number of items per page.",
                    "style": null,
                    "explode": null,
                    "schema": {
                        "type": "integer",
                        "minimum": 1,
                        "default": 20,
                        "description": "Number of items per page."
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
                },
                {
                    "name": "sort",
                    "required": false,
                    "description": "Ordered comma-separated field:direction terms. Earlier terms have higher priority.",
                    "style": "form",
                    "explode": false,
                    "schema": {
                        "type": "string",
                        "description": "Ordered comma-separated field:direction terms. Earlier terms have higher priority.",
                        "example": "name:asc"
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
            },
            "sort": {
                "version": 1,
                "fields": [
                    "name"
                ],
                "default": "name:asc"
            }
        },
        "sdk": {
            "resource": "keywords",
            "method": "list",
            "action": "list"
        },
        "pagination": {
            "defaultMode": "page",
            "defaultPageSize": 20,
            "allowAll": false
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
            "page",
            "pageSize",
            "filter",
            "sort"
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
                                        "$ref": "#/components/schemas/Language"
                                    }
                                },
                                "quantity": {
                                    "type": "integer"
                                },
                                "total": {
                                    "type": "integer"
                                },
                                "links": {
                                    "$ref": "#/components/schemas/PaginationLinks"
                                }
                            },
                            "required": [
                                "data",
                                "quantity",
                                "total",
                                "links"
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
                    "description": "Page number. The first page is 1.",
                    "style": null,
                    "explode": null,
                    "schema": {
                        "type": "integer",
                        "minimum": 1,
                        "description": "Page number. The first page is 1."
                    }
                },
                {
                    "name": "pageSize",
                    "required": false,
                    "description": "Number of items per page, or \"all\" to return every item.",
                    "style": null,
                    "explode": null,
                    "schema": {
                        "anyOf": [
                            {
                                "type": "integer",
                                "minimum": 1
                            },
                            {
                                "type": "string",
                                "enum": [
                                    "all"
                                ]
                            }
                        ],
                        "description": "Number of items per page, or \"all\" to return every item."
                    }
                },
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
                },
                {
                    "name": "sort",
                    "required": false,
                    "description": "Ordered comma-separated field:direction terms. Earlier terms have higher priority.",
                    "style": "form",
                    "explode": false,
                    "schema": {
                        "type": "string",
                        "description": "Ordered comma-separated field:direction terms. Earlier terms have higher priority.",
                        "example": "name:asc"
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
            },
            "sort": {
                "version": 1,
                "fields": [
                    "name"
                ],
                "default": "name:asc"
            }
        },
        "sdk": {
            "resource": "languages",
            "method": "list",
            "action": "list"
        },
        "pagination": {
            "defaultMode": "all",
            "defaultPageSize": 20,
            "allowAll": true
        }
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
            "filter",
            "sort"
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
                                "links": {
                                    "$ref": "#/components/schemas/PaginationLinks"
                                }
                            },
                            "required": [
                                "data",
                                "quantity",
                                "total",
                                "links"
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
                    "description": "Page number. The first page is 1.",
                    "style": null,
                    "explode": null,
                    "schema": {
                        "type": "integer",
                        "minimum": 1,
                        "default": 1,
                        "description": "Page number. The first page is 1."
                    }
                },
                {
                    "name": "pageSize",
                    "required": false,
                    "description": "Number of items per page.",
                    "style": null,
                    "explode": null,
                    "schema": {
                        "type": "integer",
                        "minimum": 1,
                        "default": 20,
                        "description": "Number of items per page."
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
                },
                {
                    "name": "sort",
                    "required": false,
                    "description": "Ordered comma-separated field:direction terms. Earlier terms have higher priority.",
                    "style": "form",
                    "explode": false,
                    "schema": {
                        "type": "string",
                        "description": "Ordered comma-separated field:direction terms. Earlier terms have higher priority.",
                        "example": "name:asc"
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
            },
            "sort": {
                "version": 1,
                "fields": [
                    "name"
                ],
                "default": "name:asc"
            }
        },
        "sdk": {
            "resource": "professorDataPortalProfiles",
            "method": "list",
            "action": "list"
        },
        "pagination": {
            "defaultMode": "page",
            "defaultPageSize": 20,
            "allowAll": false
        }
    },
    "listProfessorEvaluationSummaries": {
        "operationId": "listProfessorEvaluationSummaries",
        "target": "data",
        "method": "GET",
        "path": "/professors/evaluation-summaries",
        "authentication": "public",
        "tags": [
            "evaluation-summaries"
        ],
        "summary": "List ProfessorEvaluationSummaries",
        "description": null,
        "deprecated": false,
        "pathParameters": [],
        "queryParameters": [
            "page",
            "pageSize",
            "filter",
            "sort"
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
                    "description": "Page number. The first page is 1.",
                    "style": null,
                    "explode": null,
                    "schema": {
                        "type": "integer",
                        "minimum": 1,
                        "default": 1,
                        "description": "Page number. The first page is 1."
                    }
                },
                {
                    "name": "pageSize",
                    "required": false,
                    "description": "Number of items per page.",
                    "style": null,
                    "explode": null,
                    "schema": {
                        "type": "integer",
                        "minimum": 1,
                        "default": 20,
                        "description": "Number of items per page."
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
                },
                {
                    "name": "sort",
                    "required": false,
                    "description": "Ordered comma-separated field:direction terms. Earlier terms have higher priority.",
                    "style": "form",
                    "explode": false,
                    "schema": {
                        "type": "string",
                        "description": "Ordered comma-separated field:direction terms. Earlier terms have higher priority.",
                        "example": "professor.name:asc"
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
            },
            "sort": {
                "version": 1,
                "fields": [
                    "professor.name",
                    "responseCount",
                    "wouldTakeAgain",
                    "fairness",
                    "clarity",
                    "difficulty"
                ],
                "default": "professor.name:asc"
            }
        },
        "sdk": {
            "resource": "evaluationSummaries",
            "method": "listByProfessor",
            "action": "list"
        },
        "pagination": {
            "defaultMode": "page",
            "defaultPageSize": 20,
            "allowAll": false
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
            "page",
            "pageSize",
            "filter",
            "sort"
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
                                        "$ref": "#/components/schemas/ProfessorPosition"
                                    }
                                },
                                "quantity": {
                                    "type": "integer"
                                },
                                "total": {
                                    "type": "integer"
                                },
                                "links": {
                                    "$ref": "#/components/schemas/PaginationLinks"
                                }
                            },
                            "required": [
                                "data",
                                "quantity",
                                "total",
                                "links"
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
                    "description": "Page number. The first page is 1.",
                    "style": null,
                    "explode": null,
                    "schema": {
                        "type": "integer",
                        "minimum": 1,
                        "description": "Page number. The first page is 1."
                    }
                },
                {
                    "name": "pageSize",
                    "required": false,
                    "description": "Number of items per page, or \"all\" to return every item.",
                    "style": null,
                    "explode": null,
                    "schema": {
                        "anyOf": [
                            {
                                "type": "integer",
                                "minimum": 1
                            },
                            {
                                "type": "string",
                                "enum": [
                                    "all"
                                ]
                            }
                        ],
                        "description": "Number of items per page, or \"all\" to return every item."
                    }
                },
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
                },
                {
                    "name": "sort",
                    "required": false,
                    "description": "Ordered comma-separated field:direction terms. Earlier terms have higher priority.",
                    "style": "form",
                    "explode": false,
                    "schema": {
                        "type": "string",
                        "description": "Ordered comma-separated field:direction terms. Earlier terms have higher priority.",
                        "example": "canonicalKey:asc"
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
            },
            "sort": {
                "version": 1,
                "fields": [
                    "canonicalKey",
                    "role"
                ],
                "default": "canonicalKey:asc"
            }
        },
        "sdk": {
            "resource": "professorPositions",
            "method": "list",
            "action": "list"
        },
        "pagination": {
            "defaultMode": "all",
            "defaultPageSize": 20,
            "allowAll": true
        }
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
            "filter",
            "sort"
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
                    "description": "Page number. The first page is 1.",
                    "style": null,
                    "explode": null,
                    "schema": {
                        "type": "integer",
                        "minimum": 1,
                        "default": 1,
                        "description": "Page number. The first page is 1."
                    }
                },
                {
                    "name": "pageSize",
                    "required": false,
                    "description": "Number of items per page.",
                    "style": null,
                    "explode": null,
                    "schema": {
                        "type": "integer",
                        "minimum": 1,
                        "default": 20,
                        "description": "Number of items per page."
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
                },
                {
                    "name": "sort",
                    "required": false,
                    "description": "Ordered comma-separated field:direction terms. Earlier terms have higher priority.",
                    "style": "form",
                    "explode": false,
                    "schema": {
                        "type": "string",
                        "description": "Ordered comma-separated field:direction terms. Earlier terms have higher priority.",
                        "example": "name:asc"
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
            },
            "sort": {
                "version": 1,
                "fields": [
                    "name"
                ],
                "default": "name:asc"
            }
        },
        "sdk": {
            "resource": "professors",
            "method": "list",
            "action": "list"
        },
        "pagination": {
            "defaultMode": "page",
            "defaultPageSize": 20,
            "allowAll": false
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
            "page",
            "pageSize",
            "filter",
            "sort"
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
                                        "$ref": "#/components/schemas/Program"
                                    }
                                },
                                "quantity": {
                                    "type": "integer"
                                },
                                "total": {
                                    "type": "integer"
                                },
                                "links": {
                                    "$ref": "#/components/schemas/PaginationLinks"
                                }
                            },
                            "required": [
                                "data",
                                "quantity",
                                "total",
                                "links"
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
                    "description": "Page number. The first page is 1.",
                    "style": null,
                    "explode": null,
                    "schema": {
                        "type": "integer",
                        "minimum": 1,
                        "description": "Page number. The first page is 1."
                    }
                },
                {
                    "name": "pageSize",
                    "required": false,
                    "description": "Number of items per page, or \"all\" to return every item.",
                    "style": null,
                    "explode": null,
                    "schema": {
                        "anyOf": [
                            {
                                "type": "integer",
                                "minimum": 1
                            },
                            {
                                "type": "string",
                                "enum": [
                                    "all"
                                ]
                            }
                        ],
                        "description": "Number of items per page, or \"all\" to return every item."
                    }
                },
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
                },
                {
                    "name": "sort",
                    "required": false,
                    "description": "Ordered comma-separated field:direction terms. Earlier terms have higher priority.",
                    "style": "form",
                    "explode": false,
                    "schema": {
                        "type": "string",
                        "description": "Ordered comma-separated field:direction terms. Earlier terms have higher priority.",
                        "example": "name:asc"
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
            },
            "sort": {
                "version": 1,
                "fields": [
                    "code",
                    "name",
                    "unitCode"
                ],
                "default": "name:asc"
            }
        },
        "sdk": {
            "resource": "programs",
            "method": "list",
            "action": "list"
        },
        "pagination": {
            "defaultMode": "all",
            "defaultPageSize": 20,
            "allowAll": true
        }
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
            "page",
            "pageSize",
            "filter",
            "sort"
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
                                        "$ref": "#/components/schemas/RoomEntity"
                                    }
                                },
                                "quantity": {
                                    "type": "integer"
                                },
                                "total": {
                                    "type": "integer"
                                },
                                "links": {
                                    "$ref": "#/components/schemas/PaginationLinks"
                                }
                            },
                            "required": [
                                "data",
                                "quantity",
                                "total",
                                "links"
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
                    "description": "Page number. The first page is 1.",
                    "style": null,
                    "explode": null,
                    "schema": {
                        "type": "integer",
                        "minimum": 1,
                        "description": "Page number. The first page is 1."
                    }
                },
                {
                    "name": "pageSize",
                    "required": false,
                    "description": "Number of items per page, or \"all\" to return every item.",
                    "style": null,
                    "explode": null,
                    "schema": {
                        "anyOf": [
                            {
                                "type": "integer",
                                "minimum": 1
                            },
                            {
                                "type": "string",
                                "enum": [
                                    "all"
                                ]
                            }
                        ],
                        "description": "Number of items per page, or \"all\" to return every item."
                    }
                },
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
                },
                {
                    "name": "sort",
                    "required": false,
                    "description": "Ordered comma-separated field:direction terms. Earlier terms have higher priority.",
                    "style": "form",
                    "explode": false,
                    "schema": {
                        "type": "string",
                        "description": "Ordered comma-separated field:direction terms. Earlier terms have higher priority.",
                        "example": "code:asc"
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
            },
            "sort": {
                "version": 1,
                "fields": [
                    "code"
                ],
                "default": "code:asc"
            }
        },
        "sdk": {
            "resource": "rooms",
            "method": "list",
            "action": "list"
        },
        "pagination": {
            "defaultMode": "all",
            "defaultPageSize": 20,
            "allowAll": true
        }
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
            "page",
            "pageSize",
            "filter",
            "sort"
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
                                        "$ref": "#/components/schemas/Specialization"
                                    }
                                },
                                "quantity": {
                                    "type": "integer"
                                },
                                "total": {
                                    "type": "integer"
                                },
                                "links": {
                                    "$ref": "#/components/schemas/PaginationLinks"
                                }
                            },
                            "required": [
                                "data",
                                "quantity",
                                "total",
                                "links"
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
                    "description": "Page number. The first page is 1.",
                    "style": null,
                    "explode": null,
                    "schema": {
                        "type": "integer",
                        "minimum": 1,
                        "description": "Page number. The first page is 1."
                    }
                },
                {
                    "name": "pageSize",
                    "required": false,
                    "description": "Number of items per page, or \"all\" to return every item.",
                    "style": null,
                    "explode": null,
                    "schema": {
                        "anyOf": [
                            {
                                "type": "integer",
                                "minimum": 1
                            },
                            {
                                "type": "string",
                                "enum": [
                                    "all"
                                ]
                            }
                        ],
                        "description": "Number of items per page, or \"all\" to return every item."
                    }
                },
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
                },
                {
                    "name": "sort",
                    "required": false,
                    "description": "Ordered comma-separated field:direction terms. Earlier terms have higher priority.",
                    "style": "form",
                    "explode": false,
                    "schema": {
                        "type": "string",
                        "description": "Ordered comma-separated field:direction terms. Earlier terms have higher priority.",
                        "example": "programCode:asc,name:asc"
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
            },
            "sort": {
                "version": 1,
                "fields": [
                    "programCode",
                    "programName",
                    "code",
                    "name"
                ],
                "default": "programCode:asc,name:asc"
            }
        },
        "sdk": {
            "resource": "specializations",
            "method": "list",
            "action": "list"
        },
        "pagination": {
            "defaultMode": "all",
            "defaultPageSize": 20,
            "allowAll": true
        }
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
            "page",
            "pageSize",
            "filter",
            "sort"
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
                                        "$ref": "#/components/schemas/StudyPeriodEntity"
                                    }
                                },
                                "quantity": {
                                    "type": "integer"
                                },
                                "total": {
                                    "type": "integer"
                                },
                                "links": {
                                    "$ref": "#/components/schemas/PaginationLinks"
                                }
                            },
                            "required": [
                                "data",
                                "quantity",
                                "total",
                                "links"
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
                    "description": "Page number. The first page is 1.",
                    "style": null,
                    "explode": null,
                    "schema": {
                        "type": "integer",
                        "minimum": 1,
                        "description": "Page number. The first page is 1."
                    }
                },
                {
                    "name": "pageSize",
                    "required": false,
                    "description": "Number of items per page, or \"all\" to return every item.",
                    "style": null,
                    "explode": null,
                    "schema": {
                        "anyOf": [
                            {
                                "type": "integer",
                                "minimum": 1
                            },
                            {
                                "type": "string",
                                "enum": [
                                    "all"
                                ]
                            }
                        ],
                        "description": "Number of items per page, or \"all\" to return every item."
                    }
                },
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
                },
                {
                    "name": "sort",
                    "required": false,
                    "description": "Ordered comma-separated field:direction terms. Earlier terms have higher priority.",
                    "style": "form",
                    "explode": false,
                    "schema": {
                        "type": "string",
                        "description": "Ordered comma-separated field:direction terms. Earlier terms have higher priority.",
                        "example": "id:asc"
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
            },
            "sort": {
                "version": 1,
                "fields": [
                    "id",
                    "year",
                    "yearPeriod",
                    "startDate"
                ],
                "default": "id:asc"
            }
        },
        "sdk": {
            "resource": "studyPeriods",
            "method": "list",
            "action": "list"
        },
        "pagination": {
            "defaultMode": "all",
            "defaultPageSize": 20,
            "allowAll": true
        }
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
            "page",
            "pageSize",
            "filter",
            "sort"
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
                                        "$ref": "#/components/schemas/UnitEntity"
                                    }
                                },
                                "quantity": {
                                    "type": "integer"
                                },
                                "total": {
                                    "type": "integer"
                                },
                                "links": {
                                    "$ref": "#/components/schemas/PaginationLinks"
                                }
                            },
                            "required": [
                                "data",
                                "quantity",
                                "total",
                                "links"
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
                    "description": "Page number. The first page is 1.",
                    "style": null,
                    "explode": null,
                    "schema": {
                        "type": "integer",
                        "minimum": 1,
                        "description": "Page number. The first page is 1."
                    }
                },
                {
                    "name": "pageSize",
                    "required": false,
                    "description": "Number of items per page, or \"all\" to return every item.",
                    "style": null,
                    "explode": null,
                    "schema": {
                        "anyOf": [
                            {
                                "type": "integer",
                                "minimum": 1
                            },
                            {
                                "type": "string",
                                "enum": [
                                    "all"
                                ]
                            }
                        ],
                        "description": "Number of items per page, or \"all\" to return every item."
                    }
                },
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
                },
                {
                    "name": "sort",
                    "required": false,
                    "description": "Ordered comma-separated field:direction terms. Earlier terms have higher priority.",
                    "style": "form",
                    "explode": false,
                    "schema": {
                        "type": "string",
                        "description": "Ordered comma-separated field:direction terms. Earlier terms have higher priority.",
                        "example": "code:asc"
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
            },
            "sort": {
                "version": 1,
                "fields": [
                    "code",
                    "name"
                ],
                "default": "code:asc"
            }
        },
        "sdk": {
            "resource": "units",
            "method": "list",
            "action": "list"
        },
        "pagination": {
            "defaultMode": "all",
            "defaultPageSize": 20,
            "allowAll": true
        }
    },
} as const satisfies Record<string, GeneratedOperationDefinition>

export type OperationName = keyof typeof operationDefinitions
