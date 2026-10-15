export function displayLocalDateTime(value: string | null) {
  if (!value) return { date: '', time: '' }
  const instant = new Date(value)
  if (Number.isNaN(instant.getTime())) return { date: '', time: '' }
  return {
    date: `${String(instant.getDate()).padStart(2, '0')}/${String(instant.getMonth() + 1).padStart(2, '0')}/${instant.getFullYear()}`,
    time: `${String(instant.getHours()).padStart(2, '0')}:${String(instant.getMinutes()).padStart(2, '0')}`,
  }
}

export function parseLocalDateTime(date: string, time: string) {
  if (!date.trim() && !time.trim()) return { value: null, error: null }
  const matchDate = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(date.trim())
  const matchTime = /^(\d{2}):(\d{2})$/.exec(time.trim())
  if (!matchDate || !matchTime)
    return { value: null, error: 'Informe data (dd/mm/aaaa) e hora (hh:mm).' }
  const day = Number(matchDate[1])
  const month = Number(matchDate[2])
  const year = Number(matchDate[3])
  const hour = Number(matchTime[1])
  const minute = Number(matchTime[2])
  const local = new Date(year, month - 1, day, hour, minute)
  if (
    year < 100 ||
    local.getFullYear() !== year ||
    local.getMonth() !== month - 1 ||
    local.getDate() !== day ||
    local.getHours() !== hour ||
    local.getMinutes() !== minute
  )
    return { value: null, error: 'Data ou hora inválida.' }
  return { value: local.toISOString(), error: null }
}

export function preserveUnchangedInstant(
  date: string,
  time: string,
  original: string | null,
) {
  const originalDisplay = displayLocalDateTime(original)
  if (
    original &&
    date === originalDisplay.date &&
    time === originalDisplay.time
  )
    return { value: original, error: null }
  return parseLocalDateTime(date, time)
}
