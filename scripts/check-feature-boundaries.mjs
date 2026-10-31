import { readdir, readFile } from 'node:fs/promises'
import { join } from 'node:path'

const sourceRoot = new URL('../src/', import.meta.url)
const legacyRoots = [
  'about',
  'exchange',
  'feedback',
  'friends',
  'home',
  'planner',
  'semester-planner',
  'student',
]
const routeRoot = new URL('../src/routes/', import.meta.url)

async function filesIn(directory) {
  const entries = await readdir(directory, { withFileTypes: true })
  const nested = await Promise.all(
    entries.map((entry) => {
      const path = join(directory.pathname, entry.name)
      return entry.isDirectory() ? filesIn(new URL(`file://${path}/`)) : [path]
    }),
  )
  return nested.flat()
}

const sourceFiles = (await filesIn(sourceRoot)).filter((path) =>
  /\.(ts|tsx)$/.test(path),
)
const legacyPattern = new RegExp(
  `@/(${legacyRoots.join('|')})/`,
)
const legacyImports = []
for (const path of sourceFiles) {
  const source = await readFile(path, 'utf8')
  if (legacyPattern.test(source)) legacyImports.push(path)
}

const routeFiles = sourceFiles.filter((path) => path.startsWith(routeRoot.pathname))
const routeInternalImports = []
for (const path of routeFiles) {
  const source = await readFile(path, 'utf8')
  if (/from ['"]@\/features\/[^'"/]+\//.test(source)) {
    routeInternalImports.push(path)
  }
}

if (legacyImports.length || routeInternalImports.length) {
  if (legacyImports.length)
    console.error(`Legacy feature imports found:\n${legacyImports.join('\n')}`)
  if (routeInternalImports.length)
    console.error(`Route imports into feature internals found:\n${routeInternalImports.join('\n')}`)
  process.exitCode = 1
}
