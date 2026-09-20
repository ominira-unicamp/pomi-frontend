import assert from 'node:assert/strict'
import { mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { resolve } from 'node:path'
import test from 'node:test'
import { loadSpec } from './loadSpec.js'

const entity = {
  type: 'object',
  properties: { id: { type: 'integer' } },
  required: ['id'],
  'x-pomi-schema': {
    kind: 'entity',
    publicName: 'Example',
    identityFields: ['id'],
  },
}

async function withSpec(
  document: unknown,
  run: (path: string) => Promise<void>,
) {
  const directory = await mkdtemp(resolve(tmpdir(), 'pomi-sdk-gen-'))
  const path = resolve(directory, 'openapi.json')
  try {
    await writeFile(path, JSON.stringify(document))
    await run(path)
  } finally {
    await rm(directory, { recursive: true, force: true })
  }
}

test('keeps deprecated opt-out operations outside resources', async () => {
  await withSpec(
    {
      openapi: '3.1.0',
      paths: {
        '/examples': {
          get: {
            operationId: 'listExamples',
            deprecated: true,
            'x-pomi-sdk': false,
            responses: {
              200: {
                content: {
                  'application/json': {
                    schema: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Example' },
                    },
                  },
                },
              },
            },
          },
        },
      },
      components: { schemas: { Example: entity } },
    },
    async (path) => {
      const model = await loadSpec('app', path)
      assert.equal(model.operations.length, 1)
      assert.equal(model.resources.length, 0)
    },
  )
})

test('rejects incomplete path mappings', async () => {
  await withSpec(
    {
      openapi: '3.1.0',
      paths: {
        '/examples/{id}': {
          get: {
            operationId: 'getExample',
            parameters: [
              {
                name: 'id',
                in: 'path',
                required: true,
                schema: { type: 'integer' },
              },
            ],
            'x-pomi-sdk': {
              resource: 'examples',
              method: 'get',
              action: 'get',
            },
            responses: {
              200: {
                content: {
                  'application/json': {
                    schema: { $ref: '#/components/schemas/Example' },
                  },
                },
              },
            },
          },
        },
      },
      components: { schemas: { Example: entity } },
    },
    async (path) => {
      await assert.rejects(
        loadSpec('app', path),
        /must map every path parameter/,
      )
    },
  )
})

test('accepts typed sort metadata backed by a string wire parameter', async () => {
  await withSpec(
    {
      openapi: '3.1.0',
      paths: {
        '/examples': {
          get: {
            operationId: 'listExamples',
            parameters: [
              {
                name: 'sort',
                in: 'query',
                schema: { type: 'string' },
                'x-pomi-sort': {
                  version: 1,
                  fields: ['name', 'owner.name'],
                  default: 'name:asc',
                },
              },
            ],
            'x-pomi-sdk': {
              resource: 'examples',
              method: 'list',
              action: 'list',
            },
            responses: {
              200: {
                content: {
                  'application/json': {
                    schema: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Example' },
                    },
                  },
                },
              },
            },
          },
        },
      },
      components: { schemas: { Example: entity } },
    },
    async (path) => {
      const model = await loadSpec('app', path)
      const parameter = model.operations[0]?.operation.parameters?.[0]
      assert.deepEqual(parameter?.['x-pomi-sort'], {
        version: 1,
        fields: ['name', 'owner.name'],
        default: 'name:asc',
      })
    },
  )
})

test('rejects incomplete or inconsistent sort metadata', async () => {
  const document = (metadata: unknown) => ({
    openapi: '3.1.0',
    paths: {
      '/examples': {
        get: {
          operationId: 'listExamples',
          parameters: [
            {
              name: 'sort',
              in: 'query',
              schema: { type: 'string' },
              'x-pomi-sort': metadata,
            },
          ],
          'x-pomi-sdk': {
            resource: 'examples',
            method: 'list',
            action: 'list',
          },
          responses: {
            200: {
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/Example' },
                  },
                },
              },
            },
          },
        },
      },
    },
    components: { schemas: { Example: entity } },
  })

  await withSpec(document(undefined), async (path) => {
    await assert.rejects(
      loadSpec('app', path),
      /requires supported x-pomi-sort/,
    )
  })
  await withSpec(
    document({
      version: 1,
      fields: ['name'],
      default: 'unknown:asc',
    }),
    async (path) => {
      await assert.rejects(loadSpec('app', path), /Invalid default sort/)
    },
  )
})
