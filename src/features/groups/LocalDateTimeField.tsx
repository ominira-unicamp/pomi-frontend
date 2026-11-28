import { Input } from '@/components/ui/input'

export function LocalDateTimeField({
  label,
  date,
  time,
  onDateChange,
  onTimeChange,
}: {
  label: string
  date: string
  time: string
  onDateChange: (value: string) => void
  onTimeChange: (value: string) => void
}) {
  return (
    <fieldset className="min-w-0 space-y-2">
      <legend className="text-sm font-bold">{label}</legend>
      <div className="grid min-w-0 grid-cols-2 gap-2">
        <label className="min-w-0 text-xs font-semibold text-muted-foreground">
          Data (dd/mm/aaaa)
          <Input
            aria-label={`${label}: data (dd/mm/aaaa)`}
            inputMode="numeric"
            placeholder="dd/mm/aaaa"
            maxLength={10}
            value={date}
            onChange={(event) => onDateChange(event.target.value)}
          />
        </label>
        <label className="min-w-0 text-xs font-semibold text-muted-foreground">
          Hora (hh:mm)
          <Input
            aria-label={`${label}: hora (hh:mm)`}
            inputMode="numeric"
            placeholder="hh:mm"
            maxLength={5}
            value={time}
            onChange={(event) => onTimeChange(event.target.value)}
          />
        </label>
      </div>
    </fieldset>
  )
}
