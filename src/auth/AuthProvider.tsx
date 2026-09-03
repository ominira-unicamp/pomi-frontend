import Keycloak from 'keycloak-js'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import type { KeycloakTokenParsed } from 'keycloak-js'
import type { ReactNode } from 'react'

const configuredKeycloakUrl = import.meta.env.VITE_KEYCLOAK_URL?.trim()
const configuredRealm = import.meta.env.VITE_KEYCLOAK_REALM?.trim()
const configuredClientId = import.meta.env.VITE_KEYCLOAK_CLIENT_ID?.trim()

if (
  import.meta.env.PROD &&
  (!configuredKeycloakUrl || !configuredRealm || !configuredClientId)
) {
  throw new Error(
    'VITE_KEYCLOAK_URL, VITE_KEYCLOAK_REALM e VITE_KEYCLOAK_CLIENT_ID são obrigatórias em produção.',
  )
}

const keycloak = new Keycloak({
  url: configuredKeycloakUrl || 'http://localhost:8080',
  realm: configuredRealm || 'pomi',
  clientId: configuredClientId || 'pomi-frontend',
})

let initialization: Promise<boolean> | undefined

function initializeKeycloak() {
  initialization ??= keycloak.init({
    onLoad: 'check-sso',
    pkceMethod: 'S256',
    checkLoginIframe: false,
  })
  return initialization
}

interface AuthContextValue {
  initialized: boolean
  isAuthenticated: boolean
  profile?: KeycloakTokenParsed
  sessionSubject?: string
  login: (redirectUri?: string) => Promise<void>
  logout: () => Promise<void>
  getAccessToken: () => Promise<string>
  emailVerificationRequired: boolean
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [initialized, setInitialized] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [profile, setProfile] = useState<KeycloakTokenParsed>()
  const [emailVerificationRequired, setEmailVerificationRequired] =
    useState(false)

  const synchronizeSession = useCallback(() => {
    setIsAuthenticated(Boolean(keycloak.authenticated))
    setProfile(keycloak.tokenParsed)
    setEmailVerificationRequired(
      Boolean(
        keycloak.authenticated &&
        keycloak.tokenParsed &&
        keycloak.tokenParsed.email_verified !== true &&
        false, // desativado verificacao de email temporariamente
      ),
    )
  }, [])

  useEffect(() => {
    let active = true

    keycloak.onAuthSuccess = synchronizeSession
    keycloak.onAuthRefreshSuccess = synchronizeSession
    keycloak.onAuthLogout = synchronizeSession
    keycloak.onAuthRefreshError = () => {
      void keycloak.logout({ redirectUri: window.location.origin })
    }
    keycloak.onTokenExpired = () => {
      void keycloak
        .updateToken(30)
        .catch(() => keycloak.logout({ redirectUri: window.location.origin }))
    }

    void initializeKeycloak()
      .then(() => {
        if (!active) return
        synchronizeSession()
        setInitialized(true)
      })
      .catch(() => {
        if (!active) return
        setInitialized(true)
        setIsAuthenticated(false)
        setProfile(undefined)
        setEmailVerificationRequired(false)
      })

    return () => {
      active = false
    }
  }, [synchronizeSession])

  const login = useCallback(async (redirectUri?: string) => {
    const target = redirectUri
      ? new URL(redirectUri, window.location.origin)
      : new URL(window.location.origin)
    if (target.origin !== window.location.origin) {
      throw new Error('A URL de retorno do login não é permitida.')
    }
    await keycloak.login({ redirectUri: target.href })
  }, [])

  const logout = useCallback(async () => {
    await keycloak.logout({ redirectUri: window.location.origin })
  }, [])

  const getAccessToken = useCallback(async () => {
    if (!keycloak.authenticated) {
      throw new Error('Authentication is required.')
    }

    await keycloak.updateToken(30)
    if (!keycloak.token) {
      throw new Error('Keycloak did not provide an access token.')
    }

    return keycloak.token
  }, [])

  const value = useMemo(
    () => ({
      initialized,
      isAuthenticated,
      profile,
      sessionSubject:
        isAuthenticated && typeof profile?.sub === 'string'
          ? profile.sub
          : undefined,
      login,
      logout,
      getAccessToken,
      emailVerificationRequired,
    }),
    [
      emailVerificationRequired,
      getAccessToken,
      initialized,
      isAuthenticated,
      login,
      logout,
      profile,
    ],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider.')
  }
  return context
}

export function useOptionalAuth(): AuthContextValue {
  const context = useContext(AuthContext)
  return (
    context ?? {
      initialized: true,
      isAuthenticated: false,
      sessionSubject: undefined,
      login: () => Promise.resolve(),
      logout: () => Promise.resolve(),
      getAccessToken: () =>
        Promise.reject(new Error('Authentication is required.')),
      emailVerificationRequired: false,
    }
  )
}
