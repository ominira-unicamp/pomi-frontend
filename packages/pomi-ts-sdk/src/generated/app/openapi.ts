export interface paths {
    "/me": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };

        get: operations["getCurrentUser"];
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

        get: operations["listBotGrants"];
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

        put: operations["replaceBotGrant"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/admin/auth-users": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };

        get: operations["listAuthUsers"];
        put?: never;

        post: operations["createAuthUser"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/admin/auth-users/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;

        patch: operations["updateAuthUser"];
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

        get: operations["listStudents"];
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

        get: operations["listPublicSharedPeriodPlannings"];
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

        get: operations["getPublicSharedPeriodPlanning"];
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

        get: operations["getStudentSharedPeriodPlanning"];
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

        get: operations["getProfessorEvaluation"];

        put: operations["updateProfessorEvaluation"];
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

        get: operations["listPendingProfessorEvaluations"];
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

        post: operations["createStudentHistory"];
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

        get: operations["getStudentPublicProfile"];
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

        get: operations["getStudentPerson"];
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

        post: operations["createStudentFriendship"];
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

        post: operations["acceptStudentFriendship"];
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

        delete: operations["deleteStudentFriendship"];
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

        post: operations["createFeedbackReport"];
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

        post: operations["createStudentFeedbackReport"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/admin/feedback-reports": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };

        get: operations["listFeedbackReports"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/admin/feedback-reports/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;

        patch: operations["updateFeedbackReport"];
        trace?: never;
    };
    "/student/{sid}/exchange-notice-subscription": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };

        get: operations["getExchangeNoticeSubscription"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;

        patch: operations["updateExchangeNoticeSubscription"];
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

        post: operations["unsubscribeExchangeNotices"];
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

        post: operations["createCategory"];
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

        get: operations["getCategory"];

        put: operations["updateCategory"];
        post?: never;

        delete: operations["deleteCategory"];
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

        post: operations["createTag"];
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

        get: operations["getTag"];

        put: operations["updateTag"];
        post?: never;

        delete: operations["deleteTag"];
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

        get: operations["listCourseTags"];
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

        get: operations["listTagCourses"];
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

        put: operations["addCourseTag"];
        post?: never;

        delete: operations["removeCourseTag"];
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

        put: operations["updateStudentTagInterest"];
        post?: never;

        delete: operations["deleteStudentTagInterest"];
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
        PaginationLinks: {

            self: string;

            first: string;

            last: string;

            next: string | null;

            previous: string | null;
        };
        BotGrantEntity: {
            id: number;
            studentId: number;
            botAuthUserId: number;
            capability: components["schemas"]["StudentCapability"];

            createdAt: string | null;

            revokedAt: string | null;
            botAuthUser: {
                id: number;
                displayName: string | null;
            };
        };

        StudentCapability: "STUDENT_PROFILE_READ" | "STUDENT_PROFILE_WRITE" | "STUDENT_HISTORY_READ" | "STUDENT_HISTORY_WRITE" | "STUDENT_PLANNING_READ" | "STUDENT_PLANNING_WRITE" | "STUDENT_SOCIAL_READ" | "STUDENT_SOCIAL_WRITE" | "STUDENT_FEEDBACK_READ" | "STUDENT_FEEDBACK_WRITE";
        ResourceNotFoundProblem: {

            type: "urn:pomi:problem:resource-not-found";

            title: "Recurso não encontrado";

            status: 404;
            detail: string;
            instance?: string;
        };
        ReplaceBotGrantBody: {
            capabilities: components["schemas"]["StudentCapability"][];
        };
        AuthUserEntity: {
            id: number;
            issuer: string;
            subject: string;
            email: string | null;
            displayName: string | null;
            status: components["schemas"]["AuthUserStatus"];
            roles: {
                authUserId: number;
                role: string;
            }[];
            capabilities: {
                authUserId: number;
                capability: string;
            }[];
        };

        AuthUserStatus: "ACTIVE" | "DISABLED";
        CreateBotAuthUserBody: {
            subject: string;
            displayName: string;

            capabilities: components["schemas"]["AuthCapability"][];
        };

        AuthCapability: "ACADEMIC_WRITE";
        AdminIdentityManagedByCliProblem: {

            type: "urn:pomi:problem:admin-identity-managed-by-cli";

            title: "Identidade administrada pela linha de comando";

            status: 403;
            detail: string;
            instance?: string;
        };
        PatchAuthUserBody: {
            status?: components["schemas"]["AuthUserStatus"];
            displayName?: string;
            capabilities?: components["schemas"]["AuthCapability"][];
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
                catalogProgramVariantId: number | null;
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
        };
        CurriculumSummaryEntity: {
            id: number;
            studentId: number;
            name: string;
            isFavorite: boolean;
            selection: {
                catalogProgramId: number | null;
                catalogProgramVariantId: number | null;
                languageId: number | null;
            };

            createdAt: string;

            updatedAt: string;
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
            studyPeriodYearPeriod: components["schemas"]["YearPeriod"];
            curriculumId: number | null;
            visibility: components["schemas"]["PlanningVisibility"];

            shareId: string;
            guide: components["schemas"]["PlanningGuide"];

            createdAt: string;

            updatedAt: string;
            classes: components["schemas"]["PeriodPlanningClass"][];
        };

        YearPeriod: "SUMMER" | "FIRST_SEMESTER" | "WINTER" | "SECOND_SEMESTER";

        PlanningVisibility: "PRIVATE" | "FRIENDS" | "PUBLIC";
        PlanningGuide: {
            mode: components["schemas"]["PlanningGuideMode"];
            curriculumSource: components["schemas"]["PlanningCurriculumSource"];
            curriculumId: number | null;
            suggestionId: number | null;
            suggestionCatalogProgramId?: number | null;
            catalogProgramId: number | null;
            catalogProgramVariantId: number | null;
            languageId: number | null;
            manualCourseIds: number[];
        };

        PlanningGuideMode: "CURRICULUM" | "PROGRAM" | "NONE";

        PlanningCurriculumSource: "SAVED" | "SUGGESTION" | null;
        PeriodPlanningClass: {
            id: number;
            code: string;
            reservationPrograms: {
                id: number;
                code: number;
                name: string;
            }[];
            courseId: number;
            courseCode: string;
            courseCredits: number;
            professors: components["schemas"]["PeriodPlanningProfessor"][];
            classSchedules: components["schemas"]["PeriodPlanningSchedule"][];
        };
        PeriodPlanningProfessor: {
            id: number;
            name: string;
        };
        PeriodPlanningSchedule: {
            id: number;
            dayOfWeek: components["schemas"]["DayOfWeek"];
            start: string;
            end: string;
            roomId: number;
            roomCode: string;
        };

        DayOfWeek: "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY";
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
            guide?: components["schemas"]["PlanningGuide"];
            classes: number[];
        };
        UpdatePeriodPlanningInput: {
            name?: string;
            visibility?: components["schemas"]["PlanningVisibility"];
            curriculumId?: number | null;
            guide?: components["schemas"]["PlanningGuide"];
            classes?: {
                set?: number[];
                add?: number[];
                remove?: number[];
            };
        };
        SharedPeriodPlanningPage: {
            data: components["schemas"]["SharedPeriodPlanning"][];
            quantity: number;
            total: number;
            links: components["schemas"]["PaginationLinks"];
        };
        SharedPeriodPlanning: {

            shareId: string;
            name: string;
            visibility: components["schemas"]["SharedPlanningVisibility"];
            studyPeriodId: number;
            studyPeriodYear: number;
            studyPeriodYearPeriod: components["schemas"]["YearPeriod"];
            owner: {

                publicId: string;
                displayName: string;
            } | null;
            classes: components["schemas"]["PeriodPlanningClass"][];

            createdAt: string;

            updatedAt: string;
        };

        SharedPlanningVisibility: "FRIENDS" | "PUBLIC";
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
            evaluationMode: components["schemas"]["CourseEvaluationMode"];
            status: components["schemas"]["StudentCourseAttemptStatus"];
            grade: number | null;

            createdAt: string;

            updatedAt: string;
            course: components["schemas"]["CourseAttemptCourse"];
            studyPeriod: components["schemas"]["CourseAttemptStudyPeriod"];
            class: components["schemas"]["CourseAttemptClass"];
        };

        CourseEvaluationMode: "GRADE_AND_ATTENDANCE" | "ATTENDANCE" | "CONCEPT";

        StudentCourseAttemptStatus: "ENROLLED" | "DROPPED" | "APPROVED" | "FAILED_BY_GRADE" | "APPROVED_BY_ATTENDANCE" | "APPROVED_BY_PROFICIENCY" | "FAILED_BY_ATTENDANCE" | "SUFFICIENT" | "INSUFFICIENT";
        CourseAttemptCourse: {
            id: number;
            code: string;
            name: string;
            credits: number;
            unit: {
                id: number;
                code: string;
            } | null;
        };
        CourseAttemptStudyPeriod: {
            id: number;
            year: number;
            yearPeriod: components["schemas"]["YearPeriod"];
        } | null;
        CourseAttemptClass: {
            id: number;
            code: string;
            professors: {
                id: number;
                name: string;
            }[];
        } | null;
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
            evaluationMode?: components["schemas"]["CourseEvaluationMode"];
            status: components["schemas"]["StudentCourseAttemptStatus"];
            grade?: number | null;
        };
        UpdateStudentCourseAttemptInput: {
            studyPeriodId?: number | null;
            classId?: number | null;
            evaluationMode?: components["schemas"]["CourseEvaluationMode"];
            status?: components["schemas"]["StudentCourseAttemptStatus"];
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
                yearPeriod: components["schemas"]["YearPeriod"];
                courses: {
                    code: string;
                    name: string;
                    classCode?: string | null;
                    grade: number | null;
                    workloadHours: number | null;
                    credits: number | null;
                    status: components["schemas"]["HistoryCourseStatus"];
                }[];
            }[];
        };

        HistoryCourseStatus: "ENROLLED" | "APPROVED" | "APPROVED_BY_ATTENDANCE" | "APPROVED_BY_PROFICIENCY" | "DROPPED" | "FAILED_BY_ATTENDANCE" | "SUFFICIENT";
        StudentAbsence: {
            id: number;
            studentCourseAttemptId: number;
            classScheduleId: number;

            date: string;

            createdAt: string;

            updatedAt: string;
            studyPeriodId: number;
            studyPeriodYear: number;
            studyPeriodYearPeriod: components["schemas"]["YearPeriod"];
            courseId: number;
            courseCode: string;
            classId: number;
            classCode: string;
            dayOfWeek: components["schemas"]["DayOfWeek"];
            start: string;
            end: string;
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
            enabled: boolean;
            currentCoursesVisibility: components["schemas"]["StudentProfileVisibility"];
        };
        StudentCurrentCourse: {
            courseCode: string;
            courseName: string;
            classCode: string | null;
            schedules: {
                id: number;
                dayOfWeek: components["schemas"]["DayOfWeek"];
                start: string;
                end: string;
                roomCode: string;
            }[];
        };

        StudentProfileVisibility: "PRIVATE" | "FRIENDS" | "PUBLIC";
        StudentPeoplePage: {
            data: components["schemas"]["StudentPublicPerson"][];
            quantity: number;
            total: number;
            links: components["schemas"]["PaginationLinks"];
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
        };
        StudentFriendship: {
            id: number;
            status: components["schemas"]["StudentFriendshipStatus"];
            direction: components["schemas"]["StudentFriendshipDirection"];
            friend: components["schemas"]["StudentPublicPerson"];

            createdAt: string;

            acceptedAt: string | null;
        };

        StudentFriendshipStatus: "PENDING" | "ACCEPTED";

        StudentFriendshipDirection: "INCOMING" | "OUTGOING" | "NONE";
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
            kind: components["schemas"]["FeedbackKind"];
            target: components["schemas"]["FeedbackReportTarget"];
            title: string;
            description: string;
            sourcePath?: string;
        };

        FeedbackKind: "BUG" | "SUGGESTION" | "DATA_ISSUE";
        FeedbackReportTarget: {

            type: "GENERAL";
        } | {

            type: "FEATURE";
            featureKey: components["schemas"]["FeedbackFeatureKey"];
        } | {

            type: "ACADEMIC_RESOURCE";
            academicResourceType: components["schemas"]["FeedbackAcademicResourceType"];
            academicResourceId: number;
        };

        FeedbackFeatureKey: "home" | "curriculum-planner" | "semester-planner" | "course-situation" | "agenda" | "social" | "academic-data";

        FeedbackAcademicResourceType: "COURSE" | "CATALOG_COURSE" | "CATALOG_PROGRAM" | "CURRICULUM_SUGGESTION" | "CLASS" | "CLASS_SCHEDULE" | "STUDY_PERIOD" | "DAILY_MENU" | "CALENDAR_EVENT";
        FeedbackReport: {
            id: number;
            kind: components["schemas"]["FeedbackKind"];
            target: components["schemas"]["FeedbackReportTarget"];
            title: string;
            description: string;
            sourcePath: string | null;
            status: components["schemas"]["FeedbackStatus"];
            adminMessage: string | null;
            reporterStudentId: number | null;

            createdAt: string;

            updatedAt: string;
        };

        FeedbackStatus: "OPEN" | "IN_PROGRESS" | "CLOSED";
        PatchFeedbackReportBody: {
            status?: components["schemas"]["FeedbackStatus"];
            adminMessage?: string | null;
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
    getCurrentUser: {
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
            query?: {

                page?: number;

                pageSize?: number | "all";

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
                        data: components["schemas"]["BotIdentityEntity"][];
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
    listBotGrants: {
        parameters: {
            query?: {

                page?: number;

                pageSize?: number | "all";

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
                        data: components["schemas"]["BotGrantEntity"][];
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
    replaceBotGrant: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                botAuthUserId: number;
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
    listAuthUsers: {
        parameters: {
            query?: {

                page?: number;

                pageSize?: number | "all";

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
                        data: components["schemas"]["AuthUserEntity"][];
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
    createAuthUser: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };

        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateBotAuthUserBody"];
            };
        };
        responses: {

            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AuthUserEntity"];
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
    updateAuthUser: {
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
                "application/json": components["schemas"]["PatchAuthUserBody"];
            };
        };
        responses: {

            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AuthUserEntity"];
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

            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["AdminIdentityManagedByCliProblem"];
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
                id: number;
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
                id: number;
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
    listStudents: {
        parameters: {
            query?: {

                page?: number;

                pageSize?: number | "all";

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
                        data: components["schemas"]["StudentEntity"][];
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
                sid: number;
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
                sid: number;
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
                sid: number;
                id: number;
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
                        catalogProgramVariantId?: number | null;
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
            query?: {

                page?: number;

                pageSize?: number | "all";

                sort?: string;
            };
            header?: never;
            path: {
                sid: number;
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
                        data: components["schemas"]["CurriculumSummaryEntity"][];
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
    createStudentCurricula: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                sid: number;
            };
            cookie?: never;
        };

        requestBody: {
            content: {
                "application/json": {
                    name?: string;
                    selection?: {
                        catalogProgramId?: number | null;
                        catalogProgramVariantId?: number | null;
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
                sid: number;
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
                sid: number;
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
                sid: number;
                id: number;
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
            query?: {

                page?: number;

                pageSize?: number | "all";

                sort?: string;
            };
            header?: never;
            path: {
                sid: number;
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
                        data: components["schemas"]["PeriodPlanningEntity"][];
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
    createStudentPeriodPlannings: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                sid: number;
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
                sid: number;
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
                sid: number;
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
                sid: number;
                id: number;
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
            query?: {

                page?: number;

                pageSize?: number | "all";

                sort?: string;
            };
            header?: never;
            path: {
                sid: number;
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
                        data: components["schemas"]["PeriodPlanningEntity"][];
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
    createStudentPeriodPlan: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                sid: number;
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
    listPublicSharedPeriodPlannings: {
        parameters: {
            query?: {

                page?: number;

                pageSize?: number;
                query?: string;

                filter?: {
                    studyPeriodId?: number | {
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
                    "application/json": components["schemas"]["SharedPeriodPlanningPage"];
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
    getPublicSharedPeriodPlanning: {
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

                page?: number;

                pageSize?: number;

                filter?: {
                    ownerPublicId?: string | {

                        eq?: string;
                        in?: string[];
                    };
                };

                sort?: string;
            };
            header?: never;
            path: {
                sid: number;
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
                    "application/json": components["schemas"]["SharedPeriodPlanningPage"];
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
    getStudentSharedPeriodPlanning: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                sid: number;
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
    getProfessorEvaluation: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                sid: number;
                classId: number;
                professorId: number;
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
    updateProfessorEvaluation: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                sid: number;
                classId: number;
                professorId: number;
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
    listPendingProfessorEvaluations: {
        parameters: {
            query: {

                page?: number;

                pageSize?: number | "all";

                filter: {
                    year?: number | {
                        eq?: number;
                    };
                    yearPeriod?: ("FIRST_SEMESTER" | "SECOND_SEMESTER") | {

                        eq?: "FIRST_SEMESTER" | "SECOND_SEMESTER";
                    };
                };

                sort?: string;
            };
            header?: never;
            path: {
                sid: number;
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
                        data: components["schemas"]["PendingProfessorEvaluation"][];
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
    getStudentCourseAttempts: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                sid: number;
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
                sid: number;
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
                sid: number;
                id: number;
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

                page?: number;

                pageSize?: number | "all";

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

                sort?: string;
            };
            header?: never;
            path: {
                sid: number;
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
                        data: components["schemas"]["StudentCourseAttempt"][];
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
    createStudentCourseAttempts: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                sid: number;
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
    createStudentHistory: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                sid: number;
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

                page?: number;

                pageSize?: number | "all";

                filter?: {
                    courseAttemptId?: number | {
                        eq?: number;
                        in?: number[];
                    };
                };

                sort?: string;
            };
            header?: never;
            path: {
                sid: number;
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
                        data: components["schemas"]["StudentAbsence"][];
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
    createStudentAbsences: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                sid: number;
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
                sid: number;
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
    getStudentPublicProfile: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                sid: number;
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
                sid: number;
            };
            cookie?: never;
        };

        requestBody: {
            content: {
                "application/json": {
                    enabled?: boolean;
                    displayName?: string | null;
                    bio?: string | null;
                    currentCoursesVisibility?: components["schemas"]["StudentProfileVisibility"];
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

                page?: number;

                pageSize?: number;
                query?: string;

                sort?: string;
            };
            header?: never;
            path: {
                sid: number;
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
                    "application/json": components["schemas"]["StudentPeoplePage"];
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
    getStudentPerson: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                sid: number;
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

                page?: number;

                pageSize?: number | "all";

                filter?: {
                    status?: ("PENDING" | "ACCEPTED") | {

                        eq?: "PENDING" | "ACCEPTED";
                        in?: ("PENDING" | "ACCEPTED")[];
                    };
                    direction?: ("INCOMING" | "OUTGOING") | {

                        eq?: "INCOMING" | "OUTGOING";
                    };
                };

                sort?: string;
            };
            header?: never;
            path: {
                sid: number;
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
                        data: components["schemas"]["StudentFriendship"][];
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
    createStudentFriendship: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                sid: number;
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
    acceptStudentFriendship: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                sid: number;
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
    deleteStudentFriendship: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                sid: number;
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
    createFeedbackReport: {
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
            query?: {

                page?: number;

                pageSize?: number | "all";

                sort?: string;
            };
            header?: never;
            path: {
                sid: number;
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
                        data: components["schemas"]["FeedbackReport"][];
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
    createStudentFeedbackReport: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                sid: number;
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
    listFeedbackReports: {
        parameters: {
            query?: {

                page?: number;

                pageSize?: number | "all";

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
                        data: components["schemas"]["FeedbackReport"][];
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
    updateFeedbackReport: {
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
                "application/json": components["schemas"]["PatchFeedbackReportBody"];
            };
        };
        responses: {

            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["FeedbackReport"];
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
    getExchangeNoticeSubscription: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                sid: number;
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
    updateExchangeNoticeSubscription: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                sid: number;
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
    unsubscribeExchangeNotices: {
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
            query?: {

                page?: number;

                pageSize?: number | "all";

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
                        data: components["schemas"]["Category"][];
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
    createCategory: {
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
    getCategory: {
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
    updateCategory: {
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
    deleteCategory: {
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

                page?: number;

                pageSize?: number | "all";

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
                        data: components["schemas"]["Tag"][];
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
    createTag: {
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
    getTag: {
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
    updateTag: {
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
    deleteTag: {
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
    listCourseTags: {
        parameters: {
            query?: {

                page?: number;

                pageSize?: number | "all";

                sort?: string;
            };
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
                    "application/json": {
                        data: components["schemas"]["Tag"][];
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
    listTagCourses: {
        parameters: {
            query?: {

                page?: number;

                pageSize?: number;

                sort?: string;
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
    addCourseTag: {
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
    removeCourseTag: {
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
            query?: {

                page?: number;

                pageSize?: number | "all";

                sort?: string;
            };
            header?: never;
            path: {
                sid: number;
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
                        data: components["schemas"]["StudentTagInterest"][];
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
    updateStudentTagInterest: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                sid: number;
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
    deleteStudentTagInterest: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                sid: number;
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
