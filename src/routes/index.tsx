import { createFileRoute } from '@tanstack/react-router'
import logo from '../logo.svg'
import { GoogleLogin } from '@react-oauth/google';
import { apiBaseUrl } from '@/lib/api';

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  return (
    <div className="text-center">
      <header className="min-h-screen flex flex-col items-center justify-center bg-[#282c34] text-white text-[calc(10px+2vmin)]">
        <img
          src={logo}
          className="h-[40vmin] pointer-events-none animate-[spin_20s_linear_infinite]"
          alt="logo"
        />
        <GoogleLogin
          onSuccess={credentialResponse => {
            const token = credentialResponse?.credential
            if (!token) return console.error('No credential')
            fetch(`${apiBaseUrl}/auth/google`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ credential: token }),
            })
              .then((r) => r.json())
              .then((data) => console.log('Verified user:', data))
              .catch((err) => console.error('Verify error:', err))
          }}
          onError={() => {
            console.log('Login Failed');
          }}
        />
        <p>
          Edit <code>src/routes/index.tsx</code> and save to reload.
        </p>
        <a
          className="text-[#61dafb] hover:underline"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <a
          className="text-[#61dafb] hover:underline"
          href="https://tanstack.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn TanStack
        </a>
      </header>
    </div>
  )
}
