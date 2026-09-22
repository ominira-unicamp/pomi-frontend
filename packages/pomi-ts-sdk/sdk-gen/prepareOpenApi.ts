import { spawn } from 'node:child_process'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const scriptDirectory = dirname(fileURLToPath(import.meta.url))
const workspaceDirectory = resolve(scriptDirectory, '../../..')
const backendDirectory = resolve(
  process.env.POMI_BACKEND_PATH ??
    resolve(workspaceDirectory, '../pomi-backend'),
)
const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm'

await new Promise<void>((resolvePromise, reject) => {
  const child = spawn(npmCommand, ['run', 'openapi:export'], {
    cwd: backendDirectory,
    stdio: 'inherit',
  })

  child.once('error', reject)
  child.once('exit', (code, signal) => {
    if (code === 0) {
      resolvePromise()
      return
    }
    reject(
      new Error(
        `OpenAPI export failed${signal ? ` with signal ${signal}` : ` with exit code ${code}`}`,
      ),
    )
  })
})
