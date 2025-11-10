import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { bootstrapAuth } from './state/auth'

// Bootstrap auth token from localStorage
bootstrapAuth()

// Start MSW in development to mock API endpoints
if (import.meta.env.DEV) {
  const { worker } = await import('./msw/browser')
  await worker.start({ onUnhandledRequest: 'bypass' })
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
