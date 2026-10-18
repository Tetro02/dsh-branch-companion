/**
 * Build script: emits the Host entry, the wrapped browser bundle, the pure
 * modules used by the tests, and the declaration files.
 *
 * The browser bundle must arrive as `window.__ModuleLoader__.load({ id, factory })`
 * — that factory is what the client module system registers and materializes
 * lazily. esbuild produces the module body as an IIFE, which is then embedded
 * inside the factory so nothing runs before the system materializes the bundle.
 */

import { spawnSync } from 'node:child_process'
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { build } from 'esbuild'

const root = dirname(dirname(fileURLToPath(import.meta.url)))
const lib = join(root, 'lib')
const pkg = JSON.parse(await readFile(join(root, 'package.json'), 'utf8'))

/** Bundle one module to ESM, used for the modules the tests import directly. */
async function buildModule(name) {
  await build({
    entryPoints: [join(root, 'src', 'client', `${name}.ts`)],
    outfile: join(lib, 'internal', `${name}.js`),
    bundle: true,
    format: 'esm',
    platform: 'neutral',
    target: 'es2022',
    logLevel: 'warning'
  })
}

await rm(lib, { recursive: true, force: true })
await mkdir(lib, { recursive: true })

// Host half: a plain ESM plugin module the Loader imports.
await build({
  entryPoints: [join(root, 'src', 'index.ts')],
  outfile: join(lib, 'index.js'),
  bundle: true,
  format: 'esm',
  platform: 'node',
  target: 'node20',
  logLevel: 'warning'
})

// Browser half: the module IIFE, wrapped below.
const bodyFile = join(lib, '.client.iife.js')
await build({
  entryPoints: [join(root, 'src', 'client', 'index.ts')],
  outfile: bodyFile,
  bundle: true,
  format: 'iife',
  globalName: '__dshBranchCompanion',
  platform: 'browser',
  target: 'es2020',
  legalComments: 'none',
  logLevel: 'warning'
})

const body = await readFile(bodyFile, 'utf8')
const indented = body
  .replace(/\n+$/u, '\n')
  .split('\n')
  .map((line) => (line === '' ? line : `\t\t${line}`))
  .join('\n')

const wrapped = `window.__ModuleLoader__.load({
\tid: ${JSON.stringify(pkg.name)},
\tfactory: (require) => {
\t\tvar module = { exports: {} };
\t\tvar exports = module.exports;
${indented}
\t\texports.apply = __dshBranchCompanion.apply;
\t\texports.inject = __dshBranchCompanion.inject;
\t\treturn module.exports;
\t}
});
`

await writeFile(join(lib, 'client.js'), wrapped)
await rm(bodyFile)

await buildModule('quote')
await buildModule('tree')

// Declarations, so consumers and the Loader diagnostics can read the surface.
const tsc = spawnSync(
  process.execPath,
  [join(root, 'node_modules', 'typescript', 'bin', 'tsc'), '-p', join(root, 'tsconfig.json')],
  { cwd: root, stdio: 'inherit' }
)
if (tsc.status !== 0) process.exit(tsc.status ?? 1)

const sizes = [
  ['lib/index.js', join(lib, 'index.js')],
  ['lib/client.js', join(lib, 'client.js')],
  ['lib/internal/quote.js', join(lib, 'internal', 'quote.js')],
  ['lib/internal/tree.js', join(lib, 'internal', 'tree.js')]
]
for (const [label, file] of sizes) {
  const { size } = await import('node:fs/promises').then(({ stat }) => stat(file))
  console.log(`${label.padEnd(24)} ${size.toLocaleString('en-US')} bytes`)
}
