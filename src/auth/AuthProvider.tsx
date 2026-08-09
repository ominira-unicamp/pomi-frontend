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
  login: () => Promise<void>
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
          keycloak.tokenParsed.email_verified !== true,
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

  const login = useCallback(async () => {
    await keycloak.login({ redirectUri: window.location.origin })
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
  return context ?? {
    initialized: true,
    isAuthenticated: false,
    login: () => Promise.resolve(),
    logout: () => Promise.resolve(),
    getAccessToken: () => Promise.reject(new Error('Authentication is required.')),
    emailVerificationRequired: false,
  }
}
