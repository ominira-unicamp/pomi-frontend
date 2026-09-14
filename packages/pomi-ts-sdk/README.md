# POMI SDK

O pacote contém o cliente operacional gerado em `src/generated`, derivado dos contratos OpenAPI Data e App.

O gerador fica em `sdk-gen`, separando o carregamento e a validação do contrato da emissão dos artefatos. Ele usa, por padrão:

- `../../../openapi.json` para a API Data;
- `../../../pomi-backend/packages/app/app-openapi.json` para a API App.

```bash
npm run generate --workspace @ominira/pomi-sdk
npm run generate:check --workspace @ominira/pomi-sdk
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

const courses = await sdk.data.courses.list({
  filter: { credits: { gte: 4 } },
})

const filters = generated.data.filterCapabilities.listCourses
```

O frontend não precisa conhecer as rotas HTTP. Os metadados gerados também expõem filtros, problemas, schemas, enums e construtores de URL.

O gerador exige `operationId` e metadados explícitos `x-pomi-sdk` e `x-pomi-schema`. Operações depreciadas podem declarar `x-pomi-sdk: false` e permanecem apenas no tipo OpenAPI bruto. A geração é feita em staging e substitui os artefatos somente após sucesso. O modo `generate:check` confere se os arquivos versionados estão atualizados sem modificá-los e apresenta um relatório de cobertura do contrato.

Os schemas podem declarar campos de transporte, identidade, somente leitura, relações e aliases de domínio. A paginação usa o envelope uniforme `data`, `quantity`, `total` e `_paths`, com sua política declarada em `x-pomi-pagination`.
