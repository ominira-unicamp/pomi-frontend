import type { ResolvedTheme } from '@/components/ThemeProvider'
import type { SemesterPlanningExportData } from '@/features/semester-planner/model/semesterPlanningExport'
import { ResponsiveDialog } from '@/components/patterns/ResponsiveDialog'
import { Button, buttonVariants } from '@/components/ui/button'
import { SemesterPlanningExport } from '@/features/semester-planner/components/SemesterPlanningExport'
import { useSemesterPlanningExport } from '@/features/semester-planner/hooks/useSemesterPlanningExport'
import { studyPeriodCode } from '@/catalog/model/studyPeriod'

export function SemesterPlanningExportDialog({
  data,
  initialTheme,
  onClose,
}: {
  data: SemesterPlanningExportData
  initialTheme: ResolvedTheme
  onClose: () => void
}) {
  const { captureRef, url, error, isGenerating, retry, theme, setTheme } =
    useSemesterPlanningExport(initialTheme)
  return (
    <ResponsiveDialog
      open
      onOpenChange={(open) => {
        if (!open) onClose()
      }}
      title="Exportar planejamento como PNG"
      description="Confira a imagem e escolha o tema antes de baixar."
      dialogContentClassName="max-w-4xl"
      bodyClassName="space-y-4"
    >
      <label className="flex items-center gap-3 text-sm font-bold">
        Tema da imagem
        <select
          className="h-10 rounded-md border-2 border-border bg-background px-3"
          value={theme}
          onChange={(event) => setTheme(event.target.value as ResolvedTheme)}
        >
          <option value="light">Claro</option>
          <option value="dark">Escuro</option>
        </select>
      </label>
      <div
        aria-busy={isGenerating}
        className="max-h-[55dvh] overflow-y-auto rounded-md border border-border bg-muted p-2"
      >
        {isGenerating && (
          <p role="status" className="p-6 text-center">
            Gerando PNG…
          </p>
        )}
        {error && (
          <div role="alert" className="space-y-3 p-4">
            <p>{error}</p>
            <Button variant="outline" onClick={retry}>
              Tentar novamente
            </Button>
          </div>
        )}
        {url && (
          <img
            src={url}
            alt={`Prévia do planejamento ${data.name} no tema ${theme === 'dark' ? 'escuro' : 'claro'}`}
            className="h-auto w-full"
          />
        )}
      </div>
      <div className="flex flex-wrap justify-end gap-2">
        <Button variant="outline" onClick={onClose}>
          Fechar
        </Button>
        {url ? (
          <a
            className={buttonVariants()}
            href={url}
            download={`planejamento-${studyPeriodCode(data.period)}.png`}
          >
            Baixar PNG
          </a>
        ) : (
          <Button disabled>Baixar PNG</Button>
        )}
      </div>
      <SemesterPlanningExport
        data={data}
        theme={theme}
        captureRef={captureRef}
      />
    </ResponsiveDialog>
  )
}
