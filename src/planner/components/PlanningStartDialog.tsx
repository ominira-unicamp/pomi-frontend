import { useState } from 'react'

import { AutocompleteSelect } from './AutocompleteSelect'
import type { PlannerDispatch } from '@/planner/types'
import { Button } from '@/components/ui/button'
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
  disabled,
  dispatch,
}: {
  year?: number
  semester?: 1 | 2
  semesterNumber?: number
  disabled: boolean
  dispatch: PlannerDispatch
}) {
  const [open, setOpen] = useState(false)
  const [year, setYear] = useState(savedYear ?? new Date().getFullYear())
  const [semester, setSemester] = useState(String(savedSemester ?? 1))
  const [semesterNumber, setSemesterNumber] = useState(savedSemesterNumber ?? 1)
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
      <Button variant="outline" onClick={() => setOpen(true)}>
        {savedYear && savedSemester
          ? `Início: ${savedSemesterNumber ?? 1}º sem - ${savedSemester}s${savedYear}`
          : 'Definir início'}
      </Button>
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
            <Button variant="outline">Cancelar</Button>
          </DialogClose>
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
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
