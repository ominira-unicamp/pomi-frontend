import { readdir, readFile } from 'node:fs/promises'

const sourceDirectory = new URL('../src/', import.meta.url)
const modules = (await readdir(sourceDirectory))
  .filter((file) => file.endsWith('.ts'))
  .filter((file) => !file.endsWith('.test.ts'))
  .filter(
    (file) =>
      ![
        'api.ts',
        'client.ts',
        'endpoint.ts',
        'errors.ts',
        'generatedClient.ts',
        'generatedPagination.ts',
        'legacyQuery.ts',
        'index.ts',
        'pagination.ts',
      ].includes(file),
  )
const forbidden = [
  'dataApiRequest',
  'appApiPublicRequest',
  'appApiRequest',
  'URLSearchParams',
  'JSON.stringify',
  'response.json',
  'expectApiResponse',
]

const violations = []
for (const module of modules) {
  const source = await readFile(new URL(module, sourceDirectory), 'utf8')
  for (const token of forbidden) {
    if (source.includes(token)) violations.push(`${module}: ${token}`)
  }
  if (!source.includes('client.app.') && !source.includes('client.data.')) {
    violations.push(`${module}: generated operation call`)
  }
  if (source.includes('.interface(') || source.includes('client.bind(')) {
    violations.push(`${module}: legacy interface/binding declaration`)
  }
  if (source.includes('client.request(')) {
    violations.push(`${module}: direct client request`)
  }
}

if (violations.length > 0) {
  throw new Error(`SDK architecture violations:\n${violations.join('\n')}`)
}
