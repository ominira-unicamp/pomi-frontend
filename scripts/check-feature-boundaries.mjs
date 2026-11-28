import { readdir, readFile } from 'node:fs/promises'
import { relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import ts from 'typescript'

const root = fileURLToPath(new URL('../', import.meta.url))
const sourceRoot = resolve(root, 'src')
const config = ts.readConfigFile(
  resolve(root, 'tsconfig.json'),
  ts.sys.readFile,
)
const options = ts.parseJsonConfigFileContent(
  config.config,
  ts.sys,
  root,
).options
const contracts = JSON.parse(
  await readFile(new URL('./feature-public-api.json', import.meta.url), 'utf8'),
)
const exemptions = JSON.parse(
  await readFile(
    new URL('./feature-boundary-exceptions.json', import.meta.url),
    'utf8',
  ),
)
async function filesIn(directory) {
  const entries = await readdir(directory, { withFileTypes: true })
  return (
    await Promise.all(
      entries.map((entry) =>
        entry.isDirectory()
          ? filesIn(resolve(directory, entry.name))
          : resolve(directory, entry.name),
      ),
    )
  ).flat()
}
const owner = (file) => {
  const path = relative(sourceRoot, file).replaceAll('\\', '/')
  const parts = path.split('/')
  return parts[0] === 'features' || parts[0] === 'workflows'
    ? parts.slice(0, 2).join('/')
    : parts[0]
}
const sources = (await filesIn(sourceRoot)).filter(
  (path) =>
    /\.(ts|tsx)$/.test(path) &&
    !/\.test\./.test(path) &&
    !path.endsWith('routeTree.gen.ts'),
)
const graph = new Map()
const violations = []
const dependencies = []
for (const file of sources) {
  const source = ts.createSourceFile(
    file,
    await readFile(file, 'utf8'),
    ts.ScriptTarget.Latest,
    true,
  )
  const edges = []
  function dependency(specifier, typeOnly) {
    if (
      /^@\/(about|exchange|feedback|friends|home|planner|semester-planner|student)\//.test(
        specifier,
      )
    )
      violations.push(`${relative(root, file)}: legacy ${specifier}`)
    const target = ts.resolveModuleName(specifier, file, options, ts.sys)
      .resolvedModule?.resolvedFileName
    if (!target || !target.startsWith(sourceRoot)) return
    const from = owner(file)
    const to = owner(target)
    dependencies.push({ from, to, typeOnly })
    if (!typeOnly) edges.push(target)
    const exported = relative(resolve(sourceRoot, to), target)
      .replaceAll('\\', '/')
      .replace(/\.(ts|tsx)$/, '')
    if (from !== to && to.startsWith('features/')) {
      const allowed = exported === 'index' || contracts[to]?.includes(exported)
      if (!allowed)
        violations.push(`${relative(root, file)}: private ${to}/${exported}`)
      if (from === 'routes' && exported !== 'index')
        violations.push(
          `${relative(root, file)}: route imports feature internals`,
        )
    }
    if (
      from !== to &&
      to.startsWith('workflows/') &&
      !['routes', 'app'].includes(from)
    )
      violations.push(
        `${relative(root, file)}: consumer imports workflow ${to}`,
      )
    if (
      [
        'catalog',
        'academic-record',
        'media',
        'planning-drafts',
        'social-profile',
      ].includes(from) &&
      to.startsWith('features/') &&
      !typeOnly
    )
      violations.push(
        `${relative(root, file)}: shared capability imports ${to}`,
      )
  }
  function visit(node) {
    if (
      (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) &&
      node.moduleSpecifier &&
      ts.isStringLiteral(node.moduleSpecifier)
    ) {
      const clause = ts.isImportDeclaration(node)
        ? node.importClause
        : undefined
      const bindings = clause?.namedBindings
      const allTypes =
        bindings &&
        ts.isNamedImports(bindings) &&
        bindings.elements.length > 0 &&
        bindings.elements.every((entry) => entry.isTypeOnly)
      dependency(
        node.moduleSpecifier.text,
        Boolean(
          node.isTypeOnly || clause?.isTypeOnly || (!clause?.name && allTypes),
        ),
      )
    }
    if (
      ts.isCallExpression(node) &&
      node.expression.kind === ts.SyntaxKind.ImportKeyword &&
      ts.isStringLiteral(node.arguments[0])
    )
      dependency(node.arguments[0].text, false)
    ts.forEachChild(node, visit)
  }
  visit(source)
  graph.set(file, edges)
}
let nextIndex = 0
const indexes = new Map()
const low = new Map()
const stack = []
const stacked = new Set()
const cycles = []
function connect(file) {
  indexes.set(file, nextIndex)
  low.set(file, nextIndex)
  nextIndex += 1
  stack.push(file)
  stacked.add(file)
  for (const target of graph.get(file) ?? []) {
    if (!graph.has(target)) continue
    if (!indexes.has(target)) {
      connect(target)
      low.set(file, Math.min(low.get(file), low.get(target)))
    } else if (stacked.has(target))
      low.set(file, Math.min(low.get(file), indexes.get(target)))
  }
  if (low.get(file) !== indexes.get(file)) return
  const group = []
  let target
  do {
    target = stack.pop()
    stacked.delete(target)
    group.push(target)
  } while (target !== file)
  if (new Set(group.map(owner)).size > 1)
    cycles.push(
      group
        .map((path) => relative(root, path))
        .sort()
        .join(' -> '),
    )
}
for (const file of graph.keys()) if (!indexes.has(file)) connect(file)
for (const cycle of cycles) violations.push(`Runtime cycle: ${cycle}`)
const unexpected = violations.filter(
  (violation) => !exemptions.includes(violation),
)
const stale = exemptions.filter((exemption) => !violations.includes(exemption))
if (unexpected.length || stale.length) {
  console.error(
    [
      ...unexpected,
      ...stale.map((entry) => `Remove resolved exception: ${entry}`),
    ].join('\n'),
  )
  process.exitCode = 1
}
console.log(
  `Architecture: ${sources.length} files, ${dependencies.filter((entry) => entry.from !== entry.to && !entry.typeOnly).length} runtime imports, ${dependencies.filter((entry) => entry.from !== entry.to && entry.typeOnly).length} type imports, ${exemptions.length} exceptions.`,
)
