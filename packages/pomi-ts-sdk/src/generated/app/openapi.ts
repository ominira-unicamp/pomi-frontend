export interface paths {
    "/me": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };

        get: operations["listMe"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/bots": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };

        get: operations["listBots"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/me/bot-grants": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };

        get: operations["listMeBotGrants"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/me/bot-grants/{botAuthUserId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;

        put: operations["updateMeBotGrants"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/students/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };

        get: operations["getStudents"];
        put?: never;
        post?: never;

        delete: operations["deleteStudents"];
        options?: never;
        head?: never;

        patch: operations["updateStudents"];
        trace?: never;
    };
    "/students": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;

        post: operations["createStudents"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/student/{sid}/curricula/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };

        get: operations["getStudentCurricula"];
        put?: never;
        post?: never;

        delete: operations["deleteStudentCurricula"];
        options?: never;
        head?: never;

        patch: operations["updateStudentCurricula"];
        trace?: never;
    };
    "/student/{sid}/curricula": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };

        get: operations["listStudentCurricula"];
        put?: never;

        post: operations["createStudentCurricula"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/student/{sid}/period-plannings/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };

        get: operations["getStudentPeriodPlannings"];
        put?: never;
        post?: never;

        delete: operations["deleteStudentPeriodPlannings"];
        options?: never;
        head?: never;

        patch: operations["updateStudentPeriodPlannings"];
        trace?: never;
    };
    "/student/{sid}/period-plannings": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };

        get: operations["listStudentPeriodPlannings"];
        put?: never;

        post: operations["createStudentPeriodPlannings"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/student/{sid}/period-plan/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };

        get: operations["getStudentPeriodPlan"];
        put?: never;
        post?: never;

        delete: operations["deleteStudentPeriodPlan"];
        options?: never;
        head?: never;

        patch: operations["updateStudentPeriodPlan"];
        trace?: never;
    };
    "/student/{sid}/period-plan": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };

        get: operations["listStudentPeriodPlan"];
        put?: never;

        post: operations["createStudentPeriodPlan"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/shared-period-plannings": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };

        get: operations["listSharedPeriodPlannings"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/shared-period-plannings/{shareId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };

        get: operations["getSharedPeriodPlannings"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/student/{sid}/shared-period-plannings": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };

        get: operations["listStudentSharedPeriodPlannings"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/student/{sid}/shared-period-plannings/{shareId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };

        get: operations["getStudentSharedPeriodPlannings"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/student/{sid}/classes/{classId}/professors/{professorId}/evaluation": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };

        get: operations["listStudentClassesProfessorsEvaluation"];

        put: operations["updateStudentClassesProfessorsEvaluation"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/student/{sid}/professor-evaluations/pending": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };

        get: operations["listStudentProfessorEvaluationsPending"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/student/{sid}/course-attempts/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };

        get: operations["getStudentCourseAttempts"];
        put?: never;
        post?: never;

        delete: operations["deleteStudentCourseAttempts"];
        options?: never;
        head?: never;

        patch: operations["updateStudentCourseAttempts"];
        trace?: never;
    };
    "/student/{sid}/course-attempts": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };

        get: operations["listStudentCourseAttempts"];
        put?: never;

        post: operations["createStudentCourseAttempts"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/student/{sid}/course-history": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;

        post: operations["createStudentCourseHistory"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/student/{sid}/absences": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };

        get: operations["listStudentAbsences"];
        put?: never;

        post: operations["createStudentAbsences"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/student/{sid}/absences/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;

        delete: operations["deleteStudentAbsences"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/student/{sid}/public-profile": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };

        get: operations["listStudentPublicProfile"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;

        patch: operations["updateStudentPublicProfile"];
        trace?: never;
    };
    "/student/{sid}/people": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };

        get: operations["listStudentPeople"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/student/{sid}/people/{publicId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };

        get: operations["getStudentPeople"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/student/{sid}/friendships": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };

        get: operations["listStudentFriendships"];
        put?: never;

        post: operations["createStudentFriendships"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/student/{sid}/friendships/{id}/accept": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;

        post: operations["createStudentFriendshipsAccept"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/student/{sid}/friendships/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;

        delete: operations["deleteStudentFriendships"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/feedback-reports": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;

        post: operations["createFeedbackReports"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/student/{sid}/feedback-reports": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };

        get: operations["listStudentFeedbackReports"];
        put?: never;

        post: operations["createStudentFeedbackReports"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/student/{sid}/exchange-notice-subscription": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };

        get: operations["listStudentExchangeNoticeSubscription"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;

        patch: operations["updateStudentExchangeNoticeSubscription"];
        trace?: never;
    };
    "/exchange-notice-subscriptions/unsubscribe": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;

        post: operations["createExchangeNoticeSubscriptionsUnsubscribe"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/categories": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };

        get: operations["listCategories"];
        put?: never;

        post: operations["createCategories"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/categories/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };

        get: operations["getCategories"];

        put: operations["updateCategories"];
        post?: never;

        delete: operations["deleteCategories"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/tags": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };

        get: operations["listTags"];
        put?: never;

        post: operations["createTags"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/tags/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };

        get: operations["getTags"];

        put: operations["updateTags"];
        post?: never;

        delete: operations["deleteTags"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/courses/{courseId}/tags": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };

        get: operations["listCoursesTags"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/tags/{id}/courses": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };

        get: operations["listTagsCourses"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/courses/{courseId}/tags/{tagId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;

        put: operations["updateCoursesTags"];
        post?: never;

        delete: operations["deleteCoursesTags"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/student/{sid}/tag-interests": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };

        get: operations["listStudentTagInterests"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/student/{sid}/tag-interests/{tagId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;

        put: operations["updateStudentTagInterests"];
        post?: never;

        delete: operations["deleteStudentTagInterests"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
}
export type webhooks = Record<string, never>;
export interface components {
    schemas: {
        CurrentUserEntity: {
            id: number;
            roles: string[];
            capabilities: string[];
            studentId: number | null;
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
        BotIdentityEntity: {
            id: number;
            displayName: string | null;
        };
        BotGrantEntity: {
            id: number;
            studentId: number;
            botAuthUserId: number;

            capability: "STUDENT_PROFILE_READ" | "STUDENT_PROFILE_WRITE" | "STUDENT_HISTORY_READ" | "STUDENT_HISTORY_WRITE" | "STUDENT_PLANNING_READ" | "STUDENT_PLANNING_WRITE" | "STUDENT_SOCIAL_READ" | "STUDENT_SOCIAL_WRITE" | "STUDENT_FEEDBACK_READ" | "STUDENT_FEEDBACK_WRITE";

            createdAt: string | null;

            revokedAt: string | null;
            botAuthUser: {
                id: number;
                displayName: string | null;
            };
        };
        ResourceNotFoundProblem: {

            type: "urn:pomi:problem:resource-not-found";

            title: "Recurso não encontrado";

            status: 404;
            detail: string;
            instance?: string;
        };
        ReplaceBotGrantBody: {
            capabilities: ("STUDENT_PROFILE_READ" | "STUDENT_PROFILE_WRITE" | "STUDENT_HISTORY_READ" | "STUDENT_HISTORY_WRITE" | "STUDENT_PLANNING_READ" | "STUDENT_PLANNING_WRITE" | "STUDENT_SOCIAL_READ" | "STUDENT_SOCIAL_WRITE" | "STUDENT_FEEDBACK_READ" | "STUDENT_FEEDBACK_WRITE")[];
        };
        StudentEntity: {
            id: number;
            ra: string;
            name: string;
            programId: number | null;
            specializationId: number | null;
            catalogId: number | null;
            entryYear: number | null;
            languageId: number | null;
            _paths: {
                classes: string;
                classSchedules: string;
            };
        };
        UniqueConstraintConflictProblem: {

            type: "urn:pomi:problem:unique-constraint-conflict";

            title: "Informação já utilizada";

            status: 409;
            detail: string;
            instance?: string;
            fields: components["schemas"]["ProblemField"][];
        };
        ReferenceNotFoundProblem: {

            type: "urn:pomi:problem:reference-not-found";

            title: "Referência não encontrada";

            status: 422;
            detail: string;
            instance?: string;
            fields: components["schemas"]["ProblemField"][];
        };
        InvalidStudentProfileProblem: {

            type: "urn:pomi:problem:invalid-student-profile";

            title: "Perfil de aluno inválido";

            status: 422;
            detail: string;
            instance?: string;
            fields: {
                code: string;
                path: string[];
                message: string;
            }[];
        };
        CreateStudentBody: {
            name: string;
            programId?: number | null;
            specializationId?: number | null;
            catalogId?: number | null;
            entryYear?: number | null;
            languageId?: number | null;
        };
        PatchStudentBody: {
            ra?: string;
            name?: string;
            programId?: number | null;
            specializationId?: number | null;
            catalogId?: number | null;
            entryYear?: number | null;
            languageId?: number | null;
        };
        CurriculumEntity: {
            id: number;
            studentId: number;
            name: string;
            isFavorite: boolean;
            selection: {
                catalogProgramId: number | null;
                specializationId: number | null;
                languageId: number | null;
            };
            planningStart: {
                year: number;
                semester: 1 | 2;
                semesterNumber: number;
            } | null;
            currentPeriodId: number | null;
            courses: {
                courseId: number;
                periodId: number | null;
                name: string;
                code: string;
                credits: number;
            }[];
            periods: {
                id: number;
                position: number;
            }[];

            createdAt: string;

            updatedAt: string;
            _paths: {
                self: string;
                student: string;
            };
        };
        CurriculumSummaryEntity: {
            id: number;
            studentId: number;
            name: string;
            isFavorite: boolean;
            selection: {
                catalogProgramId: number | null;
                specializationId: number | null;
                languageId: number | null;
            };

            createdAt: string;

            updatedAt: string;
            _paths: {
                self: string;
                student: string;
            };
        };
        InvalidCurriculumProblem: {

            type: "urn:pomi:problem:invalid-curriculum";

            title: "Planejamento curricular inválido";

            status: 422;
            detail: string;
            instance?: string;
            fields: {
                code: string;
                path: string[];
                message: string;
            }[];
        };
        PeriodPlanningEntity: {
            id: number;
            studentId: number;
            name: string;
            studyPeriodId: number;
            studyPeriodYear: number;

            studyPeriodYearPeriod: "SUMMER" | "FIRST_SEMESTER" | "WINTER" | "SECOND_SEMESTER";
            curriculumId: number | null;

            visibility: "PRIVATE" | "FRIENDS" | "PUBLIC";

            shareId: string;
            guide: {

                mode: "CURRICULUM" | "PROGRAM" | "NONE";

                curriculumSource: "SAVED" | "SUGGESTION" | null;
                curriculumId: number | null;
                suggestionId: number | null;
                suggestionCatalogProgramId?: number | null;
                catalogProgramId: number | null;
                specializationId: number | null;
                languageId: number | null;
                manualCourseIds: number[];
            };

            createdAt: string;

            updatedAt: string;
            classes: {
                id: number;
                code: string;
                reservations: number[];
                courseId: number;
                courseCode: string;
                courseCredits: number;
                professors: {
                    id: number;
                    name: string;
                }[];
                classSchedules: {
                    id: number;

                    dayOfWeek: "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY";
                    start: string;
                    end: string;
                    roomId: number;
                    roomCode: string;
                }[];
            }[];
            _paths: {
                self: string;
                student: string;
                studyPeriod: string;
                curriculum: string | null;
            };
        };
        InvalidPeriodPlanProblem: {

            type: "urn:pomi:problem:invalid-period-plan";

            title: "Planejamento de semestre inválido";

            status: 422;
            detail: string;
            instance?: string;
            fields: {
                code: string;
                path: string[];
                message: string;
            }[];
        };
        CreatePeriodPlanningInput: {
            name?: string;
            studyPeriodId: number;
            curriculumId?: number | null;
            guide?: {

                mode: "CURRICULUM" | "PROGRAM" | "NONE";

                curriculumSource: "SAVED" | "SUGGESTION" | null;
                curriculumId: number | null;
                suggestionId: number | null;
                suggestionCatalogProgramId?: number | null;
                catalogProgramId: number | null;
                specializationId: number | null;
                languageId: number | null;
                manualCourseIds: number[];
            };
            classes: number[];
        };
        UpdatePeriodPlanningInput: {
            name?: string;

            visibility?: "PRIVATE" | "FRIENDS" | "PUBLIC";
            curriculumId?: number | null;
            guide?: {

                mode: "CURRICULUM" | "PROGRAM" | "NONE";

                curriculumSource: "SAVED" | "SUGGESTION" | null;
                curriculumId: number | null;
                suggestionId: number | null;
                suggestionCatalogProgramId?: number | null;
                catalogProgramId: number | null;
                specializationId: number | null;
                languageId: number | null;
                manualCourseIds: number[];
            };
            classes?: {
                set?: number[];
                add?: number[];
                remove?: number[];
            };
        };
        SharedPeriodPlanning: {

            shareId: string;
            name: string;

            visibility: "FRIENDS" | "PUBLIC";
            studyPeriodId: number;
            studyPeriodYear: number;

            studyPeriodYearPeriod: "SUMMER" | "FIRST_SEMESTER" | "WINTER" | "SECOND_SEMESTER";
            owner: {

                publicId: string;
                displayName: string;
            } | null;
            classes: {
                id: number;
                code: string;
                reservations: number[];
                courseId: number;
                courseCode: string;
                courseCredits: number;
                professors: {
                    id: number;
                    name: string;
                }[];
                classSchedules: {
                    id: number;

                    dayOfWeek: "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY";
                    start: string;
                    end: string;
                    roomId: number;
                    roomCode: string;
                }[];
            }[];

            createdAt: string;

            updatedAt: string;
        };
        ProfessorEvaluationEligibility: {
            eligible: boolean;
            evaluation: components["schemas"]["ProfessorEvaluation"];
        };
        ProfessorEvaluation: {
            wouldTakeAgain: number;
            fairness: number;
            clarity: number;
            difficulty: number;
            id: number;
            studentId: number;
            classId: number;
            professorId: number;

            createdAt: string;

            updatedAt: string;
        } | null;
        InvalidProfessorEvaluationProblem: {

            type: "urn:pomi:problem:invalid-professor-evaluation";

            title: "Avaliação de professor inválida";

            status: 422;
            detail: string;
            instance?: string;
            fields: {
                code: string;
                path: string[];
                message: string;
            }[];
        };
        ProfessorEvaluationBody: {
            wouldTakeAgain: number;
            fairness: number;
            clarity: number;
            difficulty: number;
        };
        PendingProfessorEvaluation: {
            attemptId: number;
            class: {
                id: number;
                code: string;
            };
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
        StudentCourseAttempt: {
            id: number;
            studentId: number;
            courseId: number;
            studyPeriodId: number | null;
            classId: number | null;

            evaluationMode: "GRADE_AND_ATTENDANCE" | "ATTENDANCE" | "CONCEPT";

            status: "ENROLLED" | "DROPPED" | "APPROVED" | "FAILED_BY_GRADE" | "APPROVED_BY_ATTENDANCE" | "APPROVED_BY_PROFICIENCY" | "FAILED_BY_ATTENDANCE" | "SUFFICIENT" | "INSUFFICIENT";
            grade: number | null;

            createdAt: string;

            updatedAt: string;
            course: {
                id: number;
                code: string;
                name: string;
                credits: number;
                unit: {
                    id: number;
                    code: string;
                } | null;
            };
            studyPeriod: {
                id: number;
                year: number;

                yearPeriod: "SUMMER" | "FIRST_SEMESTER" | "WINTER" | "SECOND_SEMESTER";
            } | null;
            class: {
                id: number;
                code: string;
                professors: {
                    id: number;
                    name: string;
                }[];
            } | null;
            _paths: {
                self: string;
                student: string;
                course: string;
                studyPeriod: string | null;
                class: string | null;
            };
        };
        InvalidStudentCourseAttemptProblem: {

            type: "urn:pomi:problem:invalid-student-course-attempt";

            title: "Tentativa de disciplina inválida";

            status: 422;
            detail: string;
            instance?: string;
            fields: {
                code: string;
                path: string[];
                message: string;
            }[];
        };
        CreateStudentCourseAttemptInput: {
            courseId: number;
            studyPeriodId?: number | null;
            classId?: number | null;

            evaluationMode?: "GRADE_AND_ATTENDANCE" | "ATTENDANCE" | "CONCEPT";

            status: "ENROLLED" | "DROPPED" | "APPROVED" | "FAILED_BY_GRADE" | "APPROVED_BY_ATTENDANCE" | "APPROVED_BY_PROFICIENCY" | "FAILED_BY_ATTENDANCE" | "SUFFICIENT" | "INSUFFICIENT";
            grade?: number | null;
        };
        UpdateStudentCourseAttemptInput: {
            studyPeriodId?: number | null;
            classId?: number | null;

            evaluationMode?: "GRADE_AND_ATTENDANCE" | "ATTENDANCE" | "CONCEPT";

            status?: "ENROLLED" | "DROPPED" | "APPROVED" | "FAILED_BY_GRADE" | "APPROVED_BY_ATTENDANCE" | "APPROVED_BY_PROFICIENCY" | "FAILED_BY_ATTENDANCE" | "SUFFICIENT" | "INSUFFICIENT";
            grade?: number | null;
        };
        StudentHistoryImportSummary: {
            created: number;
            updated: number;
            skipped: number;
            warnings: {
                year: number | null;
                yearPeriod: string | null;
                code: string | null;
                message: string;
            }[];
        };
        InvalidStudentHistoryImportProblem: {

            type: "urn:pomi:problem:invalid-student-history-import";

            title: "Importação de histórico escolar inválida";

            status: 422;
            detail: string;
            instance?: string;
            fields: {
                code: string;
                path: string[];
                message: string;
            }[];
        };
        StudentHistoryImportBody: {

            format: "pomi-student-history";

            version: 1;
            student: {
                ra: string;
            };
            semesters: {
                year: number;

                yearPeriod: "SUMMER" | "FIRST_SEMESTER" | "WINTER" | "SECOND_SEMESTER";
                courses: {
                    code: string;
                    name: string;
                    grade: number | null;
                    workloadHours: number | null;
                    credits: number | null;

                    status: "APPROVED" | "APPROVED_BY_ATTENDANCE" | "APPROVED_BY_PROFICIENCY" | "DROPPED" | "FAILED_BY_ATTENDANCE" | "SUFFICIENT";
                }[];
            }[];
        };
        StudentAbsence: {
            id: number;
            studentCourseAttemptId: number;
            classScheduleId: number;

            date: string;

            createdAt: string;

            updatedAt: string;
            studyPeriodId: number;
            studyPeriodYear: number;

            studyPeriodYearPeriod: "SUMMER" | "FIRST_SEMESTER" | "WINTER" | "SECOND_SEMESTER";
            courseId: number;
            courseCode: string;
            classId: number;
            classCode: string;

            dayOfWeek: "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY";
            start: string;
            end: string;
            _paths: {
                self: string;
                courseAttempt: string;
                classSchedule: string;
                class: string;
                course: string;
                studyPeriod: string;
            };
        };
        InvalidStudentAbsenceProblem: {

            type: "urn:pomi:problem:invalid-student-absence";

            title: "Falta inválida";

            status: 422;
            detail: string;
            instance?: string;
            fields: {
                code: string;
                path: string[];
                message: string;
            }[];
        };
        CreateStudentAbsenceBody: {
            courseAttemptId: number;
            classScheduleId: number;

            date: string;
        };
        StudentPublicProfile: {

            publicId: string;
            displayName: string;
            bio: string | null;
            interests: {
                id: number;
                name: string;
            }[];
            currentCourses: components["schemas"]["StudentCurrentCourse"][];
            program: {
                code: string | number;
                name: string;
            } | null;
            specialization: {
                code: string | number;
                name: string;
            } | null;
            entryYear: number | null;
            _paths: {
                self: string;
            };
            enabled: boolean;

            currentCoursesVisibility: "PRIVATE" | "FRIENDS" | "PUBLIC";
        };
        StudentCurrentCourse: {
            courseCode: string;
            courseName: string;
            classCode: string | null;
            schedules: {
                id: number;

                dayOfWeek: "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY";
                start: string;
                end: string;
                roomCode: string;
            }[];
        };
        StudentPublicPerson: {

            publicId: string;
            displayName: string;
            bio: string | null;
            interests: {
                id: number;
                name: string;
            }[];
            currentCourses: components["schemas"]["StudentCurrentCourse"][];
            program: {
                code: string | number;
                name: string;
            } | null;
            specialization: {
                code: string | number;
                name: string;
            } | null;
            entryYear: number | null;
            _paths: {
                self: string;
            };
        };
        StudentFriendship: {
            id: number;

            status: "PENDING" | "ACCEPTED";

            direction: "INCOMING" | "OUTGOING" | "NONE";
            friend: components["schemas"]["StudentPublicPerson"];

            createdAt: string;

            acceptedAt: string | null;
            _paths: {
                self: string;
                friend: string;
            };
        };
        FeedbackReportAccepted: {

            createdAt: string;
        };
        InvalidFeedbackReportProblem: {

            type: "urn:pomi:problem:invalid-feedback-report";

            title: "Feedback inválido";

            status: 422;
            detail: string;
            instance?: string;
            fields: {
                code: string;
                path: string[];
                message: string;
            }[];
        };
        FeedbackRateLimitProblem: {

            type: "urn:pomi:problem:feedback-rate-limit";

            title: "Muitos envios de feedback";

            status: 429;
            detail: string;
            instance?: string;
            retryAfterSeconds: number;
        };
        CreateFeedbackReportBody: {

            kind: "BUG" | "SUGGESTION" | "DATA_ISSUE";
            target: components["schemas"]["FeedbackReportTarget"];
            title: string;
            description: string;
            sourcePath?: string;
        };
        FeedbackReportTarget: {

            type: "GENERAL";
        } | {

            type: "FEATURE";

            featureKey: "home" | "curriculum-planner" | "semester-planner" | "course-situation" | "agenda" | "social" | "academic-data";
        } | {

            type: "ACADEMIC_RESOURCE";

            academicResourceType: "COURSE" | "CATALOG_COURSE" | "CATALOG_PROGRAM" | "CURRICULUM_SUGGESTION" | "CLASS" | "CLASS_SCHEDULE" | "STUDY_PERIOD" | "DAILY_MENU" | "CALENDAR_EVENT";
            academicResourceId: number;
        };
        FeedbackReport: {
            id: number;

            kind: "BUG" | "SUGGESTION" | "DATA_ISSUE";
            target: components["schemas"]["FeedbackReportTarget"];
            title: string;
            description: string;
            sourcePath: string | null;

            status: "OPEN" | "IN_PROGRESS" | "CLOSED";
            adminMessage: string | null;
            reporterStudentId: number | null;

            createdAt: string;

            updatedAt: string;
        };
        ExchangeNoticeSubscription: {
            studentId: number;
            enabled: boolean;
            placeIds: number[];
        };
        PatchExchangeNoticeSubscriptionBody: {
            enabled?: boolean;
            placeIds?: number[];
        };
        Category: {
            id: number;
            name: string;
        };
        Tag: {
            id: number;
            name: string;
            categoryId: number;
            parentTagId: number | null;
        };
        TagRelatedCourse: {
            id: number;
            code: string;
            name: string;
            credits: number;
        };
        StudentTagInterest: {
            id: number;
            name: string;
            categoryId: number;
            parentTagId: number | null;
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
    listMe: {
        parameters: {
            query?: never;
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
                    "application/json": components["schemas"]["CurrentUserEntity"];
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
    listBots: {
        parameters: {
            query?: never;
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
                    "application/json": components["schemas"]["BotIdentityEntity"][];
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
    listMeBotGrants: {
        parameters: {
            query?: never;
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
                    "application/json": components["schemas"]["BotGrantEntity"][];
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
    updateMeBotGrants: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                botAuthUserId: string;
            };
            cookie?: never;
        };

        requestBody: {
            content: {
                "application/json": components["schemas"]["ReplaceBotGrantBody"];
            };
        };
        responses: {

            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
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
    getStudents: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
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
                    "application/json": components["schemas"]["StudentEntity"];
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
    deleteStudents: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };

        requestBody: {
            content: {
                "application/json": {
                    confirmationRa: string;
                };
            };
        };
        responses: {

            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
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

            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["InvalidStudentProfileProblem"];
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
    updateStudents: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };

        requestBody: {
            content: {
                "application/json": components["schemas"]["PatchStudentBody"];
            };
        };
        responses: {

            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["StudentEntity"];
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

            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["ReferenceNotFoundProblem"] | components["schemas"]["InvalidStudentProfileProblem"];
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
    createStudents: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };

        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateStudentBody"];
            };
        };
        responses: {

            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["StudentEntity"];
                };
            };

            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["StudentEntity"];
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

            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["UniqueConstraintConflictProblem"];
                };
            };

            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["ReferenceNotFoundProblem"] | components["schemas"]["InvalidStudentProfileProblem"];
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
    getStudentCurricula: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                sid: string;
                id: string;
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
                    "application/json": components["schemas"]["CurriculumEntity"];
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
    deleteStudentCurricula: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                sid: string;
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {

            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
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
    updateStudentCurricula: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                sid: string;
                id: string;
            };
            cookie?: never;
        };

        requestBody: {
            content: {
                "application/json": {
                    name?: string;
                    isFavorite?: boolean;
                    selection?: {
                        catalogProgramId?: number | null;
                        specializationId?: number | null;
                        languageId?: number | null;
                    };
                    planningStart?: {
                        year: number;
                        semester: 1 | 2;
                        semesterNumber: number;
                    } | null;
                    currentPeriodId?: number | null;
                    periods?: {
                        add?: {
                            position: number;
                        }[];
                        update?: {
                            id: number;
                            position: number;
                        }[];
                        remove?: number[];
                    };
                    courses?: {
                        upsert?: {
                            courseId: number;
                            periodId: number | null;
                        }[];
                        remove?: number[];
                    };
                };
            };
        };
        responses: {

            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CurriculumEntity"];
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

            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["ReferenceNotFoundProblem"] | components["schemas"]["InvalidCurriculumProblem"];
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
    listStudentCurricula: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                sid: string;
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
                    "application/json": components["schemas"]["CurriculumSummaryEntity"][];
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
    createStudentCurricula: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                sid: string;
            };
            cookie?: never;
        };

        requestBody: {
            content: {
                "application/json": {
                    name?: string;
                    selection?: {
                        catalogProgramId?: number | null;
                        specializationId?: number | null;
                        languageId?: number | null;
                    };
                    planningStart?: {
                        year: number;
                        semester: 1 | 2;
                        semesterNumber: number;
                    } | null;
                    currentPeriodId?: number | null;
                    periods?: {
                        position: number;
                    }[];
                    courses?: {
                        courseId: number;
                        periodId: number | null;
                    }[];
                };
            };
        };
        responses: {

            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CurriculumEntity"];
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

            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["ReferenceNotFoundProblem"] | components["schemas"]["InvalidCurriculumProblem"];
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
    getStudentPeriodPlannings: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                sid: string;
                id: string;
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
                    "application/json": components["schemas"]["PeriodPlanningEntity"];
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
    deleteStudentPeriodPlannings: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                sid: string;
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {

            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
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
    updateStudentPeriodPlannings: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                sid: string;
                id: string;
            };
            cookie?: never;
        };

        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdatePeriodPlanningInput"];
            };
        };
        responses: {

            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PeriodPlanningEntity"];
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

            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["ReferenceNotFoundProblem"] | components["schemas"]["InvalidPeriodPlanProblem"];
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
    listStudentPeriodPlannings: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                sid: string;
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
                    "application/json": components["schemas"]["PeriodPlanningEntity"][];
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
    createStudentPeriodPlannings: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                sid: string;
            };
            cookie?: never;
        };

        requestBody: {
            content: {
                "application/json": components["schemas"]["CreatePeriodPlanningInput"];
            };
        };
        responses: {

            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PeriodPlanningEntity"];
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

            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["ReferenceNotFoundProblem"] | components["schemas"]["InvalidPeriodPlanProblem"];
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
    getStudentPeriodPlan: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                sid: string;
                id: string;
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
                    "application/json": components["schemas"]["PeriodPlanningEntity"];
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
    deleteStudentPeriodPlan: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                sid: string;
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {

            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
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
    updateStudentPeriodPlan: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                sid: string;
                id: string;
            };
            cookie?: never;
        };

        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdatePeriodPlanningInput"];
            };
        };
        responses: {

            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PeriodPlanningEntity"];
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

            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["ReferenceNotFoundProblem"] | components["schemas"]["InvalidPeriodPlanProblem"];
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
    listStudentPeriodPlan: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                sid: string;
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
                    "application/json": components["schemas"]["PeriodPlanningEntity"][];
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
    createStudentPeriodPlan: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                sid: string;
            };
            cookie?: never;
        };

        requestBody: {
            content: {
                "application/json": components["schemas"]["CreatePeriodPlanningInput"];
            };
        };
        responses: {

            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PeriodPlanningEntity"];
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

            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["ReferenceNotFoundProblem"] | components["schemas"]["InvalidPeriodPlanProblem"];
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
    listSharedPeriodPlannings: {
        parameters: {
            query?: {
                page?: string;
                pageSize?: string;
                query?: string;

                filter?: {
                    studyPeriodId?: number | {
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
                    "application/json": {
                        items: components["schemas"]["SharedPeriodPlanning"][];
                        page: number;
                        pageSize: number;
                        total: number;
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
    getSharedPeriodPlannings: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                shareId: string;
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
                    "application/json": components["schemas"]["SharedPeriodPlanning"];
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
    listStudentSharedPeriodPlannings: {
        parameters: {
            query?: {
                page?: string;
                pageSize?: string;

                filter?: {
                    ownerPublicId?: string | {

                        eq?: string;
                        in?: string[];
                    };
                };
            };
            header?: never;
            path: {
                sid: string;
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
                    "application/json": {
                        items: components["schemas"]["SharedPeriodPlanning"][];
                        page: number;
                        pageSize: number;
                        total: number;
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
    getStudentSharedPeriodPlannings: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                sid: string;
                shareId: string;
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
                    "application/json": components["schemas"]["SharedPeriodPlanning"];
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
    listStudentClassesProfessorsEvaluation: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                sid: string;
                classId: string;
                professorId: string;
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
                    "application/json": components["schemas"]["ProfessorEvaluationEligibility"];
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

            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["ReferenceNotFoundProblem"] | components["schemas"]["InvalidProfessorEvaluationProblem"];
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
    updateStudentClassesProfessorsEvaluation: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                sid: string;
                classId: string;
                professorId: string;
            };
            cookie?: never;
        };

        requestBody: {
            content: {
                "application/json": components["schemas"]["ProfessorEvaluationBody"];
            };
        };
        responses: {

            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProfessorEvaluation"];
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

            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["ReferenceNotFoundProblem"] | components["schemas"]["InvalidProfessorEvaluationProblem"];
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
    listStudentProfessorEvaluationsPending: {
        parameters: {
            query: {

                filter: {
                    year?: number | {
                        eq?: number;
                    };
                    yearPeriod?: ("FIRST_SEMESTER" | "SECOND_SEMESTER") | {

                        eq?: "FIRST_SEMESTER" | "SECOND_SEMESTER";
                    };
                };
            };
            header?: never;
            path: {
                sid: string;
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
                    "application/json": components["schemas"]["PendingProfessorEvaluation"][];
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
    getStudentCourseAttempts: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                sid: string;
                id: string;
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
                    "application/json": components["schemas"]["StudentCourseAttempt"];
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
    deleteStudentCourseAttempts: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                sid: string;
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {

            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
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
    updateStudentCourseAttempts: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                sid: string;
                id: string;
            };
            cookie?: never;
        };

        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateStudentCourseAttemptInput"];
            };
        };
        responses: {

            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["StudentCourseAttempt"];
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

            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["UniqueConstraintConflictProblem"];
                };
            };

            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["ReferenceNotFoundProblem"] | components["schemas"]["InvalidStudentCourseAttemptProblem"];
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
    listStudentCourseAttempts: {
        parameters: {
            query?: {

                filter?: {
                    status?: ("ENROLLED" | "DROPPED" | "APPROVED" | "FAILED_BY_GRADE" | "APPROVED_BY_ATTENDANCE" | "APPROVED_BY_PROFICIENCY" | "FAILED_BY_ATTENDANCE" | "SUFFICIENT" | "INSUFFICIENT") | {

                        eq?: "ENROLLED" | "DROPPED" | "APPROVED" | "FAILED_BY_GRADE" | "APPROVED_BY_ATTENDANCE" | "APPROVED_BY_PROFICIENCY" | "FAILED_BY_ATTENDANCE" | "SUFFICIENT" | "INSUFFICIENT";
                        in?: ("ENROLLED" | "DROPPED" | "APPROVED" | "FAILED_BY_GRADE" | "APPROVED_BY_ATTENDANCE" | "APPROVED_BY_PROFICIENCY" | "FAILED_BY_ATTENDANCE" | "SUFFICIENT" | "INSUFFICIENT")[];
                    };
                    courseId?: number | {
                        eq?: number;
                        in?: number[];
                    };
                    studyPeriodId?: number | {
                        eq?: number;
                        in?: number[];
                    };
                };
            };
            header?: never;
            path: {
                sid: string;
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
                    "application/json": components["schemas"]["StudentCourseAttempt"][];
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
    createStudentCourseAttempts: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                sid: string;
            };
            cookie?: never;
        };

        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateStudentCourseAttemptInput"];
            };
        };
        responses: {

            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["StudentCourseAttempt"];
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

            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["UniqueConstraintConflictProblem"];
                };
            };

            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["ReferenceNotFoundProblem"] | components["schemas"]["InvalidStudentCourseAttemptProblem"];
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
    createStudentCourseHistory: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                sid: string;
            };
            cookie?: never;
        };

        requestBody: {
            content: {
                "application/json": components["schemas"]["StudentHistoryImportBody"];
            };
        };
        responses: {

            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["StudentHistoryImportSummary"];
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

            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["InvalidStudentHistoryImportProblem"];
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
    listStudentAbsences: {
        parameters: {
            query?: {

                filter?: {
                    courseAttemptId?: number | {
                        eq?: number;
                        in?: number[];
                    };
                };
            };
            header?: never;
            path: {
                sid: string;
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
                    "application/json": components["schemas"]["StudentAbsence"][];
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
    createStudentAbsences: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                sid: string;
            };
            cookie?: never;
        };

        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateStudentAbsenceBody"];
            };
        };
        responses: {

            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["StudentAbsence"];
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

            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["UniqueConstraintConflictProblem"];
                };
            };

            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["ReferenceNotFoundProblem"] | components["schemas"]["InvalidStudentAbsenceProblem"];
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
    deleteStudentAbsences: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                sid: string;
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {

            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
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
    listStudentPublicProfile: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                sid: string;
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
                    "application/json": components["schemas"]["StudentPublicProfile"];
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
    updateStudentPublicProfile: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                sid: string;
            };
            cookie?: never;
        };

        requestBody: {
            content: {
                "application/json": {
                    enabled?: boolean;
                    displayName?: string | null;
                    bio?: string | null;

                    currentCoursesVisibility?: "PRIVATE" | "FRIENDS" | "PUBLIC";
                };
            };
        };
        responses: {

            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["StudentPublicProfile"];
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
    listStudentPeople: {
        parameters: {
            query?: {
                query?: string;
                page?: string;
                pageSize?: string;
            };
            header?: never;
            path: {
                sid: string;
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
                    "application/json": {
                        items: components["schemas"]["StudentPublicPerson"][];
                        page: number;
                        pageSize: number;
                        total: number;
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
    getStudentPeople: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                sid: string;
                publicId: string;
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
                    "application/json": components["schemas"]["StudentPublicPerson"];
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
    listStudentFriendships: {
        parameters: {
            query?: {

                filter?: {
                    status?: ("PENDING" | "ACCEPTED") | {

                        eq?: "PENDING" | "ACCEPTED";
                        in?: ("PENDING" | "ACCEPTED")[];
                    };
                    direction?: ("INCOMING" | "OUTGOING") | {

                        eq?: "INCOMING" | "OUTGOING";
                    };
                };
            };
            header?: never;
            path: {
                sid: string;
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
                    "application/json": components["schemas"]["StudentFriendship"][];
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
    createStudentFriendships: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                sid: string;
            };
            cookie?: never;
        };

        requestBody: {
            content: {
                "application/json": {

                    targetPublicId: string;
                };
            };
        };
        responses: {

            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["StudentFriendship"];
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

            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["UniqueConstraintConflictProblem"];
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
    createStudentFriendshipsAccept: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                sid: string;
                id: string;
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
                    "application/json": components["schemas"]["StudentFriendship"];
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

            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["UniqueConstraintConflictProblem"];
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
    deleteStudentFriendships: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                sid: string;
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {

            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
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
    createFeedbackReports: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };

        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateFeedbackReportBody"];
            };
        };
        responses: {

            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["FeedbackReportAccepted"];
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

            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["ReferenceNotFoundProblem"] | components["schemas"]["InvalidFeedbackReportProblem"];
                };
            };

            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["FeedbackRateLimitProblem"];
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
    listStudentFeedbackReports: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                sid: string;
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
                    "application/json": components["schemas"]["FeedbackReport"][];
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
    createStudentFeedbackReports: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                sid: string;
            };
            cookie?: never;
        };

        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateFeedbackReportBody"];
            };
        };
        responses: {

            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["FeedbackReportAccepted"];
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

            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["ReferenceNotFoundProblem"] | components["schemas"]["InvalidFeedbackReportProblem"];
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
    listStudentExchangeNoticeSubscription: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                sid: string;
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
                    "application/json": components["schemas"]["ExchangeNoticeSubscription"];
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
    updateStudentExchangeNoticeSubscription: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                sid: string;
            };
            cookie?: never;
        };

        requestBody: {
            content: {
                "application/json": components["schemas"]["PatchExchangeNoticeSubscriptionBody"];
            };
        };
        responses: {

            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ExchangeNoticeSubscription"];
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

            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["ReferenceNotFoundProblem"];
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
    createExchangeNoticeSubscriptionsUnsubscribe: {
        parameters: {
            query: {
                token: string;
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

                        enabled: false;
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
    listCategories: {
        parameters: {
            query?: never;
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
                    "application/json": components["schemas"]["Category"][];
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
    createCategories: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };

        requestBody: {
            content: {
                "application/json": {
                    name: string;
                };
            };
        };
        responses: {

            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Category"];
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

            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["UniqueConstraintConflictProblem"];
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
    getCategories: {
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
                    "application/json": components["schemas"]["Category"];
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
    updateCategories: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: number;
            };
            cookie?: never;
        };

        requestBody: {
            content: {
                "application/json": {
                    name: string;
                };
            };
        };
        responses: {

            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Category"];
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

            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["UniqueConstraintConflictProblem"];
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
    deleteCategories: {
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

            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
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

            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["UniqueConstraintConflictProblem"];
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
    listTags: {
        parameters: {
            query?: {

                filter?: {
                    categoryId?: number | {
                        eq?: number;
                        in?: number[];
                    };
                    parentTagId?: number | {
                        eq?: number;
                        in?: number[];
                    };
                    courseId?: number | {
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
                    "application/json": components["schemas"]["Tag"][];
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
    createTags: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };

        requestBody: {
            content: {
                "application/json": {
                    name: string;
                    categoryId: number;
                    parentTagId: number | null;
                };
            };
        };
        responses: {

            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Tag"];
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

            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["UniqueConstraintConflictProblem"];
                };
            };

            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["ReferenceNotFoundProblem"];
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
    getTags: {
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
                    "application/json": components["schemas"]["Tag"];
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
    updateTags: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: number;
            };
            cookie?: never;
        };

        requestBody: {
            content: {
                "application/json": {
                    name: string;
                    categoryId: number;
                    parentTagId: number | null;
                };
            };
        };
        responses: {

            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Tag"];
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

            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["UniqueConstraintConflictProblem"];
                };
            };

            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["ReferenceNotFoundProblem"];
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
    deleteTags: {
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

            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
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

            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["UniqueConstraintConflictProblem"];
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
    listCoursesTags: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                courseId: number;
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
                    "application/json": components["schemas"]["Tag"][];
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
    listTagsCourses: {
        parameters: {
            query?: {
                page?: number;
                pageSize?: number;
            };
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
                    "application/json": {
                        data: components["schemas"]["TagRelatedCourse"][];
                        quantity: number;
                        total: number;
                        _paths: {
                            firstPage: string;
                            lastPage: string;
                            next: string | null;
                            prev: string | null;
                        };
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
    updateCoursesTags: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                courseId: number;
                tagId: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {

            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };

            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["InvalidRequestProblem"];
                };
            };

            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["ReferenceNotFoundProblem"];
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
    deleteCoursesTags: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                courseId: number;
                tagId: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {

            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };

            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["InvalidRequestProblem"];
                };
            };

            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["ReferenceNotFoundProblem"];
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
    listStudentTagInterests: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                sid: string;
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
                    "application/json": components["schemas"]["StudentTagInterest"][];
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
    updateStudentTagInterests: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                sid: string;
                tagId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {

            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };

            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["InvalidRequestProblem"];
                };
            };

            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["ReferenceNotFoundProblem"];
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
    deleteStudentTagInterests: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                sid: string;
                tagId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {

            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
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
