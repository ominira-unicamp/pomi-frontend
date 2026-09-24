export interface paths {
    "/professors/evaluation-summaries": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };

        get: operations["listProfessorEvaluationSummaries"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/courses/evaluation-summaries": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };

        get: operations["listCourseEvaluationSummaries"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/evaluation-summaries": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };

        get: operations["getCourseProfessorEvaluationSummary"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/units/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };

        get: operations["getUnits"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/units": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };

        get: operations["listUnits"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/courses/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };

        get: operations["getCourses"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/courses": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };

        get: operations["listCourses"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/professors/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };

        get: operations["getProfessors"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/professors": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };

        get: operations["listProfessors"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/professor-data-portal-profiles": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };

        get: operations["listProfessorDataPortalProfiles"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/professor-data-portal-profiles/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };

        get: operations["getProfessorDataPortalProfiles"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/professor-positions": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };

        get: operations["listProfessorPositions"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/professor-positions/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };

        get: operations["getProfessorPositions"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/departments": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };

        get: operations["listDepartments"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/departments/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };

        get: operations["getDepartments"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/keywords": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };

        get: operations["listKeywords"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/keywords/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };

        get: operations["getKeywords"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/coauthors": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };

        get: operations["listCoauthors"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/coauthors/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };

        get: operations["getCoauthors"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/rooms/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };

        get: operations["getRooms"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/rooms": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };

        get: operations["listRooms"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/catalogs/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };

        get: operations["getCatalogs"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/catalogs": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };

        get: operations["listCatalogs"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/catalog-courses": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };

        get: operations["listCatalogCourses"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/catalog-courses/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };

        get: operations["getCatalogCourses"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/coordinators": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };

        get: operations["listCoordinators"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/coordinators/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };

        get: operations["getCoordinators"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/catalog-program/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };

        get: operations["getCatalogPrograms"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/catalog-program": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };

        get: operations["listCatalogPrograms"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/curriculum-suggestions/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };

        get: operations["getCurriculumSuggestions"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/curriculum-suggestions": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };

        get: operations["listCurriculumSuggestions"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/languages/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };

        get: operations["getLanguages"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/languages": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };

        get: operations["listLanguages"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/programs/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };

        get: operations["getPrograms"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/programs": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };

        get: operations["listPrograms"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/specializations/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };

        get: operations["getSpecializations"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/specializations": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };

        get: operations["listSpecializations"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/exchange-notices/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };

        get: operations["getExchangeNotices"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/exchange-notices": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };

        get: operations["listExchangeNotices"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/exchange-places": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };

        get: operations["listExchangePlaces"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/calendar": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };

        get: operations["getCalendarFeed"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/calendar-events/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };

        get: operations["getCalendarEvents"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/calendar-events": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };

        get: operations["listCalendarEvents"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/calendar-tags/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };

        get: operations["getCalendarTags"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/calendar-tags": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };

        get: operations["listCalendarTags"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/classes/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };

        get: operations["getClasses"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/classes": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };

        get: operations["listClasses"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/class-schedules/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };

        get: operations["getClassSchedules"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/class-schedules": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };

        get: operations["listClassSchedules"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/daily-menus/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };

        get: operations["getDailyMenus"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/daily-menus": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };

        get: operations["listDailyMenus"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/study-periods/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };

        get: operations["getStudyPeriods"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/study-periods": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };

        get: operations["listStudyPeriods"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
}
export type webhooks = Record<string, never>;
export interface components {
    schemas: {
        PageProfessorEvaluationSummaries: {
            data: components["schemas"]["ProfessorEvaluationSummary"][];
            quantity: number;
            total: number;
            links: components["schemas"]["PaginationLinks"];
        };
        ProfessorEvaluationSummary: {
            responseCount: number;
            wouldTakeAgain: number;
            fairness: number;
            clarity: number;
            difficulty: number;
            professor: {
                id: number;
                name: string;
            };
        };
        PaginationLinks: {

            self: string;

            first: string;

            last: string;

            next: string | null;

            previous: string | null;
        };
        InvalidRequestProblem: {

            type: "urn:pomi:problem:invalid-request";

            title: "Dados da requisição inválidos";

            status: 400;
            detail: string;
            instance?: string;
            fields: components["schemas"]["ProblemField"][];
        };
        ProblemField: {
            code: string;
            path: string[];
            message: string;
            details?: {
                [key: string]: unknown;
            };
        };
        InternalServerErrorProblem: {

            type: "urn:pomi:problem:internal-server-error";

            title: "Não foi possível concluir a ação";

            status: 500;
            detail: string;
            instance?: string;
        };
        PageCourseEvaluationSummaries: {
            data: components["schemas"]["CourseEvaluationSummary"][];
            quantity: number;
            total: number;
            links: components["schemas"]["PaginationLinks"];
        };
        CourseEvaluationSummary: {
            responseCount: number;
            wouldTakeAgain: number;
            fairness: number;
            clarity: number;
            difficulty: number;
            course: {
                id: number;
                code: string;
                name: string;
            };
        };
        CourseProfessorEvaluationSummary: {
            responseCount: number;
            wouldTakeAgain: number;
            fairness: number;
            clarity: number;
            difficulty: number;
            course: {
                id: number;
                code: string;
                name: string;
            };
            professor: {
                id: number;
                name: string;
            };
        };
        ResourceNotFoundProblem: {

            type: "urn:pomi:problem:resource-not-found";

            title: "Recurso não encontrado";

            status: 404;
            detail: string;
            instance?: string;
        };
        UnitEntity: {
            id: number;
            code: string;
            name: string;
        };
        CourseEntity: {
            id: number;
            code: string;
            name: string;
            credits: number;
            prefix: string;
            unitId: number | null;
            unitCode: string | null;
        };
        PageCourses: {
            data: components["schemas"]["CourseEntity"][];
            quantity: number;
            total: number;
            links: components["schemas"]["PaginationLinks"];
        };
        ProfessorEntity: {
            id: number;
            name: string;
        };
        PageProfessors: {
            data: components["schemas"]["ProfessorEntity"][];
            quantity: number;
            total: number;
            links: components["schemas"]["PaginationLinks"];
        };
        ProfessorDataPortalProfileSummary: {
            id: number;
            professorId: number;
            portalId: number;
            name: string;
            email: string | null;
            lattesAbstract: string | null;
            unit: {
                id: number;
                code: string;
                name: string;
            };
            department: components["schemas"]["Department"];
            position: components["schemas"]["ProfessorPosition"];
        };
        Department: {
            id: number;
            name: string;
            unitId: number;
        } | null;
        ProfessorPosition: {
            id: number;
            canonicalKey: string;
            role: string;
            affiliationType: string;
            programCode: string | null;
            postdoctoralModality: string | null;
            careerReference: components["schemas"]["CareerReference"];
        } | null;
        CareerReference: {
            career: string;
            code: string;
            rank: string | null;
            category: string | null;
            progressionOrder: number;
        } | null;
        ProfessorDataPortalProfile: {
            id: number;
            professorId: number;
            portalId: number;
            name: string;
            email: string | null;
            lattesAbstract: string | null;
            unit: {
                id: number;
                code: string;
                name: string;
            };
            department: components["schemas"]["Department"];
            position: components["schemas"]["ProfessorPosition"];
            identifiers: {
                id: number;
                system: string;
                externalId: string;
            }[];
            citationNames: {
                id: number;
                name: string;
            }[];
            trainings: {
                id: number;
                degree: string;
                institutionName: string;
                startYear: number | null;
                endYear: number | null;
            }[];
            keywords: {
                id: number;
                name: string;
                count: number | null;
            }[];
            coauthors: {
                id: number;
                name: string;
                count: number | null;
            }[];
        };
        Keyword: {
            id: number;
            name: string;
        };
        Coauthor: {
            id: number;
            name: string;
        };
        RoomEntity: {
            id: number;
            code: string;
        };
        Catalog: {

            id: number;

            year: number;

            programsCount: number;

            coursesCount: number;

            studentsCount: number;

            programIds: number[];
        };
        CatalogCourseEntity: {
            id: number;
            catalogId: number;
            catalogYear: number;
            courseId: number;
            code: string;
            name: string;
            credits: number;
            coordinator: {
                id: number;
                name: string;
            } | null;
            workload: {
                theoreticalHours: number | null;
                practicalHours: number | null;
                laboratoryHours: number | null;
                guidedActivityHours: number | null;
                distanceHours: number | null;
                guidedExtensionHours: number | null;
                practicalExtensionHours: number | null;
                weeks: number | null;
                weeklyClassHours: number | null;
                classroomHours: number | null;
            };
            offeringPeriod: components["schemas"]["CourseOfferingPeriod"];
            evaluation: string | null;
            finalExam: boolean | null;
            minimumAttendancePercent: number | null;
            syllabus: string | null;
            bibliography: string | null;
            sourceUrl: string | null;
            prerequisites: {
                any: {
                    all: ({
                        courseId: number;
                        fulfillment: components["schemas"]["CatalogCoursePrerequisiteFulfillment"];
                    } | {
                        specialRequirementType: components["schemas"]["CatalogCourseSpecialRequirementType"];
                        specialRequirementValue: number;
                    })[];
                }[];
            };
        };

        CourseOfferingPeriod: "ALL_PERIODS" | "ODD_PERIODS" | "EVEN_PERIODS" | "UNIT_DISCRETION" | null;

        CatalogCoursePrerequisiteFulfillment: "FULL" | "PARTIAL";

        CatalogCourseSpecialRequirementType: "AUTHORIZATION" | "PROGRESSION_COEFFICIENT";
        CoordinatorEntity: {
            id: number;
            name: string;
            catalogCoursesCount: number;
        };
        CatalogProgramEntity: {
            id: number;
            catalogId: number;
            programId: number;
            title: string;
            catalogYear: number;
            programCode: number;
            programName: string;

            shift: "DAYTIME" | "NIGHT" | null;

            creditLimitType: "NONE" | "FIXED" | "CR_FORMULA" | null;
            creditLimitFixedCredits: number | null;
            creditLimitBeforeThresholdCredits: number | null;
            creditLimitThresholdCredits: number | null;
            creditLimitCrBase: number | null;
            creditLimitCrMultiplier: number | null;
            professionalPracticeDescription: string | null;
            base: components["schemas"]["CourseBlockSet"];
            variants: components["schemas"]["CatalogProgramVariant"][];
            languages: components["schemas"]["CatalogProgramLanguage"][];
        };
        CourseBlockSet: {
            mandatory: components["schemas"]["CourseRequirement"][];
            electives: components["schemas"]["ElectiveBlock"][];
        };
        CourseRequirement: {
            id: number;
            type: components["schemas"]["CourseRequirementType"];
            courseId: number | null;
            courseCode: string | null;
            courseName: string | null;
            prefix: string | null;
            catalogCourseId: number | null;
        };

        CourseRequirementType: "any" | "prefix" | "specific";
        ElectiveBlock: {
            credits: number;
            courses: components["schemas"]["CourseRequirement"][];
        };
        CatalogProgramVariant: {
            id: number;
            programId: number | null;
            specializationId: number | null;
            curriculumSuggestionId: number | null;
            code: string;
            name: string;
            integralizationCredits: number | null;
            integralizationSupervisedHours: number | null;
            integralizationExtensionHours: number | null;
            integralizationSemesters: number | null;
            integralizationMaximumSemesters: number | null;
            professionalDescription: string | null;
            recognitionDescription: string | null;
            blocks: components["schemas"]["CourseBlockSet"];
        };
        CatalogProgramLanguage: {
            languageId: number;
            name: string;
            blocks: components["schemas"]["CourseBlockSet"];
        };
        CurriculumSuggestionEntity: {
            id: number;
            catalogProgramVariantId: number;
            catalogProgramId: number;
            catalogYear: number;
            programId: number;
            programCode: number;
            programName: string;
            specialization: {
                id: number;
                code: string;
                name: string;
            } | null;
            semesters: components["schemas"]["SemesterSuggestionEntity"][];
        };
        SemesterSuggestionEntity: {
            semester: number;
            electiveCredits: number;
            courses: components["schemas"]["CurriculumSuggestionCourseEntity"][];
        };
        CurriculumSuggestionCourseEntity: {
            id: number;
            code: string;
            name: string;
            credits: number;
        };
        Language: {
            id: number;
            name: string;
            catalogLanguagesCount: number;
        };
        Program: {
            id: number;
            code: number;
            name: string;
            unitId: number;
            unit: {
                id: number;
                code: string;
            };
            catalogProgramsCount: number;
            studentsCount: number;
        };
        Specialization: {
            id: number;
            programId: number;
            programCode: number;
            programName: string;
            code: string;
            name: string;
            catalogProgramVariantsCount: number;
            studentsCount: number;
        };
        ExchangeNotice: {
            id: number;
            number: string | null;
            issuer: string | null;
            title: string | null;
            place: components["schemas"]["ExchangePlace"];
            registrationOriginalText: string | null;

            registrationStart: string | null;

            registrationEnd: string | null;
            files: components["schemas"]["ExchangeNoticeFile"][];
        };
        ExchangePlace: {
            id: number;
            name: string;
        } | null;
        ExchangeNoticeFile: {
            id: number;
            name: string;

            url: string | null;
        };
        ExchangePlaceListItem: {
            id: number;
            name: string;
        };
        CalendarEvent: {
            id: number;
            startDate: string;
            endDate: string | unknown;
            description: string;
            tags: {
                id: number;
                name: string;
            }[];
        };
        CalendarTag: {
            id: number;
            name: string;
        };
        ClassEntity: {
            id: number;
            code: string;
            reservationPrograms: {
                id: number;
                code: number;
                name: string;
            }[];
            courseId: number;
            studyPeriodId: number;
            professorIds: number[];
            studyPeriodYear: number;
            studyPeriodYearPeriod: components["schemas"]["YearPeriod"];
            courseCode: string;
            unitId: number | null;
            unitCode: string | null;
            professors: {
                id: number;
                name: string;
            }[];
        };

        YearPeriod: "SUMMER" | "FIRST_SEMESTER" | "WINTER" | "SECOND_SEMESTER";
        ClassScheduleEntity: {
            id: number;
            dayOfWeek: components["schemas"]["DayOfWeek"];
            start: string;
            end: string;
            roomId: number;
            classId: number;
            roomCode: string;
            classCode: string;
            unitId: number | null;
            unitCode: string | null;
            courseId: number;
            courseCode: string;
            studyPeriodId: number;
            studyPeriodYear: number;
            studyPeriodYearPeriod: components["schemas"]["YearPeriod"];
        };

        DayOfWeek: "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY";
        PageClassSchedules: {
            data: components["schemas"]["ClassScheduleEntity"][];
            quantity: number;
            total: number;
            links: components["schemas"]["PaginationLinks"];
        };
        DailyMenu: {
            id: number;

            date: string;
            meals: components["schemas"]["Meal"][];

            createdAt: string;

            updatedAt: string;
        };
        Meal: {
            id: number;
            period: components["schemas"]["MealPeriod"];
            diet: components["schemas"]["MealDiet"];
            status: components["schemas"]["MealStatus"];
            mainDish: string | null;
            items: string[];
            observations: string[];
            serviceNotes: string[];
        };

        MealPeriod: "LUNCH" | "DINNER";

        MealDiet: "TRADITIONAL" | "VEGAN";

        MealStatus: "AVAILABLE" | "NOT_REGISTERED";
        StudyPeriodEntity: {
            id: number;
            year: number;
            yearPeriod: components["schemas"]["YearPeriod"];
            startDate: string;
        };
    };
    responses: never;
    parameters: never;
    requestBodies: never;
    headers: never;
    pathItems: never;
}
export type $defs = Record<string, never>;
export interface operations {
    listProfessorEvaluationSummaries: {
        parameters: {
            query?: {

                page?: number;

                pageSize?: number;

                filter?: {
                    professorId?: number | {
                        eq?: number;
                        in?: number[];
                    };
                };

                sort?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {

            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PageProfessorEvaluationSummaries"];
                };
            };

            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["InvalidRequestProblem"];
                };
            };

            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["InternalServerErrorProblem"];
                };
            };
        };
    };
    listCourseEvaluationSummaries: {
        parameters: {
            query?: {

                page?: number;

                pageSize?: number;

                filter?: {
                    courseId?: number | {
                        eq?: number;
                        in?: number[];
                    };
                    courseCode?: string | {
                        eq?: string;
                        ne?: string;
                        in?: string[];
                    };
                };

                sort?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {

            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PageCourseEvaluationSummaries"];
                };
            };

            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["InvalidRequestProblem"];
                };
            };

            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["InternalServerErrorProblem"];
                };
            };
        };
    };
    getCourseProfessorEvaluationSummary: {
        parameters: {
            query: {

                filter: {
                    courseId?: number | {
                        eq?: number;
                        in?: number[];
                    };
                    professorId?: number | {
                        eq?: number;
                        in?: number[];
                    };
                };
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {

            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CourseProfessorEvaluationSummary"];
                };
            };

            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["InvalidRequestProblem"];
                };
            };

            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["ResourceNotFoundProblem"];
                };
            };

            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["InternalServerErrorProblem"];
                };
            };
        };
    };
    getUnits: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {

            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["UnitEntity"];
                };
            };

            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["InvalidRequestProblem"];
                };
            };

            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["ResourceNotFoundProblem"];
                };
            };

            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["InternalServerErrorProblem"];
                };
            };
        };
    };
    listUnits: {
        parameters: {
            query?: {

                page?: number;

                pageSize?: number | "all";

                filter?: {
                    id?: number | {
                        eq?: number;
                        in?: number[];
                    };
                    code?: string | {
                        eq?: string;
                        ne?: string;
                        in?: string[];
                    };
                    name?: string | {
                        eq?: string;
                    };
                };

                sort?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {

            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        data: components["schemas"]["UnitEntity"][];
                        quantity: number;
                        total: number;
                        links: components["schemas"]["PaginationLinks"];
                    };
                };
            };

            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["InvalidRequestProblem"];
                };
            };

            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["InternalServerErrorProblem"];
                };
            };
        };
    };
    getCourses: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {

            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CourseEntity"];
                };
            };

            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["InvalidRequestProblem"];
                };
            };

            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["ResourceNotFoundProblem"];
                };
            };

            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["InternalServerErrorProblem"];
                };
            };
        };
    };
    listCourses: {
        parameters: {
            query?: {

                page?: number;

                pageSize?: number | "all";

                filter?: {
                    catalogYear?: number | {
                        eq?: number;
                        in?: number[];
                    };
                    code?: string | {
                        eq?: string;
                        ne?: string;
                        in?: string[];
                    };
                    credits?: number | {
                        eq?: number;
                        ne?: number;
                        gt?: number;
                        gte?: number;
                        lt?: number;
                        lte?: number;
                        in?: number[];
                    };
                    tagId?: number | {
                        eq?: number;
                        in?: number[];
                    };
                    unit?: {
                        code?: string | {
                            eq?: string;
                            in?: string[];
                        };
                        id?: number | {
                            eq?: number;
                            in?: number[];
                        };
                    };
                };

                sort?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {

            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PageCourses"];
                };
            };

            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["InvalidRequestProblem"];
                };
            };

            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["InternalServerErrorProblem"];
                };
            };
        };
    };
    getProfessors: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {

            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProfessorEntity"];
                };
            };

            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["InvalidRequestProblem"];
                };
            };

            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["ResourceNotFoundProblem"];
                };
            };

            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["InternalServerErrorProblem"];
                };
            };
        };
    };
    listProfessors: {
        parameters: {
            query?: {

                page?: number;

                pageSize?: number;

                filter?: {
                    classId?: number | {
                        eq?: number;
                        in?: number[];
                    };
                };

                sort?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {

            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PageProfessors"];
                };
            };

            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["InvalidRequestProblem"];
                };
            };

            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["InternalServerErrorProblem"];
                };
            };
        };
    };
    listProfessorDataPortalProfiles: {
        parameters: {
            query?: {

                page?: number;

                pageSize?: number;

                filter?: {
                    professorId?: number | {
                        eq?: number;
                        in?: number[];
                    };
                    portalId?: number | {
                        eq?: number;
                        in?: number[];
                    };
                    unitId?: number | {
                        eq?: number;
                        in?: number[];
                    };
                    departmentId?: number | {
                        eq?: number;
                        in?: number[];
                    };
                    positionId?: number | {
                        eq?: number;
                        in?: number[];
                    };
                    name?: string | {
                        eq?: string;
                    };
                };

                sort?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {

            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        data: components["schemas"]["ProfessorDataPortalProfileSummary"][];
                        quantity: number;
                        total: number;
                        links: components["schemas"]["PaginationLinks"];
                    };
                };
            };

            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["InvalidRequestProblem"];
                };
            };

            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["InternalServerErrorProblem"];
                };
            };
        };
    };
    getProfessorDataPortalProfiles: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {

            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProfessorDataPortalProfile"];
                };
            };

            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["InvalidRequestProblem"];
                };
            };

            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["ResourceNotFoundProblem"];
                };
            };

            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["InternalServerErrorProblem"];
                };
            };
        };
    };
    listProfessorPositions: {
        parameters: {
            query?: {

                page?: number;

                pageSize?: number | "all";

                filter?: {
                    id?: number | {
                        eq?: number;
                        in?: number[];
                    };
                    canonicalKey?: string | {
                        eq?: string;
                    };
                    role?: ("PROFESSOR" | "RESEARCHER" | "POSTDOCTORAL_RESEARCHER") | {

                        eq?: "PROFESSOR" | "RESEARCHER" | "POSTDOCTORAL_RESEARCHER";
                        in?: ("PROFESSOR" | "RESEARCHER" | "POSTDOCTORAL_RESEARCHER")[];
                    };
                };

                sort?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {

            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        data: components["schemas"]["ProfessorPosition"][];
                        quantity: number;
                        total: number;
                        links: components["schemas"]["PaginationLinks"];
                    };
                };
            };

            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["InvalidRequestProblem"];
                };
            };

            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["InternalServerErrorProblem"];
                };
            };
        };
    };
    getProfessorPositions: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {

            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProfessorPosition"];
                };
            };

            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["InvalidRequestProblem"];
                };
            };

            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["ResourceNotFoundProblem"];
                };
            };

            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["InternalServerErrorProblem"];
                };
            };
        };
    };
    listDepartments: {
        parameters: {
            query?: {

                page?: number;

                pageSize?: number | "all";

                filter?: {
                    unitId?: number | {
                        eq?: number;
                        in?: number[];
                    };
                    name?: string | {
                        eq?: string;
                    };
                };

                sort?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {

            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        data: components["schemas"]["Department"][];
                        quantity: number;
                        total: number;
                        links: components["schemas"]["PaginationLinks"];
                    };
                };
            };

            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["InvalidRequestProblem"];
                };
            };

            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["InternalServerErrorProblem"];
                };
            };
        };
    };
    getDepartments: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {

            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Department"];
                };
            };

            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["InvalidRequestProblem"];
                };
            };

            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["ResourceNotFoundProblem"];
                };
            };

            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["InternalServerErrorProblem"];
                };
            };
        };
    };
    listKeywords: {
        parameters: {
            query?: {

                page?: number;

                pageSize?: number;

                filter?: {
                    name?: string | {
                        eq?: string;
                    };
                };

                sort?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {

            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        data: components["schemas"]["Keyword"][];
                        quantity: number;
                        total: number;
                        links: components["schemas"]["PaginationLinks"];
                    };
                };
            };

            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["InvalidRequestProblem"];
                };
            };

            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["InternalServerErrorProblem"];
                };
            };
        };
    };
    getKeywords: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {

            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Keyword"];
                };
            };

            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["InvalidRequestProblem"];
                };
            };

            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["ResourceNotFoundProblem"];
                };
            };

            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["InternalServerErrorProblem"];
                };
            };
        };
    };
    listCoauthors: {
        parameters: {
            query?: {

                page?: number;

                pageSize?: number;

                filter?: {
                    name?: string | {
                        eq?: string;
                    };
                };

                sort?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {

            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        data: components["schemas"]["Coauthor"][];
                        quantity: number;
                        total: number;
                        links: components["schemas"]["PaginationLinks"];
                    };
                };
            };

            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["InvalidRequestProblem"];
                };
            };

            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["InternalServerErrorProblem"];
                };
            };
        };
    };
    getCoauthors: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {

            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Coauthor"];
                };
            };

            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["InvalidRequestProblem"];
                };
            };

            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["ResourceNotFoundProblem"];
                };
            };

            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["InternalServerErrorProblem"];
                };
            };
        };
    };
    getRooms: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {

            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["RoomEntity"];
                };
            };

            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["InvalidRequestProblem"];
                };
            };

            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["ResourceNotFoundProblem"];
                };
            };

            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["InternalServerErrorProblem"];
                };
            };
        };
    };
    listRooms: {
        parameters: {
            query?: {

                page?: number;

                pageSize?: number | "all";

                filter?: {
                    id?: number | {
                        eq?: number;
                        in?: number[];
                    };
                    code?: string | {
                        eq?: string;
                        ne?: string;
                        in?: string[];
                    };
                };

                sort?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {

            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        data: components["schemas"]["RoomEntity"][];
                        quantity: number;
                        total: number;
                        links: components["schemas"]["PaginationLinks"];
                    };
                };
            };

            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["InvalidRequestProblem"];
                };
            };

            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["InternalServerErrorProblem"];
                };
            };
        };
    };
    getCatalogs: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {

            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Catalog"];
                };
            };

            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["InvalidRequestProblem"];
                };
            };

            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["ResourceNotFoundProblem"];
                };
            };

            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["InternalServerErrorProblem"];
                };
            };
        };
    };
    listCatalogs: {
        parameters: {
            query?: {

                page?: number;

                pageSize?: number | "all";

                filter?: {
                    year?: number | {
                        eq?: number;
                        in?: number[];
                    };
                };

                sort?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {

            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        data: components["schemas"]["Catalog"][];
                        quantity: number;
                        total: number;
                        links: components["schemas"]["PaginationLinks"];
                    };
                };
            };

            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["InvalidRequestProblem"];
                };
            };

            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["InternalServerErrorProblem"];
                };
            };
        };
    };
    listCatalogCourses: {
        parameters: {
            query?: {

                page?: number;

                pageSize?: number | "all";

                filter?: {
                    catalogId?: number | {
                        eq?: number;
                        in?: number[];
                    };
                    catalogYear?: number | {
                        eq?: number;
                        in?: number[];
                    };
                    courseId?: number | {
                        eq?: number;
                        in?: number[];
                    };
                    courseCode?: string | {
                        eq?: string;
                        ne?: string;
                        in?: string[];
                    };
                    unit?: {
                        id?: number | {
                            eq?: number;
                            in?: number[];
                        };
                        code?: string | {
                            eq?: string;
                            in?: string[];
                        };
                    };
                    coordinatorId?: number | {
                        eq?: number;
                        in?: number[];
                    };
                    offeringPeriod?: ("ALL_PERIODS" | "ODD_PERIODS" | "EVEN_PERIODS" | "UNIT_DISCRETION") | {

                        eq?: "ALL_PERIODS" | "ODD_PERIODS" | "EVEN_PERIODS" | "UNIT_DISCRETION";
                        in?: ("ALL_PERIODS" | "ODD_PERIODS" | "EVEN_PERIODS" | "UNIT_DISCRETION")[];
                    };
                };

                sort?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {

            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        data: components["schemas"]["CatalogCourseEntity"][];
                        quantity: number;
                        total: number;
                        links: components["schemas"]["PaginationLinks"];
                    };
                };
            };

            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["InvalidRequestProblem"];
                };
            };

            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["InternalServerErrorProblem"];
                };
            };
        };
    };
    getCatalogCourses: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {

            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CatalogCourseEntity"];
                };
            };

            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["InvalidRequestProblem"];
                };
            };

            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["ResourceNotFoundProblem"];
                };
            };

            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["InternalServerErrorProblem"];
                };
            };
        };
    };
    listCoordinators: {
        parameters: {
            query?: {

                page?: number;

                pageSize?: number | "all";

                filter?: {
                    name?: string | {
                        eq?: string;
                    };
                };

                sort?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {

            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        data: components["schemas"]["CoordinatorEntity"][];
                        quantity: number;
                        total: number;
                        links: components["schemas"]["PaginationLinks"];
                    };
                };
            };

            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["InvalidRequestProblem"];
                };
            };

            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["InternalServerErrorProblem"];
                };
            };
        };
    };
    getCoordinators: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {

            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CoordinatorEntity"];
                };
            };

            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["InvalidRequestProblem"];
                };
            };

            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["ResourceNotFoundProblem"];
                };
            };

            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["InternalServerErrorProblem"];
                };
            };
        };
    };
    getCatalogPrograms: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {

            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CatalogProgramEntity"];
                };
            };

            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["InvalidRequestProblem"];
                };
            };

            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["ResourceNotFoundProblem"];
                };
            };

            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["InternalServerErrorProblem"];
                };
            };
        };
    };
    listCatalogPrograms: {
        parameters: {
            query?: {

                page?: number;

                pageSize?: number | "all";

                filter?: {
                    catalogId?: number | {
                        eq?: number;
                        in?: number[];
                    };
                    catalogYear?: number | {
                        eq?: number;
                        in?: number[];
                    };
                    programId?: number | {
                        eq?: number;
                        in?: number[];
                    };
                    programCode?: number | {
                        eq?: number;
                        in?: number[];
                    };
                };

                sort?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {

            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        data: components["schemas"]["CatalogProgramEntity"][];
                        quantity: number;
                        total: number;
                        links: components["schemas"]["PaginationLinks"];
                    };
                };
            };

            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["InvalidRequestProblem"];
                };
            };

            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["InternalServerErrorProblem"];
                };
            };
        };
    };
    getCurriculumSuggestions: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {

            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CurriculumSuggestionEntity"];
                };
            };

            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["InvalidRequestProblem"];
                };
            };

            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["ResourceNotFoundProblem"];
                };
            };

            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["InternalServerErrorProblem"];
                };
            };
        };
    };
    listCurriculumSuggestions: {
        parameters: {
            query?: {

                page?: number;

                pageSize?: number | "all";

                filter?: {
                    catalogProgramId?: number | {
                        eq?: number;
                        in?: number[];
                    };
                    catalogProgramVariantId?: number | {
                        eq?: number;
                        in?: number[];
                    };
                    catalogId?: number | {
                        eq?: number;
                        in?: number[];
                    };
                    catalogYear?: number | {
                        eq?: number;
                        in?: number[];
                    };
                    programId?: number | {
                        eq?: number;
                        in?: number[];
                    };
                    programCode?: number | {
                        eq?: number;
                        in?: number[];
                    };
                    specializationId?: number | {
                        eq?: number;
                        in?: number[];
                    };
                };

                sort?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {

            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        data: components["schemas"]["CurriculumSuggestionEntity"][];
                        quantity: number;
                        total: number;
                        links: components["schemas"]["PaginationLinks"];
                    };
                };
            };

            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["InvalidRequestProblem"];
                };
            };

            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["InternalServerErrorProblem"];
                };
            };
        };
    };
    getLanguages: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {

            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Language"];
                };
            };

            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["InvalidRequestProblem"];
                };
            };

            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["ResourceNotFoundProblem"];
                };
            };

            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["InternalServerErrorProblem"];
                };
            };
        };
    };
    listLanguages: {
        parameters: {
            query?: {

                page?: number;

                pageSize?: number | "all";

                filter?: {
                    id?: number | {
                        eq?: number;
                        in?: number[];
                    };
                    name?: string | {
                        eq?: string;
                    };
                };

                sort?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {

            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        data: components["schemas"]["Language"][];
                        quantity: number;
                        total: number;
                        links: components["schemas"]["PaginationLinks"];
                    };
                };
            };

            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["InvalidRequestProblem"];
                };
            };

            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["InternalServerErrorProblem"];
                };
            };
        };
    };
    getPrograms: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {

            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Program"];
                };
            };

            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["InvalidRequestProblem"];
                };
            };

            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["ResourceNotFoundProblem"];
                };
            };

            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["InternalServerErrorProblem"];
                };
            };
        };
    };
    listPrograms: {
        parameters: {
            query?: {

                page?: number;

                pageSize?: number | "all";

                filter?: {
                    unitId?: number | {
                        eq?: number;
                        in?: number[];
                    };
                };

                sort?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {

            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        data: components["schemas"]["Program"][];
                        quantity: number;
                        total: number;
                        links: components["schemas"]["PaginationLinks"];
                    };
                };
            };

            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["InvalidRequestProblem"];
                };
            };

            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["InternalServerErrorProblem"];
                };
            };
        };
    };
    getSpecializations: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {

            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Specialization"];
                };
            };

            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["InvalidRequestProblem"];
                };
            };

            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["ResourceNotFoundProblem"];
                };
            };

            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["InternalServerErrorProblem"];
                };
            };
        };
    };
    listSpecializations: {
        parameters: {
            query?: {

                page?: number;

                pageSize?: number | "all";

                filter?: {
                    programId?: number | {
                        eq?: number;
                        in?: number[];
                    };
                    programCode?: number | {
                        eq?: number;
                        in?: number[];
                    };
                    code?: string | {
                        eq?: string;
                        ne?: string;
                        in?: string[];
                    };
                };

                sort?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {

            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        data: components["schemas"]["Specialization"][];
                        quantity: number;
                        total: number;
                        links: components["schemas"]["PaginationLinks"];
                    };
                };
            };

            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["InvalidRequestProblem"];
                };
            };

            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["InternalServerErrorProblem"];
                };
            };
        };
    };
    getExchangeNotices: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {

            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ExchangeNotice"];
                };
            };

            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["InvalidRequestProblem"];
                };
            };

            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["ResourceNotFoundProblem"];
                };
            };

            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["InternalServerErrorProblem"];
                };
            };
        };
    };
    listExchangeNotices: {
        parameters: {
            query?: {

                page?: number;

                pageSize?: number | "all";

                filter?: {
                    number?: string | {
                        eq?: string;
                        ne?: string;
                        in?: string[];
                    };
                    issuer?: string | {
                        eq?: string;
                        ne?: string;
                        in?: string[];
                    };
                    title?: string | {
                        eq?: string;
                        ne?: string;
                        in?: string[];
                    };
                    placeId?: number | {
                        eq?: number;
                        ne?: number;
                        in?: number[];
                    };
                    placeName?: string | {
                        eq?: string;
                    };
                    registrationStart?: string | {

                        eq?: string;

                        ne?: string;

                        gt?: string;

                        gte?: string;

                        lt?: string;

                        lte?: string;
                        in?: string[];
                    };
                    registrationEnd?: string | {

                        eq?: string;

                        ne?: string;

                        gt?: string;

                        gte?: string;

                        lt?: string;

                        lte?: string;
                        in?: string[];
                    };
                };

                sort?: string;
                q?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {

            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        data: components["schemas"]["ExchangeNotice"][];
                        quantity: number;
                        total: number;
                        links: components["schemas"]["PaginationLinks"];
                    };
                };
            };

            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["InvalidRequestProblem"];
                };
            };

            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["InternalServerErrorProblem"];
                };
            };
        };
    };
    listExchangePlaces: {
        parameters: {
            query?: {

                page?: number;

                pageSize?: number | "all";

                filter?: {
                    id?: number | {
                        eq?: number;
                        in?: number[];
                    };
                    name?: string | {
                        eq?: string;
                    };
                };

                sort?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {

            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        data: components["schemas"]["ExchangePlaceListItem"][];
                        quantity: number;
                        total: number;
                        links: components["schemas"]["PaginationLinks"];
                    };
                };
            };

            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["InvalidRequestProblem"];
                };
            };

            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["InternalServerErrorProblem"];
                };
            };
        };
    };
    getCalendarFeed: {
        parameters: {
            query?: {

                filter?: {
                    startDate?: string | {

                        eq?: string;
                        in?: string[];
                    };
                    endDate?: string | {

                        eq?: string;
                        in?: string[];
                    };
                    tagId?: number | {
                        eq?: number;
                        in?: number[];
                    };
                };
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {

            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/calendar": string;
                };
            };

            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["InvalidRequestProblem"];
                };
            };

            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["InternalServerErrorProblem"];
                };
            };
        };
    };
    getCalendarEvents: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {

            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CalendarEvent"];
                };
            };

            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["InvalidRequestProblem"];
                };
            };

            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["ResourceNotFoundProblem"];
                };
            };

            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["InternalServerErrorProblem"];
                };
            };
        };
    };
    listCalendarEvents: {
        parameters: {
            query?: {

                page?: number;

                pageSize?: number | "all";

                filter?: {
                    startDate?: string | {

                        eq?: string;
                        in?: string[];
                    };
                    endDate?: string | {

                        eq?: string;
                        in?: string[];
                    };
                    tagId?: number | {
                        eq?: number;
                        in?: number[];
                    };
                };

                sort?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {

            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        data: components["schemas"]["CalendarEvent"][];
                        quantity: number;
                        total: number;
                        links: components["schemas"]["PaginationLinks"];
                    };
                };
            };

            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["InvalidRequestProblem"];
                };
            };

            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["InternalServerErrorProblem"];
                };
            };
        };
    };
    getCalendarTags: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {

            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CalendarTag"];
                };
            };

            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["InvalidRequestProblem"];
                };
            };

            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["ResourceNotFoundProblem"];
                };
            };

            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["InternalServerErrorProblem"];
                };
            };
        };
    };
    listCalendarTags: {
        parameters: {
            query?: {

                page?: number;

                pageSize?: number | "all";

                filter?: {
                    id?: number | {
                        eq?: number;
                        in?: number[];
                    };
                    name?: string | {
                        eq?: string;
                    };
                };

                sort?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {

            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        data: components["schemas"]["CalendarTag"][];
                        quantity: number;
                        total: number;
                        links: components["schemas"]["PaginationLinks"];
                    };
                };
            };

            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["InvalidRequestProblem"];
                };
            };

            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["InternalServerErrorProblem"];
                };
            };
        };
    };
    getClasses: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {

            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ClassEntity"];
                };
            };

            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["InvalidRequestProblem"];
                };
            };

            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["ResourceNotFoundProblem"];
                };
            };

            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["InternalServerErrorProblem"];
                };
            };
        };
    };
    listClasses: {
        parameters: {
            query?: {

                page?: number;

                pageSize?: number;

                filter?: {
                    classCode?: string | {
                        eq?: string;
                    };
                    unitId?: number | {
                        eq?: number;
                        in?: number[];
                    };
                    unitCode?: string | {
                        eq?: string;
                    };
                    courseId?: number | {
                        eq?: number;
                        in?: number[];
                    };
                    courseCode?: string | {
                        eq?: string;
                    };
                    studyPeriodId?: number | {
                        eq?: number;
                        in?: number[];
                    };
                    studyPeriodYear?: number | {
                        eq?: number;
                        in?: number[];
                    };
                    studyPeriodYearPeriod?: ("SUMMER" | "FIRST_SEMESTER" | "WINTER" | "SECOND_SEMESTER") | {

                        eq?: "SUMMER" | "FIRST_SEMESTER" | "WINTER" | "SECOND_SEMESTER";
                        in?: ("SUMMER" | "FIRST_SEMESTER" | "WINTER" | "SECOND_SEMESTER")[];
                    };
                    professorId?: number | {
                        eq?: number;
                        in?: number[];
                    };
                    professorName?: string | {
                        eq?: string;
                    };
                };

                sort?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {

            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        data: components["schemas"]["ClassEntity"][];
                        quantity: number;
                        total: number;
                        links: components["schemas"]["PaginationLinks"];
                    };
                };
            };

            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["InvalidRequestProblem"];
                };
            };

            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["InternalServerErrorProblem"];
                };
            };
        };
    };
    getClassSchedules: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {

            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ClassScheduleEntity"];
                };
            };

            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["InvalidRequestProblem"];
                };
            };

            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["ResourceNotFoundProblem"];
                };
            };

            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["InternalServerErrorProblem"];
                };
            };
        };
    };
    listClassSchedules: {
        parameters: {
            query?: {

                page?: number;

                pageSize?: number;

                filter?: {
                    dayOfWeek?: ("MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY") | {

                        eq?: "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY";
                        in?: ("MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY")[];
                    };
                    room?: {
                        id?: number | {
                            eq?: number;
                            in?: number[];
                        };
                        code?: string | {
                            eq?: string;
                            in?: string[];
                        };
                    };
                    class?: {
                        id?: number | {
                            eq?: number;
                            in?: number[];
                        };
                    };
                    course?: {
                        id?: number | {
                            eq?: number;
                            in?: number[];
                        };
                        code?: string | {
                            eq?: string;
                            in?: string[];
                        };
                    };
                    unit?: {
                        id?: number | {
                            eq?: number;
                            in?: number[];
                        };
                        code?: string | {
                            eq?: string;
                            in?: string[];
                        };
                    };
                    studyPeriod?: {
                        id?: number | {
                            eq?: number;
                            in?: number[];
                        };
                        year?: number | {
                            eq?: number;
                            in?: number[];
                        };
                        yearPeriod?: ("SUMMER" | "FIRST_SEMESTER" | "WINTER" | "SECOND_SEMESTER") | {

                            eq?: "SUMMER" | "FIRST_SEMESTER" | "WINTER" | "SECOND_SEMESTER";
                            in?: ("SUMMER" | "FIRST_SEMESTER" | "WINTER" | "SECOND_SEMESTER")[];
                        };
                    };
                };

                sort?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {

            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PageClassSchedules"];
                };
            };

            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["InvalidRequestProblem"];
                };
            };

            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["InternalServerErrorProblem"];
                };
            };
        };
    };
    getDailyMenus: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {

            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["DailyMenu"];
                };
            };

            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["InvalidRequestProblem"];
                };
            };

            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["ResourceNotFoundProblem"];
                };
            };

            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["InternalServerErrorProblem"];
                };
            };
        };
    };
    listDailyMenus: {
        parameters: {
            query?: {

                page?: number;

                pageSize?: number | "all";

                filter?: {
                    date?: string | {

                        eq?: string;

                        gte?: string;

                        lte?: string;
                    };
                };

                sort?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {

            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        data: components["schemas"]["DailyMenu"][];
                        quantity: number;
                        total: number;
                        links: components["schemas"]["PaginationLinks"];
                    };
                };
            };

            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["InvalidRequestProblem"];
                };
            };

            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["InternalServerErrorProblem"];
                };
            };
        };
    };
    getStudyPeriods: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {

            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["StudyPeriodEntity"];
                };
            };

            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["InvalidRequestProblem"];
                };
            };

            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["ResourceNotFoundProblem"];
                };
            };

            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["InternalServerErrorProblem"];
                };
            };
        };
    };
    listStudyPeriods: {
        parameters: {
            query?: {

                page?: number;

                pageSize?: number | "all";

                filter?: {
                    id?: number | {
                        eq?: number;
                        in?: number[];
                    };
                    year?: number | {
                        eq?: number;
                        in?: number[];
                    };
                    yearPeriod?: ("SUMMER" | "FIRST_SEMESTER" | "WINTER" | "SECOND_SEMESTER") | {

                        eq?: "SUMMER" | "FIRST_SEMESTER" | "WINTER" | "SECOND_SEMESTER";
                        in?: ("SUMMER" | "FIRST_SEMESTER" | "WINTER" | "SECOND_SEMESTER")[];
                    };
                };

                sort?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {

            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        data: components["schemas"]["StudyPeriodEntity"][];
                        quantity: number;
                        total: number;
                        links: components["schemas"]["PaginationLinks"];
                    };
                };
            };

            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["InvalidRequestProblem"];
                };
            };

            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["InternalServerErrorProblem"];
                };
            };
        };
    };
}
