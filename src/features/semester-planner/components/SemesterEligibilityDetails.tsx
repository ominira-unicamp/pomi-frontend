import { AlertTriangle } from 'lucide-react'
import type { SemesterClass } from '@pomi/planner-domain/semester'
import type {
  PrerequisiteResult,
  ReservationResult,
} from '../model/semesterEligibility'

const resultLabels = {
  satisfied: 'Atendido',
  pending: 'Pendente no histórico',
  unknown: 'Não foi possível verificar',
  authorization: 'Depende de autorização',
}

export function SemesterPrerequisiteDetails({
  result,
}: {
  result?: PrerequisiteResult
}) {
  if (!result || result.status === 'satisfied') return null
  return (
    <div className="text-xs text-muted-foreground">
      {result.alternatives.length ? (
        <details>
          <summary className="cursor-pointer font-semibold">
            {result.label}
          </summary>
          <div className="mt-2 space-y-2">
            {result.alternatives.map((items, index) => (
              <div key={index}>
                <p className="font-bold">
                  Alternativa {index + 1}
                  {index > 0 ? ' (OU)' : ''}
                </p>
                <ul className="list-inside list-disc">
                  {items.map((item, itemIndex) => (
                    <li key={itemIndex}>
                      {item.label}: {resultLabels[item.status]}
                    </li>
                  ))}
                </ul>
                {items.length > 1 && (
                  <p>Todos os requisitos desta alternativa são necessários.</p>
                )}
              </div>
            ))}
          </div>
        </details>
      ) : (
        <p>{result.label}</p>
      )}
    </div>
  )
}

export function SemesterEligibilityDetails({
  prerequisite,
  reservation,
  programs,
}: {
  prerequisite?: PrerequisiteResult
  reservation?: ReservationResult
  programs?: SemesterClass['reservationPrograms']
}) {
  return (
    <div className="space-y-1">
      <SemesterPrerequisiteDetails result={prerequisite} />
      {reservation && (
        <div className="text-xs text-muted-foreground">
          {programs?.length ? (
            <details>
              <summary className="cursor-pointer">
                {reservation.status === 'mismatch' ? (
                  <span className="inline-flex items-center gap-1 font-semibold text-chart-4">
                    <AlertTriangle
                      className="size-3.5 shrink-0"
                      aria-hidden="true"
                    />
                    Viola reserva de curso
                  </span>
                ) : (
                  <span>{reservation.label}</span>
                )}
                <span> · Ver cursos reservados ({programs.length})</span>
              </summary>
              {reservation.status === 'mismatch' && (
                <p className="mt-2">
                  Seu curso não consta nas reservas informadas. A matrícula pode
                  exigir autorização da coordenação para violar a reserva.
                </p>
              )}
              <ul className="mt-2 max-h-40 space-y-1 overflow-y-auto">
                {programs.map((program) => (
                  <li key={program.id}>
                    {program.code} · {program.name}
                  </li>
                ))}
              </ul>
            </details>
          ) : (
            <p>{reservation.label}</p>
          )}
        </div>
      )}
    </div>
  )
}
