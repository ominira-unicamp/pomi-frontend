import type { RefObject } from 'react'
import type { ResolvedTheme } from '@/components/ThemeProvider'
import type { SemesterPlanningExportData } from '@/features/semester-planner/model/semesterPlanningExport'
import {
  buildSemesterPlanningExport,
  semesterExportHourHeight,
} from '@/features/semester-planner/model/semesterPlanningExport'
import { studyPeriodLabel } from '@/features/student/data/studyPeriod'
import './semesterPlanningExport.css'

export function SemesterPlanningExport({
  data,
  theme,
  captureRef,
}: {
  data: SemesterPlanningExportData
  theme: ResolvedTheme
  captureRef: RefObject<HTMLDivElement | null>
}) {
  const model = buildSemesterPlanningExport(data)
  const defaultName = data.name.trim() === 'Novo planejamento de semestre'
  return (
    <div className="semester-export-stage" aria-hidden="true">
      <div
        ref={captureRef}
        className={`semester-export ${theme === 'dark' ? 'dark' : 'semester-export-light'}`}
      >
        <header className="semester-export-header">
          <div className="semester-export-brand">
            <img src="/pomi-logo.svg" alt="POMI" />
            <div>
              <strong>POMI</strong>
              <p>Planejamento de semestre</p>
            </div>
          </div>
          <div className="semester-export-heading">
            <h1>{defaultName ? studyPeriodLabel(data.period) : data.name}</h1>
            <p>
              {!defaultName && `${studyPeriodLabel(data.period)} · `}
              {model.entries.length} disciplinas · {model.credits} créditos
            </p>
          </div>
        </header>
        {model.blocks.length ? (
          <div className="semester-export-grid">
            <div
              className="semester-export-days"
              style={{
                gridTemplateColumns: `64px repeat(${model.days.length}, 1fr)`,
              }}
            >
              <div />
              {model.days.map(([day, label]) => (
                <strong key={day}>{label}</strong>
              ))}
            </div>
            <div
              className="semester-export-hours"
              style={{ height: model.height }}
            >
              {Array.from(
                { length: model.endHour - model.startHour + 1 },
                (_, index) => (
                  <div
                    className="semester-export-hour"
                    key={index}
                    style={{ top: index * semesterExportHourHeight }}
                  >
                    <span>
                      {String(model.startHour + index).padStart(2, '0')}:00
                    </span>
                  </div>
                ),
              )}
              <div
                className="semester-export-columns"
                style={{
                  gridTemplateColumns: `repeat(${model.days.length}, 1fr)`,
                }}
              >
                {model.days.map(([day]) => (
                  <div key={day} />
                ))}
              </div>
              <div className="semester-export-blocks">
                {model.blocks.map((block) => (
                  <div
                    key={block.id}
                    className={`semester-export-block semester-export-color-${block.classItem.colorIndex} ${block.lanes > 1 ? 'semester-export-block-compact' : ''} ${block.hasConflict ? 'semester-export-conflict' : ''} ${block.height < semesterExportHourHeight ? 'semester-export-block-short' : ''}`}
                    style={{
                      top: block.top + 2,
                      height: Math.max(1, block.height - 4),
                      left: `calc(${((block.dayIndex + block.lane / block.lanes) * 100) / model.days.length}% + 3px)`,
                      width: `calc(${100 / model.days.length / block.lanes}% - 6px)`,
                    }}
                  >
                    <strong className="semester-export-block-heading">
                      {block.classItem.courseCode}
                      <span className="semester-export-block-detail">
                        Turma {block.classItem.code}
                      </span>
                    </strong>
                    {block.lanes > 1 ? (
                      <>
                        <span>{block.start}</span>
                        <span>–{block.end}</span>
                      </>
                    ) : (
                      <span>
                        {block.start}–{block.end}
                      </span>
                    )}
                    <span>{block.roomCode || 'Sala não informada'}</span>
                    {block.hasConflict && <span>Conflito</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <p className="semester-export-empty">
            Nenhum horário cadastrado para as turmas selecionadas.
          </p>
        )}
        {model.conflicts.length > 0 && (
          <section className="semester-export-conflicts">
            <h2>Conflitos de horário</h2>
            {model.conflicts.map(({ first, second }) => (
              <p key={`${first.id}-${second.id}`}>
                {model.days.find(([day]) => day === first.dayOfWeek)?.[1]} ·{' '}
                {
                  model.entries.find((item) => item.id === first.classId)
                    ?.courseCode
                }{' '}
                /{' '}
                {
                  model.entries.find((item) => item.id === second.classId)
                    ?.courseCode
                }{' '}
                · {first.start}–{first.end} / {second.start}–{second.end}
              </p>
            ))}
          </section>
        )}
        <section className="semester-export-legend">
          {model.entries.map((item) => (
            <div key={item.id}>
              <strong>
                <span
                  className={`semester-export-swatch semester-export-color-${item.colorIndex}`}
                />
                {item.courseCode}
                <small>Turma {item.code}</small>
              </strong>
              <span className="semester-export-course-details">
                {item.name}
                <small className="semester-export-detail">
                  {item.professors.length
                    ? `${item.professors.length === 1 ? 'Professor' : 'Professores'}: ${item.professors.map((professor) => professor.name).join(', ')}`
                    : 'Professor não informado'}
                </small>
                {model.blocks.some(
                  (block) =>
                    block.classId === item.id &&
                    (block.height < semesterExportHourHeight ||
                      block.lanes > 1),
                ) &&
                  item.meetings.map((meeting) => (
                    <small className="semester-export-meeting" key={meeting.id}>
                      {
                        model.days.find(
                          ([day]) => day === meeting.dayOfWeek,
                        )?.[1]
                      }{' '}
                      · {meeting.start}–{meeting.end} ·{' '}
                      {meeting.roomCode || 'Sala não informada'}
                    </small>
                  ))}
              </span>
              <span className="semester-export-credits">
                {item.credits === undefined
                  ? 'Créditos não informados'
                  : `${item.credits} créditos`}
              </span>
            </div>
          ))}
        </section>
        <footer>Planejado no POMI</footer>
      </div>
    </div>
  )
}
