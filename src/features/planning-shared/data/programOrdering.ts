type ProgramCode = Readonly<{
  code: string | number
  name?: string
}>

export function compareProgramCodes(
  left: ProgramCode,
  right: ProgramCode,
): number {
  const leftCode = String(left.code)
  const rightCode = String(right.code)
  const leftNumber = Number(leftCode)
  const rightNumber = Number(rightCode)

  if (Number.isFinite(leftNumber) && Number.isFinite(rightNumber)) {
    return (
      leftNumber - rightNumber ||
      leftCode.localeCompare(rightCode, 'pt-BR') ||
      (left.name ?? '').localeCompare(right.name ?? '', 'pt-BR')
    )
  }

  return (
    leftCode.localeCompare(rightCode, 'pt-BR', { numeric: true }) ||
    (left.name ?? '').localeCompare(right.name ?? '', 'pt-BR')
  )
}
