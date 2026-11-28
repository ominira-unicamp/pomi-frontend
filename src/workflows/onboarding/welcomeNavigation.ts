export function welcomeReturnTo(value: string | null, origin: string) {
  if (!value || !value.startsWith('/') || value.startsWith('//')) return '/'
  try {
    const target = new URL(value, origin)
    return target.origin === origin &&
      target.pathname.replace(/\/$/, '') !== '/boas-vindas'
      ? target.pathname + target.search + target.hash
      : '/'
  } catch {
    return '/'
  }
}
