import { CatalogPrerequisiteItemView } from './CatalogPrerequisiteItem'
import type { CatalogCourseDetails } from '@/features/curriculum-planner/data/courseDetailsApi'

export function CatalogCourseDetailsContent({
  details,
  showPrerequisites = true,
}: {
  details: CatalogCourseDetails
  showPrerequisites?: boolean
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
      {showPrerequisites && (
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
                    <span key={`${itemIndex}-${JSON.stringify(item)}`}>
                      {itemIndex > 0 && <span className="mx-2">e</span>}
                      <CatalogPrerequisiteItemView
                        item={item}
                        catalogYear={details.catalogYear}
                      />
                    </span>
                  ))}
                </div>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  )
}
