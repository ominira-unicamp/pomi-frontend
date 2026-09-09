import { createPomiApi } from '@pomi/pomi-ts-sdk'

const configuredDataApiUrl = import.meta.env.VITE_DATA_API_URL?.trim()
const configuredAppApiUrl = import.meta.env.VITE_APP_API_URL?.trim()

if (import.meta.env.PROD && (!configuredDataApiUrl || !configuredAppApiUrl)) {
  throw new Error(
    'VITE_DATA_API_URL e VITE_APP_API_URL são obrigatórias em produção.',
  )
}

const dataApiUrl = configuredDataApiUrl || 'http://localhost:3000'
const appApiUrl = configuredAppApiUrl || 'http://localhost:3001'

export const pomiApi = createPomiApi({ dataApiUrl, appApiUrl })
