import { useEffect, useState } from 'react'

import type { PlannerDispatch } from '@/features/curriculum-planner/types'
import { AutocompleteSelect } from '@/components/AutocompleteSelect'
import { Button } from '@/components/ui/button'
import { ActionTooltip } from '@/features/curriculum-planner/components/ActionTooltip'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'

const semesterOptions = [
  { value: '1', label: '1º semestre' },
  { value: '2', label: '2º semestre' },
]

export function PlanningStartDialog({
  year: savedYear,
  semester: savedSemester,
  semesterNumber: savedSemesterNumber,
  defaultYear,
  disabled,
  dispatch,
}: {
  year?: number
  semester?: 1 | 2
  semesterNumber?: number
  defaultYear?: number | null
  disabled: boolean
  dispatch: PlannerDispatch
}) {
  const [open, setOpen] = useState(false)
  const [year, setYear] = useState(
    savedYear ?? defaultYear ?? new Date().getFullYear(),
  )
  const [semester, setSemester] = useState(String(savedSemester ?? 1))
  const [semesterNumber, setSemesterNumber] = useState(savedSemesterNumber ?? 1)
  useEffect(() => {
    if (!savedYear && defaultYear) setYear(defaultYear)
  }, [defaultYear, savedYear])
  const submit = async () => {
    const succeeded = await dispatch({
      type: 'setPlanningStart',
      year,
      semester: Number(semester) as 1 | 2,
      semesterNumber,
    })
    if (succeeded) setOpen(false)
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <ActionTooltip content="Defina o primeiro semestre, período e ano do currículo.">
        <Button variant="outline" onClick={() => setOpen(true)}>
          {savedYear && savedSemester
            ? `Início: ${savedSemesterNumber ?? 1}º sem - ${savedSemester}s${savedYear}`
            : 'Definir início'}
        </Button>
      </ActionTooltip>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Início do planejamento</DialogTitle>
          <DialogDescription>
            Defina o semestre curricular, o período e o ano do primeiro semestre
            que você vai planejar.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
          <label className="col-span-2 space-y-2 text-sm font-bold lg:col-span-1">
            <span>Número do semestre</span>
            <Input
              type="number"
              min={1}
              value={semesterNumber}
              onChange={(event) =>
                setSemesterNumber(Number(event.target.value))
              }
            />
          </label>
          <label className="space-y-2 text-sm font-bold">
            <span>Ano</span>
            <Input
              type="number"
              min={1900}
              max={9999}
              value={year}
              onChange={(event) => setYear(Number(event.target.value))}
            />
          </label>
          <label className="space-y-2 text-sm font-bold">
            <span>Semestre</span>
            <AutocompleteSelect
              ariaLabel="Semestre inicial"
              value={semester}
              onValueChange={setSemester}
              options={semesterOptions}
              placeholder="Clique ou digite"
            />
          </label>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <ActionTooltip content="Feche sem alterar o início do currículo.">
              <Button variant="outline">Cancelar</Button>
            </ActionTooltip>
          </DialogClose>
          <ActionTooltip content="Salve o início usado para numerar os semestres.">
            <Button
              disabled={
                disabled ||
                !Number.isInteger(year) ||
                year < 1900 ||
                year > 9999 ||
                !Number.isInteger(semesterNumber) ||
                semesterNumber < 1 ||
                (semester !== '1' && semester !== '2')
              }
              onClick={() => void submit()}
            >
              Salvar
            </Button>
          </ActionTooltip>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
