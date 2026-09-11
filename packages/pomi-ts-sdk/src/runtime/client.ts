export type PomiRequestContext = Readonly<{
  getAccessToken?: () => Promise<string>
  allowUndocumentedSuccess?: boolean
}>
