import { Link } from '@tanstack/react-router'

import type { CatalogCourseDetails } from '@/features/curriculum-planner/data/courseDetailsApi'

export function CatalogCourseDetailsContent({
  details,
}: {
  details: CatalogCourseDetails
}) {
  const prerequisiteGroups = details.prerequisites.any

  return (
    <div className="space-y-5">
      <section className="space-y-2">
        <h2 className="text-base font-extrabold">Ementa</h2>
        <p className="whitespace-pre-line text-sm text-muted-foreground">
          {details.syllabus ?? 'Ementa não informada neste catálogo.'}
        </p>
      </section>
      <section className="space-y-3 pt-4">
        <h2 className="text-base font-extrabold">Pré-requisitos</h2>
        {prerequisiteGroups.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Nenhum pré-requisito informado neste catálogo.
          </p>
        ) : (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Qualquer uma das alternativas abaixo deve ser atendida.
            </p>
            {prerequisiteGroups.map((group, index) => (
              <div
                key={`prerequisite-${index}`}
                className="border-t border-border pt-3 text-sm"
              >
                <span className="mr-2 text-xs font-black text-muted-foreground">
                  ALTERNATIVA {index + 1}
                </span>
                {group.all.map((item, itemIndex) => (
                  <span key={`${item.code}-${itemIndex}`}>
                    {itemIndex > 0 && <span className="mx-2">e</span>}
                    {item.courseId !== null ? (
                      <Link
                        className="font-mono font-black text-primary underline-offset-4 hover:underline"
                        to="/disciplinas/$courseId"
                        params={{ courseId: String(item.courseId) }}
                        search={{ catalogYear: details.catalogYear }}
                      >
                        {item.kind === 'PARTIAL' ? '*' : ''}
                        {item.code}
                      </Link>
                    ) : (
                      <span className="font-mono font-black">
                        {item.kind === 'PARTIAL' ? '*' : ''}
                        {item.code}
                      </span>
                    )}
                  </span>
                ))}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
