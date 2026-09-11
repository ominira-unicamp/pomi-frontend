# POMI SDK

O pacote contém duas camadas:

- as fachadas de domínio manuais, mantidas para compatibilidade;
- a camada operacional gerada em `src/generated`, derivada dos contratos OpenAPI Data e App.

O gerador fica em `sdk-gen/generate.ts` e usa, por padrão:

- `../../../openapi.json` para a API Data;
- `../../../pomi-backend/packages/app/app-openapi.json` para a API App.

```bash
npm run generate --workspace @ominira/pomi-sdk
npm run check --workspace @ominira/pomi-sdk
npm run test --workspace @ominira/pomi-sdk
```

A camada operacional é exposta por `createPomiSdk` e pelo namespace `generated`:

```ts
import { createPomiSdk, generated } from '@ominira/pomi-sdk'

const sdk = createPomiSdk({
  dataApiUrl: 'https://data.example.com',
  appApiUrl: 'https://app.example.com',
})

const courses = await sdk.data.listCourses({
  filter: { credits: { gte: 4 } },
})

const filters = generated.data.filterCapabilities.listCourses
```

O frontend não precisa conhecer as rotas HTTP. Os metadados gerados também expõem filtros, problemas, schemas, enums e construtores de URL.
