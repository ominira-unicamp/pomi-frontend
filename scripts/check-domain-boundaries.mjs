import { readFile, readdir } from 'node:fs/promises'
import { extname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const packageRoot = fileURLToPath(
  new URL('../packages/planner-domain/src', import.meta.url),
)
const forbiddenImports = [
  /^@\//,
  /^react(?:\/|$)/,
  /^@tanstack\//,
  /^@radix-ui\//,
  /(?:^|\/)data(?:\/|$)/,
  /(?:^|\/)components?(?:\/|$)/,
]
const forbiddenGlobals = [
  /\bwindow\s*\./,
  /\bdocument\s*\.\s*(?:body|documentElement|createElement|querySelector)/,
  /\blocalStorage\b/,
  /\bsessionStorage\b/,
  /\bfetch\s*\(/,
  /\b(?:File|Blob|Storage|HTMLElement|PointerEvent|DragEvent)\b/,
  /\bURL\.createObjectURL\b/,
  /\bimport\.meta\.env\b/,
]

async function sourceFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true })
  const nested = await Promise.all(
    entries.map((entry) => {
      const path = join(directory, entry.name)
      if (entry.isDirectory()) return sourceFiles(path)
      return extname(path) === '.ts' ? [path] : []
    }),
  )
  return nested.flat()
}

const violations = []
for (const file of await sourceFiles(packageRoot)) {
  const source = await readFile(file, 'utf8')
  const imports = source.matchAll(/from\s+['"]([^'"]+)['"]/g)
  for (const match of imports) {
    if (forbiddenImports.some((pattern) => pattern.test(match[1]))) {
      violations.push(`${relative(packageRoot, file)}: import ${match[1]}`)
    }
  }
  for (const pattern of forbiddenGlobals) {
    if (pattern.test(source)) {
      violations.push(`${relative(packageRoot, file)}: ${pattern.source}`)
    }
  }
}

if (violations.length) {
  throw new Error(`Domain boundary violations:\n${violations.join('\n')}`)
}
